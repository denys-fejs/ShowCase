import { useTranslation } from 'react-i18next';
import { useStoreActions } from 'easy-peasy';

import { IStoreModel } from 'types/store/store';
import { ProjectStatus } from 'constants/project';
import { PrimaryButton, SectionTitle } from 'components';

import styles from './NoProjectView.module.scss';

const NoProjectView = () => {
  const { t } = useTranslation('views/project');
  const setProjectStatus = useStoreActions<IStoreModel>((actions) => actions.project.setProjectStatus);

  const handleButtonClick = () => {
    setProjectStatus(ProjectStatus.Edited);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <SectionTitle subtitle={t('noProject.subtitle')}>{t('noProject.title')}</SectionTitle>
        <PrimaryButton className={styles.button} onClick={handleButtonClick}>
          {t('noProject.button')}
        </PrimaryButton>
      </div>
    </div>
  );
};

export default NoProjectView;
