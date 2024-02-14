import { useTranslation } from 'react-i18next';
import { useStoreState } from 'easy-peasy';

import { IssueTokenStatus, IssueTokenType, IStoreModel } from 'types';
import { CompanyStatus, ProjectStatus, UserStatus } from 'constants/index';
import BasicSearchHeader from 'views/common/headers/basic-search-header/BasicSearchHeader';
import SectionHeader from 'views/common/headers/section-header/SectionHeader';
import { MainTabs, SectionTitle } from 'components';
import RegistrationChartView from './registration-chart/RegistrationChartView';
import AdminProjectsTableView from '../projects/table/AdminProjectsTableView';
import AdminCompaniesTableView from '../companies/table/AdminCompaniesTableView';
import AdminTokensRequestsTableView from '../tokens-requests/table/AdminTokensRequestsTableView';

import styles from './AdminDashboardView.module.scss';
import bgImage from 'resources/images/bg/tristan-portfolio.png';
import { useContext, useEffect } from 'react';
import MainLayoutContext from '../../common/layouts/main-layout/basic/BasicMainLayoutContext';
import AdminUsersTableView from '../users/table/AdminUsersTableView';

const projectStatuses = [ProjectStatus.Pending, ProjectStatus.InReview];
const companyStatuses = [CompanyStatus.Pending, CompanyStatus.InReview];
const userStatuses = [UserStatus.Pending];
const tokensRequestsStatuses = [IssueTokenStatus.Pending, IssueTokenStatus.InReview];
const tokensRequestsTypes = [IssueTokenType.requestTokens, IssueTokenType.issueTokensRequest];

const AdminDashboardView = () => {
  const { t } = useTranslation('views/admin');
  const pendingProjectsCount = useStoreState<IStoreModel, number | undefined>(
    (store) => store.admin.projects.pendingProjects?.meta.totalItems,
  );
  const pendingCompaniesCount = useStoreState<IStoreModel, number | undefined>(
    (store) => store.admin.companies.pendingCompanies?.meta.totalItems,
  );
  const usersCount = useStoreState<IStoreModel, number | undefined>(
    (store) => store.admin.users.users?.meta.totalItems,
  );
  const tokensRequestsCount = useStoreState<IStoreModel, number | undefined>(
    (store) => store.admin.tokensRequests.tokensRequestsList?.meta.totalItems,
  );

  const { setBackgroundImage } = useContext(MainLayoutContext);
  useEffect(() => {
    setBackgroundImage && setBackgroundImage(bgImage);

    return () => {
      setBackgroundImage && setBackgroundImage('');
    };
  }, [setBackgroundImage]);

  return (
    <>
      <BasicSearchHeader />
      <SectionHeader>{t('dashboard.title')}</SectionHeader>
      <RegistrationChartView />
      <SectionTitle className={styles.title}>{t('myActivity')}</SectionTitle>
      <MainTabs
        queryParam='dashboardTab'
        renderInactive={false}
        items={[
          {
            key: 'projects',
            title: `${t('projects.title')} ${pendingProjectsCount ? `(${pendingProjectsCount})` : ''}`,
            content: <AdminProjectsTableView filterStatuses={projectStatuses} tab='Projects' />,
            isShow: true,
          },
          {
            key: 'companies',
            title: `${t('companies.title')} ${pendingCompaniesCount ? `(${pendingCompaniesCount})` : ''}`,
            content: <AdminCompaniesTableView filterStatuses={companyStatuses} tab='Companies' />,
            isShow: true,
          },
          {
            key: 'admins',
            title: `${t('admins.title')} ${usersCount ? `(${usersCount})` : ''}`,
            content: <AdminUsersTableView filterStatuses={userStatuses} tab='Admins' />,
            isShow: true,
          },
          {
            key: 'requests',
            title: `${t('requests.title')} ${tokensRequestsCount ? `(${tokensRequestsCount})` : ''}`,
            content: (
              <AdminTokensRequestsTableView
                filterStatuses={tokensRequestsStatuses}
                filterTypes={tokensRequestsTypes}
                tab='Requests'
              />
            ),
            isShow: true,
          },
        ]}
      />
    </>
  );
};

export default AdminDashboardView;
