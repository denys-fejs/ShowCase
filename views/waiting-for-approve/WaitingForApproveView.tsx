import { useTranslation } from 'react-i18next';
import { useStoreActions } from 'easy-peasy';

import { IStoreModel } from 'types';
import { PrimaryButton, SectionTitle } from 'components';

import styles from './WaitingForApproveView.module.scss';

const WaitingForApproveView = () => {
  const { t } = useTranslation('views/waiting-for-approve');
  const signOut = useStoreActions<IStoreModel>((actions) => actions.auth.signOut);

  return (
    <div className={styles.container}>
      <div className={styles.messageBox}>
        <SectionTitle
          subtitle={
            <div className={styles.description}>
              <p>{t('description')}</p>
            </div>
          }
        >
          {t('title')}
        </SectionTitle>
        <PrimaryButton className={styles.button} onClick={signOut}>
          {t('signOut')}
        </PrimaryButton>
      </div>
    </div>
  );
};

export default WaitingForApproveView;
