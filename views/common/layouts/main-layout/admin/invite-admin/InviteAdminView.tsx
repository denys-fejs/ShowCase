import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FormikProps } from 'formik';

import authAPI from 'api/auth/authAPI';
import { getErrorMessage } from 'utils/error';
import { EmailSchema } from 'validators/auth';
import { NotificationTypes } from 'constants/notificationTypes';
import { IInviteAdminForm } from 'types/forms/auth';
import useModal from 'hooks/useModal';
import { ActionModal, Form, FormField, Notification, PrimaryButton } from 'components';

const initialValues = { email: '' };

const InviteAdminView = () => {
  const { t } = useTranslation('views/admin');
  const { isOpen, open, close } = useModal();
  const formRef = useRef<FormikProps<IInviteAdminForm>>(null);

  const handleSubmit = async (values: IInviteAdminForm) => {
    try {
      await authAPI.inviteAdmin(values);
      Notification({
        notificationType: NotificationTypes.Success,
        message: t('invite.successTitle'),
        description: t('invite.successDescription'),
      });
      formRef?.current?.resetForm();
      close();
    } catch (error) {
      Notification({
        notificationType: NotificationTypes.Error,
        message: t('invite.failTitle'),
        description: getErrorMessage(error),
      });
    }
  };

  const handleConfirm = () => {
    formRef?.current?.handleSubmit();
  };

  return (
    <>
      <PrimaryButton onClick={open} shadow={false}>
        {t('invite.title')}
      </PrimaryButton>
      <ActionModal
        isOpen={isOpen}
        close={close}
        onOk={handleConfirm}
        okText={t('invite.title')}
        title={t('invite.modalTitle')}
      >
        <Form formRef={formRef} initialValues={initialValues} validationSchema={EmailSchema} onSubmit={handleSubmit}>
          <p>{t('invite.description')}</p>
          <FormField name='email' placeholder={t('invite.email')} required />
        </Form>
      </ActionModal>
    </>
  );
};

export default InviteAdminView;
