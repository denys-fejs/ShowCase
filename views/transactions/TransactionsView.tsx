import { useTranslation } from 'react-i18next';
import { useStoreState } from 'easy-peasy';

import { UserRole } from 'constants/index';
import { useWallet } from 'hooks';
import { IStoreModel } from 'types';
import { MainTabs } from 'components';

import BasicSearchHeader from 'views/common/headers/basic-search-header/BasicSearchHeader';
import SectionHeader from 'views/common/headers/section-header/SectionHeader';
import TxHistoryTableView from './history/TxHistoryTableView';
import RequestsTableView from './requests/RequestsTableView';

import styles from './TransactionsView.module.scss';

const TransactionsView = () => {
  useWallet({ isRedirect: true, isWalletRequired: true });

  const { t } = useTranslation('views/transactions');
  const userRole = useStoreState<IStoreModel, UserRole | undefined>((store) => store.user.profile?.role);

  return (
    <>
      <BasicSearchHeader />
      <SectionHeader className={styles.title} hideDivider>
        {t('title')}
      </SectionHeader>
      <MainTabs
        queryParam='transactionsTab'
        items={[
          {
            key: 'history',
            title: t('history.title'),
            content: <TxHistoryTableView />,
          },
          {
            key: 'requests',
            title: t('requests.title'),
            content: <RequestsTableView />,
            isShow: userRole === UserRole.Project,
          },
        ]}
      />
    </>
  );
};

export default TransactionsView;
