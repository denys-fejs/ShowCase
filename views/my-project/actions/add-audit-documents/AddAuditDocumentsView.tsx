import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useStoreActions } from 'easy-peasy';
import { FormikProps } from 'formik';

import useModal from 'hooks/useModal';
import { NotificationTypes, DOCUMENT_ACCEPT } from 'constants/index';
import { AddAuditDocumentsSchema } from 'validators/project';
import { IStoreModel, IProjectAddAuditDocumentsForm } from 'types';
import { getErrorMessage } from 'utils';
import { ActionModal, DocumentUploadInput, Form, FormField, Notification, PrimaryButton } from 'components';

import styles from './AddAuditDocumentsView.module.scss';

const AddAuditDocumentsView = () => {
  const { t } = useTranslation(['views/project', 'common']);
  const { isOpen, open, close, loading, setLoading } = useModal();
  const formRef = useRef<FormikProps<IProjectAddAuditDocumentsForm>>(null);
  const submitAuditDocuments = useStoreActions<IStoreModel>((actions) => actions.project.submitAuditDocuments);
  const loadProject = useStoreActions<IStoreModel>((actions) => actions.project.loadProject);

  const handleSubmit = async (values: IProjectAddAuditDocumentsForm) => {
    setLoading(true);
    try {
      await submitAuditDocuments(values);
      Notification({
        notificationType: NotificationTypes.Success,
        message: t('common:common.success'),
        description: t('addAuditDocuments.success'),
      });
      await loadProject();
      handleCloseModal();
    } catch (error) {
      Notification({
        notificationType: NotificationTypes.Error,
        message: t('addAuditDocuments.failTitle'),
        description: getErrorMessage(error),
      });
      setLoading(false);
    }
  };

  const handleAddAuditDocuments = () => {
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
      <PrimaryButton className={styles.button} onClick={handleOpenModal}>
        {t('addAuditDocuments.title')}
      </PrimaryButton>
      <ActionModal
        isOpen={isOpen}
        close={handleCloseModal}
        loading={loading}
        onOk={handleAddAuditDocuments}
        okText={t('submitProject')}
        title={t('addAuditDocuments.title')}
      >
        <div>
          <p className={styles.description}>{t('addAuditDocuments.description')}</p>
        </div>
        <Form formRef={formRef} validationSchema={AddAuditDocumentsSchema} onSubmit={handleSubmit}>
          <FormField
            name='documents'
            label={t('projectInfo.auditLegalDocuments')}
            placeholder={t('common:input.documentPlaceholder')}
            inputComponent={DocumentUploadInput}
            accept={DOCUMENT_ACCEPT}
          />
        </Form>
      </ActionModal>
    </>
  );
};

export default AddAuditDocumentsView;
