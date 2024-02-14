import { useTranslation } from 'react-i18next';

import { ProjectStatus } from 'constants/project';

import BasicSearchHeader from 'views/common/headers/basic-search-header/BasicSearchHeader';
import SectionHeader from 'views/common/headers/section-header/SectionHeader';
import AdminProjectsTableView from './table/AdminProjectsTableView';

const filterStatuses = Object.values(ProjectStatus).filter((s) => s !== ProjectStatus.Created);

const AdminProjectsView = () => {
  const { t } = useTranslation('views/admin');

  return (
    <>
      <BasicSearchHeader />
      <SectionHeader>{t('projects.title')}</SectionHeader>
      <AdminProjectsTableView filterStatuses={filterStatuses} />
    </>
  );
};

export default AdminProjectsView;
