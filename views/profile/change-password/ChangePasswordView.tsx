import { useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FormikProps } from 'formik';

import { useModal } from 'hooks';
import { IChangePasswordForm } from 'types';
import profileAPI from 'api/user/profileAPI';
import { NotificationTypes, Routes } from 'constants/index';
import { ChangePasswordSchema } from 'validators/user';
import { getErrorMessage } from 'utils';
import { ActionModal, Form, FormField, IconSvg, Notification } from 'components';

import styles from './ChangePasswordView.module.scss';

const ChangePasswordView = () => {
  const { t } = useTranslation(['views/profile', 'common']);
  const { isOpen, open, close } = useModal();
  const formRef = useRef<FormikProps<IChangePasswordForm>>(null);

  const handleSubmit = useCallback(
    async ({ currentPassword, newPassword }: IChangePasswordForm) => {
      try {
        await profileAPI.changePassword({ currentPassword, newPassword });
        Notification({
          notificationType: NotificationTypes.Success,
          message: t('changePassword.successTitle'),
          description: t('changePassword.successMessage'),
        });
        formRef?.current?.resetForm();
        close();
      } catch (error) {
        Notification({
          notificationType: NotificationTypes.Error,
          message: t('changePassword.failTitle'),
          description: getErrorMessage(error),
        });
      }
    },
    [formRef, close],
  );

  const handleConfirm = useCallback(() => {
    formRef?.current?.handleSubmit();
  }, [formRef]);

  return (
    <div>
      <div className={styles.button} onClick={open}>
        <div>
          <IconSvg icon='key' />
        </div>
        <div className={styles.buttonTitle}>{t('changePassword.title')}</div>
        <div>
          <IconSvg icon='edit' />
        </div>
      </div>
      <ActionModal
        className={styles.modal}
        isOpen={isOpen}
        close={close}
        onOk={handleConfirm}
        okText={t('common:common.change')}
        title={t('changePassword.title')}
        centered
      >
        <Form formRef={formRef} validationSchema={ChangePasswordSchema} onSubmit={handleSubmit}>
          <FormField
            name='currentPassword'
            type='password'
            placeholder={t('changePassword.currentPassword')}
            fieldlabel={t('changePassword.currentPassword')}
            required
          />
          <FormField
            name='newPassword'
            type='password'
            placeholder={t('changePassword.newPassword')}
            fieldlabel={t('changePassword.newPassword')}
            required
          />
          <FormField
            name='newPasswordConfirm'
            type='password'
            placeholder={t('changePassword.newPasswordConfirm')}
            fieldlabel={t('changePassword.newPasswordConfirm')}
            required
          />
        </Form>
        <div className={styles.forgot}>
          <Link to={Routes.forgotPassword}>{t('changePassword.forgot')}</Link>
        </div>
      </ActionModal>
    </div>
  );
};

export default ChangePasswordView;
