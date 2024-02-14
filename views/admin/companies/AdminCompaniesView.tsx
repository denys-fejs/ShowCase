import { useTranslation } from 'react-i18next';

import { CompanyStatus } from 'constants/company';
import BasicSearchHeader from 'views/common/headers/basic-search-header/BasicSearchHeader';
import SectionHeader from 'views/common/headers/section-header/SectionHeader';
import AdminCompaniesTableView from './table/AdminCompaniesTableView';

const filterStatuses = Object.values(CompanyStatus);

const AdminCompaniesView = () => {
  const { t } = useTranslation('views/admin');

  return (
    <>
      <BasicSearchHeader />
      <SectionHeader>{t('companies.title')}</SectionHeader>
      <AdminCompaniesTableView filterStatuses={filterStatuses} />
    </>
  );
};

export default AdminCompaniesView;
