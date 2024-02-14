import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { FormikProps } from 'formik';
import { useHistory } from 'react-router';

import useModal from 'hooks/useModal';
import { NotificationTypes, DOCUMENT_ACCEPT, Routes } from 'constants/index';
import { RequestTokensSchema } from 'validators/project';
import { IssueTokenType, tokenRequestTypeMap, IStoreModel, IProjectTokensRequestForm } from 'types';
import { formatWalletAddress, getErrorMessage } from 'utils';
import { ActionModal, DocumentUploadInput, Form, FormField, IconSvg, Notification } from 'components';

import styles from './RequestTokensView.module.scss';

const RequestTokensView = () => {
  const { t } = useTranslation(['views/project', 'common']);
  const history = useHistory();
  const { isOpen, open, close, loading, setLoading } = useModal();
  const formRef = useRef<FormikProps<IProjectTokensRequestForm>>(null);
  const accountAddress = useStoreState<IStoreModel, string | undefined>((state) => state.user.profile?.accountAddress);
  const submitTokensRequest = useStoreActions<IStoreModel>((actions) => actions.project.submitTokensRequest);

  const handleSubmit = async (values: IProjectTokensRequestForm) => {
    setLoading(true);
    try {
      await submitTokensRequest({
        ...values,
        type: tokenRequestTypeMap[IssueTokenType.requestTokens],
      });
      Notification({
        notificationType: NotificationTypes.Success,
        message: t('common:common.success'),
        description: t('requestTokens.success'),
      });
      history.push(Routes.myProject);
      handleCloseModal();
    } catch (error) {
      Notification({
        notificationType: NotificationTypes.Error,
        message: t('requestTokens.failTitle'),
        description: getErrorMessage(error),
      });
      setLoading(false);
    }
  };

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
      <div className={styles.button} onClick={handleOpenModal}>
        <FormField
          name='emissionReductions'
          type='number'
          placeholder={t('projectInfo.emissionReductions')}
          suffix={<IconSvg icon='edit' />}
          fieldlabel={t('projectInfo.emissionReductions')}
          disabled
        />
      </div>
      <ActionModal
        isOpen={isOpen}
        close={handleCloseModal}
        loading={loading}
        onOk={handleIssueTokenRequest}
        okText={t('submitProject')}
        title={t('requestTokens.title')}
      >
        <div>
          <p className={styles.description}>
            {t('requestTokens.description', { walletAddress: formatWalletAddress(accountAddress) })}
          </p>
        </div>
        <Form formRef={formRef} validationSchema={RequestTokensSchema} onSubmit={handleSubmit}>
          <FormField
            name='amount'
            type='number'
            placeholder={t('common:input.amount')}
            help={t('requestTokens.amountHelp')}
            suffix={t('projectInfo.emissionUnit')}
            required
          />
          <div className={styles.documentsContainer}>
            <FormField
              name='documents'
              label={t('projectInfo.auditLegalDocuments')}
              placeholder={t('common:input.documentPlaceholder')}
              inputComponent={DocumentUploadInput}
              accept={DOCUMENT_ACCEPT}
              labelIsBlack={true}
            />
          </div>
        </Form>
      </ActionModal>
    </>
  );
};

export default RequestTokensView;
