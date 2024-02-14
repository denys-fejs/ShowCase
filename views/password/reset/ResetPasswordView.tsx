import { Notification, SectionTitle } from 'components';
import { NotificationTypes, Routes } from 'constants/index';
import { useStoreActions } from 'easy-peasy';
import get from 'lodash.get';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useHistory, useParams } from 'react-router';
import { IStoreModel } from 'types';

import ResetPasswordFromView from '../forms/ResetPasswordFormView';

//styles
import styles from '../PasswordView.module.scss';
import bgImage from 'resources/images/bg/signin.png';

const ResetPasswordView = () => {
  const { t } = useTranslation(['views/reset-password', 'common']);
  const [isLoading, setLoading] = useState<boolean>(false);

  const { token } = useParams<{ token: string }>();
  const history = useHistory();
  const resetPassword = useStoreActions<IStoreModel>((actions) => actions.auth.resetPassword);

  const handleResetPassword = async (password: string) => {
    try {
      setLoading(true);
      await resetPassword({ token, password });
      history.push(Routes.signIn);
      Notification({
        notificationType: NotificationTypes.Success,
        message: t('common:common.success'),
        description: t('success.resetComplete'),
      });
    } catch (error: any) {
      let message = get(error, 'response.data.message', error.message);
      if (Array.isArray(message)) {
        message = message.map((i) => i.errors.join(', ')).join(', ');
      }

      Notification({
        notificationType: NotificationTypes.Error,
        message: t('errors.reset'),
        description: t(`common:errors.${message}`, message),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.backgroundImage} style={{ backgroundImage: `url("${bgImage}")` }} />
      <div className={styles.card}>
        <SectionTitle className={styles.title}>{t('title')}</SectionTitle>
        <ResetPasswordFromView onSubmit={handleResetPassword} isLoading={isLoading} />
        <div className={styles.links}>
          <div>
            <Link to={Routes.signIn}>{t('common:common.back')}</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordView;
