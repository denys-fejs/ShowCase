import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router';

import { Routes } from 'constants/routes';
import useFetch from 'hooks/useFetch';
import authAPI from 'api/auth/authAPI';
import { MainLoader, SectionTitle, PrimaryButton } from 'components';
import useAuthRole from 'hooks/useAuthRole';

//styles
import styles from './SignUpActivateView.module.scss';

const SignUpActivateView = () => {
  useAuthRole({ isAuthRequired: false });

  const { t } = useTranslation('views/sign-up');
  const { token } = useParams<{ token: string }>();
  const history = useHistory();
  const { loading } = useFetch(() => authAPI.activate({ token }));

  return (
    <div className={styles.container}>
      <div>
        <MainLoader isLoading={loading}>
          <SectionTitle subtitle={t('activate.success')}>{t('activate.title')}</SectionTitle>
          <PrimaryButton className={styles.button} onClick={() => history.push(Routes.signIn)}>
            {t('activate.button')}
          </PrimaryButton>
        </MainLoader>
      </div>
    </div>
  );
};

export default SignUpActivateView;
