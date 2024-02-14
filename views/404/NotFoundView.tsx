import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { Routes } from 'constants/routes';
import { BasicCard, PrimaryButton } from 'components';
import ErrorLayoutView from 'views/common/layouts/error-layout/ErrorLayoutView';

import styles from './NotFoundVIew.module.scss';

const NotFoundView = () => {
  const { t } = useTranslation('views/common');
  const history = useHistory();

  return (
    <ErrorLayoutView>
      <BasicCard>
        <div className={styles.container}>
          <h1 className={styles.title}>{t('notFound.title')}</h1>
          <h2 className={styles.subtitle}>{t('notFound.subtitle')}</h2>
          <p className={styles.message}>{t('notFound.message')}</p>
          <PrimaryButton onClick={() => history.push(Routes.home)} className={styles.button}>
            {t('notFound.homeButton')}
          </PrimaryButton>
        </div>
      </BasicCard>
    </ErrorLayoutView>
  );
};

export default NotFoundView;
