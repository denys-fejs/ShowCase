import { Notification, SectionTitle } from 'components';
import { NotificationTypes, Routes } from 'constants/index';
import { useStoreActions } from 'easy-peasy';
import get from 'lodash.get';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router';
import { IStoreModel } from 'types';

import ForgotPasswordFromView from '../forms/ForgotPasswordFormView';

//styles
import styles from '../PasswordView.module.scss';
import bgImage from 'resources/images/bg/signin.png';

const ForgotPasswordView = () => {
  const { t } = useTranslation(['views/forgot-password', 'common']);
  const [isLoading, setLoading] = useState<boolean>(false);

  const history = useHistory();
  const forgotPassword = useStoreActions<IStoreModel>((actions) => actions.auth.forgotPassword);

  const handleForgotPassword = async (email: string) => {
    try {
      setLoading(true);
      await forgotPassword({ email });
      history.push(Routes.signIn);
      Notification({
        notificationType: NotificationTypes.Success,
        message: t('common:common.success'),
        description: t('success.forgotComplete'),
      });
    } catch (error: any) {
      const message = get(error, 'response.data.message', error.message);

      Notification({
        notificationType: NotificationTypes.Error,
        message: t('errors.forgot'),
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
        <ForgotPasswordFromView onSubmit={handleForgotPassword} isLoading={isLoading} />
        <div className={styles.links}>
          <div>
            <Link to={Routes.signIn}>{t('common:common.back')}</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordView;
