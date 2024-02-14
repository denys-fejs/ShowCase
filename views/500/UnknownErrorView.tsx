import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { Routes } from 'constants/routes';
import { BasicCard, PrimaryButton } from 'components';
import ErrorLayoutView from 'views/common/layouts/error-layout/ErrorLayoutView';

import styles from './UnknownErrorVIew.module.scss';

const UnknownErrorView = () => {
  const { t } = useTranslation('views/common');
  const history = useHistory();

  return (
    <ErrorLayoutView>
      <BasicCard>
        <div className={styles.container}>
          <h1 className={styles.title}>{t('unknownError.title')}</h1>
          <p className={styles.message}>{t('unknownError.message')}</p>
          <PrimaryButton onClick={() => history.push(Routes.home)} className={styles.button}>
            {t('unknownError.homeButton')}
          </PrimaryButton>
        </div>
      </BasicCard>
    </ErrorLayoutView>
  );
};

export default UnknownErrorView;
