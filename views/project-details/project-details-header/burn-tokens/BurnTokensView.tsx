import React, { useCallback, useContext, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FormikProps } from 'formik';
import { useStoreActions, useStoreState } from 'easy-peasy';

import useModal from 'hooks/useModal';
import useFetch from 'hooks/useFetch';
import appConfig from 'config/appConfig';
import { TokenContract } from 'blockchain';
import { IProjectBurnTokensForm, IStoreModel, IWalletState } from 'types';
import { getBurnTokensSchema } from 'validators/project';
import { NotificationTypes, SocketEvents } from 'constants/index';
import { formatHashRequest, formatTxHash, getErrorMessage } from 'utils';
import { ActionModal, CopyButton, Divider, Form, FormField, Notification, PrimaryButton } from 'components';
import SocketContext from 'views/common/socket/SocketContext';

import styles from './BurnTokensView.module.scss';

interface IProps {
  projectId: number;
  tokenAddr: string;
  tokenTicker?: string | null;
  className?: string;
}

const BurnTokensView = ({ projectId, tokenAddr, tokenTicker, className }: IProps) => {
  const { t } = useTranslation(['views/project', 'common']);
  const formRef = useRef<FormikProps<IProjectBurnTokensForm>>(null);
  const { isOpen, open, close, loading, setLoading } = useModal();
  const wallet = useStoreState<IStoreModel, IWalletState>((state) => state.blockchain.wallet);
  const loadProjectById = useStoreActions<IStoreModel>((actions) => actions.project.loadProjectById);
  const burnTokens = useStoreActions<IStoreModel>((actions) => actions.project.burnTokens);
  const { emit, subscribe } = useContext(SocketContext);
  const tokenUnit = tokenTicker || t('common:blockchain.tokenUnit');

  const { response: tokenBalance } = useFetch(async () => {
    if (!wallet.walletAddress || !tokenAddr) {
      return null;
    }
    const contract = new TokenContract(tokenAddr);
    return contract.balanceOf(wallet.walletAddress);
  }, [wallet.walletAddress, tokenAddr]);

  const BurnTokensSchema = useMemo(() => {
    return getBurnTokensSchema(Number(tokenBalance));
  }, [tokenBalance]);

  const handleSubmit = async (values: IProjectBurnTokensForm) => {
    setLoading(true);
    try {
      const tx = await burnTokens({ tokenAddr, amount: values.amount });
      if (tx?.hash && emit && subscribe) {
        const txHash = formatHashRequest(tx.hash);
        Notification({
          key: txHash,
          notificationType: NotificationTypes.Info,
          message: t('burn.inProgressMessage'),
          description: (
            <>
              {t('burn.inProgressDescription')} <CopyButton textToCopy={txHash}>{formatTxHash(txHash)}</CopyButton>
              <br />
              <a
                href={`${appConfig.explorerUrl}/tx/${txHash}`}
                target='_blank'
                rel='noreferrer'
                className={styles.viewTransaction}
              >
                {t('common:common.viewTransaction')}
              </a>
            </>
          ),
          autoClose: false,
        });

        subscribe(SocketEvents.BurnsInfo, ({ meta }) => {
          if (meta.txHash === txHash) {
            Notification({
              key: txHash,
              notificationType: NotificationTypes.Success,
              message: t('common:common.success'),
              description: t('burn.success'),
            });
            loadProjectById(projectId);
          }
        });
        emit(SocketEvents.BurnsNew, { txHash, projectId });
      } else {
        Notification({
          notificationType: NotificationTypes.Success,
          message: t('common:common.success'),
          description: t('burn.success'),
        });
        await loadProjectById(projectId);
      }
      handleCloseModal();
    } catch (error) {
      Notification({
        notificationType: NotificationTypes.Error,
        message: t('burn.failTitle'),
        description: getErrorMessage(error),
      });
      setLoading(false);
    }
  };

  const handleBurn = () => {
    formRef?.current?.handleSubmit();
  };

  const handleOpenModal = () => {
    formRef?.current?.resetForm();
    open();
  };

  const handleCloseModal = () => {
    formRef?.current?.resetForm();
    close();
  };

  const handleSetMaxAmount = useCallback(() => {
    formRef.current?.setFieldValue('amount', Number(tokenBalance));
  }, [formRef, tokenBalance]);

  return (
    <>
      <PrimaryButton className={className} onClick={handleOpenModal}>
        {t('projectInfo.burnButton')}
      </PrimaryButton>
      <ActionModal
        isOpen={isOpen}
        close={handleCloseModal}
        loading={loading}
        onOk={handleBurn}
        okText={t('burn.submit')}
        title={t('burn.title')}
      >
        <div>
          <div className={styles.available}>
            {t('issueTokens.available')}:
            <span className={styles.availableAmount}>
              {tokenBalance} {tokenUnit}
            </span>
          </div>
        </div>
        <Form formRef={formRef} validationSchema={BurnTokensSchema} onSubmit={handleSubmit}>
          <FormField
            name='amount'
            type='number'
            placeholder={t('common:input.amount')}
            help={t('burn.amountHelp')}
            suffix={
              <span>
                {tokenUnit}
                <Divider type='vertical' className={styles.divider} />
                <span className={styles.highlighted} onClick={handleSetMaxAmount}>
                  {t('issueTokens.max')}
                </span>
              </span>
            }
            required
          />
        </Form>
      </ActionModal>
    </>
  );
};

export default BurnTokensView;
