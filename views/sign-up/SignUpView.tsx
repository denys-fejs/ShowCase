import { useTranslation } from 'react-i18next';

import { InfoLinkBlock, Row, Col, SectionTitle } from 'components';
import { Routes } from 'constants/routes';
import useAuthRole from 'hooks/useAuthRole';

//styles
import styles from './SignUpView.module.scss';

const SignUpView = () => {
  useAuthRole({ isAuthRequired: false });

  const { t } = useTranslation('views/sign-up');

  return (
    <div>
      <SectionTitle>{t('title')}</SectionTitle>
      <Row justify='center' className={styles.container}>
        <Col flexible>
          <InfoLinkBlock
            icon='factory'
            title={t('companies')}
            text={t('companiesText')}
            linkLabel={t('register')}
            linkRoute={Routes.signUpCompany}
          />
        </Col>
        <Col flexible>
          <InfoLinkBlock
            icon='planet'
            title={t('projects')}
            text={t('projectsText')}
            linkLabel={t('register')}
            linkRoute={Routes.signUpProject}
          />
        </Col>
      </Row>
    </div>
  );
};

export default SignUpView;
