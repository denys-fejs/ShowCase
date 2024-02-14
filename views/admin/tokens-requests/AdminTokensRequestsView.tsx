import { useTranslation } from 'react-i18next';

import { IssueTokenStatus, IssueTokenType } from 'types/api/issue-tokens';
import BasicSearchHeader from 'views/common/headers/basic-search-header/BasicSearchHeader';
import SectionHeader from 'views/common/headers/section-header/SectionHeader';
import AdminTokensRequestsTableView from './table/AdminTokensRequestsTableView';

const filterStatuses = Object.values(IssueTokenStatus);
const filterTypes = Object.values(IssueTokenType);

const AdminTokenRequestsView = () => {
  const { t } = useTranslation('views/admin');

  return (
    <>
      <BasicSearchHeader />
      <SectionHeader>{t('requests.title')}</SectionHeader>
      <AdminTokensRequestsTableView filterStatuses={filterStatuses} filterTypes={filterTypes} />
    </>
  );
};

export default AdminTokenRequestsView;
