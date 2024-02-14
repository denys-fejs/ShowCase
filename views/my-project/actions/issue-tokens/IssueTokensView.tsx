import React, { useCallback, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { FormikProps } from 'formik';

import useModal from 'hooks/useModal';
import { NotificationTypes } from 'constants/notificationTypes';
import { getIssueTokensSchema } from 'validators/project';
import {
  IProjectDetailsResponseBody,
  IProjectTokensRequestForm,
  IssueTokenStatus,
  IssueTokenType,
  IStoreModel,
  tokenRequestTypeMap,
} from 'types';
import { useFetch } from 'hooks';
import { TokenContract } from 'blockchain';
import { formatWalletAddress, getErrorMessage } from 'utils';
import { ActionModal, Divider, Form, FormField, Notification, PrimaryButton } from 'components';

import styles from './IssueTokensView.module.scss';

interface IIssueTokenViewProps {
  project: IProjectDetailsResponseBody;
}

const IssueTokensView = ({ project }: IIssueTokenViewProps) => {
  const { t } = useTranslation(['views/project', 'common']);
  const { isOpen, open, close, loading, setLoading } = useModal();
  const formRef = useRef<FormikProps<IProjectTokensRequestForm>>(null);
  const accountAddress = useStoreState<IStoreModel, string | undefined>((state) => state.user.profile?.accountAddress);
  const submitTokensRequest = useStoreActions<IStoreModel>((actions) => actions.project.submitTokensRequest);
  const loadProject = useStoreActions<IStoreModel>((actions) => actions.project.loadProject);

  const contract = useMemo(
    () => (project.tokenAddr ? new TokenContract(project.tokenAddr) : null),
    [project.tokenAddr],
  );
  const { response: tokenBalance } = useFetch(async () => contract?.getTotalSupply(), [contract]);
  const { response: totalBurned } = useFetch(async () => contract?.getTotalBurned(), [contract]);
  const availableAmount = project.emissionReductions - Number(tokenBalance) - Number(totalBurned);
  const IssueTokensSchema = getIssueTokensSchema(availableAmount);

  const handleSubmit = async (values: IProjectTokensRequestForm) => {
    setLoading(true);
    try {
      await submitTokensRequest({
        amount: parseInt(values.amount),
        type: tokenRequestTypeMap[IssueTokenType.issueTokensRequest],
      });
      Notification({
        notificationType: NotificationTypes.Success,
        message: t('common:common.success'),
        description: t('issueTokens.success'),
      });
      await loadProject();
      handleCloseModal();
    } catch (error) {
      Notification({
        notificationType: NotificationTypes.Error,
        message: t('issueTokens.failTitle'),
        description: getErrorMessage(error),
      });
      setLoading(false);
    }
  };

  const handleSetMaxAmount = useCallback(() => {
    formRef.current?.setFieldValue('amount', Number(availableAmount));
  }, [formRef, tokenBalance]);

  const handleIssueTokenRequest = () => {
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

  return (
    <>
      <PrimaryButton
        className={styles.button}
        disabled={project?.issueTokensRequest?.status === IssueTokenStatus.Pending}
        onClick={handleOpenModal}
      >
        {t('issueTokens.title')}
      </PrimaryButton>
      <ActionModal
        isOpen={isOpen}
        close={handleCloseModal}
        loading={loading}
        onOk={handleIssueTokenRequest}
        okText={t('submitProject')}
        title={t('issueTokens.title')}
      >
        <div>
          <p className={styles.description}>
            {t('issueTokens.description', { walletAddress: formatWalletAddress(accountAddress) })}
          </p>
          <div className={styles.available}>
            {t('issueTokens.available')}:<span className={styles.availableAmount}>{availableAmount}</span>
            <p className={styles.availablePlaceholder}>
              {t('issueTokens.availablePlaceholder', { walletAddress: formatWalletAddress(accountAddress) })}
            </p>
          </div>
        </div>
        <Form formRef={formRef} validationSchema={IssueTokensSchema} onSubmit={handleSubmit}>
          <FormField
            name='amount'
            type='number'
            placeholder={t('common:input.amount')}
            help={t('issueTokens.amountHelp')}
            suffix={
              <span>
                {t('projectInfo.emissionUnit')}
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

export default IssueTokensView;
