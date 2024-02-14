import { useTranslation } from 'react-i18next';
import { useStoreActions } from 'easy-peasy';
import { useHistory } from 'react-router';

import { SectionTitle } from 'components';
import { ISignUpCompanyForm, IStoreModel } from 'types';
import SignUpCompanyFormView from '../forms/SignUpCompanyFormView';
import { Routes } from 'constants/routes';
import { useAuthRole } from 'hooks';

//styles
import styles from './SignUpCompanyView.module.scss';

const SignUpCompanyView = () => {
  useAuthRole({ isAuthRequired: false });

  const { t } = useTranslation('views/sign-up');
  const history = useHistory();
  const signUpCompany = useStoreActions<IStoreModel>((actions) => actions.auth.signUpCompany);

  const handleSubmit = async (values: ISignUpCompanyForm) => {
    await signUpCompany(values);
    history.push(Routes.signUpSuccess, { email: values.email });
  };

  return (
    <>
      <SectionTitle subtitle={t('company.subtitle')}>{t('company.title')}</SectionTitle>
      <div className={styles.formContainer}>
        <SignUpCompanyFormView onSubmit={handleSubmit} />
      </div>
    </>
  );
};

export default SignUpCompanyView;
