import { useTranslation } from 'react-i18next';
import { useStoreActions } from 'easy-peasy';
import { useHistory } from 'react-router';

import { ISignUpAdminForm } from 'types/forms/auth';
import { Routes } from 'constants/routes';
import { IStoreModel } from 'types/store/store';
import { SectionTitle } from 'components';
import SignUpAdminFormView from '../forms/SignUpAdminFormView';
import useAuthRole from 'hooks/useAuthRole';

//styles
import styles from './SignUpAdminView.module.scss';

const SignUpAdminView = () => {
  useAuthRole({ isAuthRequired: false });

  const { t } = useTranslation('views/sign-up');
  const history = useHistory();
  const signUpAdmin = useStoreActions<IStoreModel>((actions) => actions.auth.signUpAdmin);

  const handleSubmit = async (values: ISignUpAdminForm) => {
    await signUpAdmin(values);
    history.push(Routes.adminDashboard);
  };

  return (
    <>
      <SectionTitle>{t('admin.title')}</SectionTitle>
      <div className={styles.formContainer}>
        <SignUpAdminFormView onSubmit={handleSubmit} />
      </div>
    </>
  );
};

export default SignUpAdminView;
