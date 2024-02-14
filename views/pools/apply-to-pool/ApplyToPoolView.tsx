import React, { useCallback, useRef } from 'react';
import { ActionModal, Divider, Form, FormField, Notification, PrimaryButton } from 'components';
import { useTranslation } from 'react-i18next';
import useModal from 'hooks/useModal';
import { FormikProps } from 'formik';
import { IProjectTokensRequestForm, IStoreModel, IWalletState } from 'types';
import styles from './ApplyToPoolView.module.scss';
import { formatWalletAddress, getErrorMessage } from 'utils';
import { useStoreState } from 'easy-peasy';
import { TokenContract } from 'blockchain';
import { useFetch } from 'hooks';
import { getApplyToPoolFormSchema } from 'validators/pool';
import { poolAPI } from 'api/pool/poolAPI';
import { NotificationTypes } from 'constants/index';

interface IProps {
  tokenAddr: string;
  publicProjectId: number;
  poolId: number;
}
const ApplyToPoolView = ({ tokenAddr, publicProjectId, poolId }: IProps) => {
  const { t } = useTranslation(['views/pools', 'common']);
  const { isOpen, open, close, loading, setLoading } = useModal();
  const formRef = useRef<FormikProps<IProjectTokensRequestForm>>(null);

  const accountAddress = useStoreState<IStoreModel, string | undefined>((state) => state.user.profile?.accountAddress);
  const wallet = useStoreState<IStoreModel, IWalletState>((store) => store.blockchain.wallet);

  const { response: tokenBalance } = useFetch(async () => {
    if (!wallet.walletAddress) {
      return null;
    }
    const contract = new TokenContract(tokenAddr);
    return contract.balanceOf(wallet.walletAddress);
  }, [wallet.walletAddress, tokenAddr]);

  const handleApplyRequest = () => {
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

  const handleSubmit = async (values: number) => {
    setLoading(true);
    // firstly approve allowance of values.amount tokens
    try {
      await poolAPI.applyToPoolRequest({ project: publicProjectId, pool: poolId });
      Notification({
        notificationType: NotificationTypes.Success,
        message: t('common:common.success'),
        description: t('apply.success'),
      });
    } catch (error) {
      Notification({
        notificationType: NotificationTypes.Error,
        message: t('apply.failTitle'),
        description: getErrorMessage(error),
      });
    }
    setLoading(false);
  };

  const handleSetMaxAmount = useCallback(() => {
    formRef.current?.setFieldValue('amount', Number(tokenBalance));
  }, [formRef, tokenBalance]);

  const ApplyToPoolFormSchema = getApplyToPoolFormSchema(Number(tokenBalance));
  return (
    <>
      <PrimaryButton className={styles.button} onClick={handleOpenModal}>
        {t('apply.title')}
      </PrimaryButton>
      <ActionModal
        isOpen={isOpen}
        close={handleCloseModal}
        loading={loading}
        onOk={handleApplyRequest}
        okText={t('apply.submit')}
        title={t('apply.title')}
      >
        <div>
          <p className={styles.description}>
            {t('apply.description', { walletAddress: formatWalletAddress(accountAddress) })}
          </p>
          <div className={styles.available}>
            {t('apply.available')}:<span className={styles.availableAmount}>{tokenBalance}</span>
            <p className={styles.availablePlaceholder}>
              {t('apply.availablePlaceholder', { walletAddress: formatWalletAddress(accountAddress) })}
            </p>
          </div>
        </div>
        <Form formRef={formRef} validationSchema={ApplyToPoolFormSchema} onSubmit={handleSubmit}>
          <FormField
            name='amount'
            type='number'
            placeholder={t('common:input.amount')}
            help={t('apply.amountHelp')}
            suffix={
              <span>
                {t('apply.emissionUnit')}
                <Divider type='vertical' className={styles.divider} />
                <span className={styles.highlighted} onClick={handleSetMaxAmount}>
                  {t('apply.max')}
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

export default ApplyToPoolView;
