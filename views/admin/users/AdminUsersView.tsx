import { useTranslation } from 'react-i18next';

import { UserStatus } from 'constants/user';
import BasicSearchHeader from 'views/common/headers/basic-search-header/BasicSearchHeader';
import SectionHeader from 'views/common/headers/section-header/SectionHeader';
import AdminUsersTableView from './table/AdminUsersTableView';

const filterStatuses = Object.values(UserStatus);

const AdminUsersView = () => {
  const { t } = useTranslation('views/admin');

  return (
    <>
      <BasicSearchHeader />
      <SectionHeader>{t('admins.title')}</SectionHeader>
      <AdminUsersTableView filterStatuses={filterStatuses} />
    </>
  );
};

export default AdminUsersView;
