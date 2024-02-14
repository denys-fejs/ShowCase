import { useTranslation } from 'react-i18next';
import { useStoreActions } from 'easy-peasy';
import { useHistory } from 'react-router';

import { SectionTitle } from 'components';
import { ISignUpProjectForm, IStoreModel } from 'types';
import SignUpProjectFormView from '../forms/SignUpProjectFormView';
import styles from './SignUpProjectView.module.scss';
import { Routes } from 'constants/routes';
import { useAuthRole } from 'hooks';

const SignUpProjectView = () => {
  useAuthRole({ isAuthRequired: false });

  const { t } = useTranslation('views/sign-up');
  const history = useHistory();
  const signUpProject = useStoreActions<IStoreModel>((actions) => actions.auth.signUpProject);

  const handleSubmit = async (values: ISignUpProjectForm) => {
    await signUpProject(values);
    history.push(Routes.signUpSuccess, { email: values.email });
  };

  return (
    <>
      <SectionTitle subtitle={t('project.subtitle')}>{t('project.title')}</SectionTitle>
      <div className={styles.formContainer}>
        <SignUpProjectFormView onSubmit={handleSubmit} />
      </div>
    </>
  );
};

export default SignUpProjectView;
