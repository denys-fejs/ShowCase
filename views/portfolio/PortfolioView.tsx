import { useTranslation } from 'react-i18next';
import BasicSearchHeader from 'views/common/headers/basic-search-header/BasicSearchHeader';
import SectionHeader from 'views/common/headers/section-header/SectionHeader';
import { useContext, useEffect } from 'react';
import MainLayoutContext from 'views/common/layouts/main-layout/basic/BasicMainLayoutContext';
import PurchasesHistoryTableView from './PurchasesHistory/PurchasesHistoryTableView';
import PurchasesProjectCards from './PurchasesProjectCards/PurchasesProjectCards';
import { useWallet } from 'hooks';

//styles
import styles from './PortfolioView.module.scss';
import bgImage from 'resources/images/bg/tristan-portfolio.png';

const PortfolioView = () => {
  const { t } = useTranslation('views/portfolio');
  useWallet({ isRedirect: true, isWalletRequired: true });

  const { setBackgroundImage } = useContext(MainLayoutContext);
  useEffect(() => {
    setBackgroundImage && setBackgroundImage(bgImage);

    return () => {
      setBackgroundImage && setBackgroundImage('');
    };
  }, [setBackgroundImage]);

  return (
    <>
      <BasicSearchHeader onSearch={() => undefined} />
      <SectionHeader>{t('title')}</SectionHeader>
      <div className={styles.projectSectionHeader}>
        <h5 className={styles.projectSectionTitle}>{t('My purchases')}</h5>
      </div>
      <PurchasesHistoryTableView />
      <PurchasesProjectCards />
    </>
  );
};

export default PortfolioView;
