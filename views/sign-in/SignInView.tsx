import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useStoreActions } from 'easy-peasy';
import { useHistory } from 'react-router';

import { Routes, UserRole } from 'constants/index';
import { ISignInForm, IStoreModel } from 'types';
import useAuthRole from 'hooks/useAuthRole';
import { SectionTitle } from 'components';

import SignInFormView from './form/SignInFormView';

//styles
import styles from './SignInView.module.scss';
import bgImage from 'resources/images/bg/signin.png';

const SignInView = () => {
  const { t } = useTranslation('views/sign-in');
  useAuthRole({ isAuthRequired: false });

  const signIn = useStoreActions<IStoreModel>((actions) => actions.auth.signIn);
  const history = useHistory();

  const handleSignIn = async (values: ISignInForm) => {
    const profile = await signIn(values);

    switch (profile.role) {
      case UserRole.Admin:
        history.push(Routes.adminDashboard);
        break;
      case UserRole.Project:
        history.push(Routes.myProject);
        break;
      default:
        history.push(Routes.home);
        break;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.backgroundImage} style={{ backgroundImage: `url("${bgImage}")` }} />
      <div className={styles.card}>
        <SectionTitle className={styles.title}>{t('title')}</SectionTitle>
        <SignInFormView onSubmit={handleSignIn} />
        <div className={styles.links}>
          <div>
            <Link to={Routes.forgotPassword}>{t('forgotPassword')}</Link>
          </div>
          <div>
            <Link to={Routes.signUp}>{t('noAccount')}</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInView;
