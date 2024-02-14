import { Trans, useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { useStoreActions } from 'easy-peasy';

import { Routes } from 'constants/routes';
import { SectionTitle, PrimaryButton, Notification, BlockLoader } from 'components';
import useAuthRole from 'hooks/useAuthRole';
import { IStoreModel } from 'types';

//styles
import styles from './SignUpSuccessView.module.scss';
import { NotificationTypes } from 'constants/index';
import { useState } from 'react';

const SignUpSuccessView = () => {
  useAuthRole({ isAuthRequired: false });

  const [loading, setLoading] = useState<boolean>(false);
  const { t } = useTranslation(['views/sign-up', 'common']);
  const history = useHistory<{ email: string }>();
  const resendActivation = useStoreActions<IStoreModel>((actions) => actions.auth.resendActivation);

  if (!history.location.state?.email) {
    history.replace(Routes.signUp);
  }

  const handleClick = async (email: string) => {
    try {
      setLoading(true);
      await resendActivation({ email });
      Notification({
        notificationType: NotificationTypes.Success,
        message: t('common:common.success'),
        description: t('success.resendComplete'),
      });
    } catch (error: any) {
      Notification({
        notificationType: NotificationTypes.Error,
        message: t('errors.resend'),
        description: t(`common:errors.${error.message}`, error.message),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.messageBox}>
        <BlockLoader isLoading={loading}>
          <SectionTitle
            subtitle={
              <>
                {t('success.text')}
                <br />
                <br />
                <Trans
                  t={t}
                  i18nKey='success.resend'
                  components={[<a key='email' onClick={() => handleClick(history.location.state?.email)} />]}
                  values={{ email: history.location.state?.email }}
                />
              </>
            }
          >
            {t('success.title')}
          </SectionTitle>
          <PrimaryButton className={styles.button} onClick={() => history.push(Routes.signIn)}>
            {t('common:common.continue')}
          </PrimaryButton>
        </BlockLoader>
      </div>
    </div>
  );
};

export default SignUpSuccessView;
