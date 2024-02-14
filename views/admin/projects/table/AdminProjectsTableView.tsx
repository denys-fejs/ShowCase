import { memo, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { useHistory } from 'react-router-dom';
import { useLocation } from 'react-router';

import { ProjectStatus, DEFAULT_PAGE_SIZE, Routes, NotificationTypes } from 'constants/index';
import { IStoreModel, IPendingProjectsResponseBody, IProjectResponseBody, RowSpace } from 'types';
import adminProjectsAPI from 'api/admin/adminProjectsAPI';
import { formatDateTime, parseQueryParams } from 'utils';
import { Row, Col, Table, Notification } from 'components';
import FilterProvider from 'views/common/filter/FilterProvider';
import StartReviewActionView from 'views/admin/actions/start-review/StartReviewActionView';
import RejectActionView from 'views/admin/actions/reject/RejectActionView';
import ApproveActionView from 'views/admin/actions/approve/ApproveActionView';
import AdminTableFilters from 'views/admin/actions/table-filters/AdminTableFilters';

import styles from './AdminProjectsTableView.module.scss';

interface IProps {
  filterStatuses: Array<ProjectStatus>;
  tab?: string;
}

const AdminProjectsTableView = ({ filterStatuses, tab = 'projects' }: IProps) => {
  const { t } = useTranslation(['views/admin', 'common']);
  const history = useHistory();
  const location = useLocation();
  const [page, setPage] = useState(1);
  const [tableRefreshTrigger, refreshTable] = useState(false);
  const pendingProjects = useStoreState<IStoreModel, IPendingProjectsResponseBody | null>(
    (store) => store.admin.projects.pendingProjects,
  );
  const isPendingProjectsLoading = useStoreState<IStoreModel, boolean>(
    (store) => store.admin.projects.isPendingProjectsLoading,
  );
  const loadPendingProjects = useStoreActions<IStoreModel>((actions) => actions.admin.projects.loadPendingProjects);
  const startProjectReview = useStoreActions<IStoreModel>((actions) => actions.admin.projects.startProjectReview);
  const approveProject = useStoreActions<IStoreModel>((actions) => actions.admin.projects.approveProject);
  const rejectProject = useStoreActions<IStoreModel>((actions) => actions.admin.projects.rejectProject);

  const loadProjectsList = useCallback(
    (params) => {
      return loadPendingProjects({
        page,
        limit: DEFAULT_PAGE_SIZE,
        ...params,
        status: params?.status ? [params.status] : filterStatuses,
      });
    },
    [loadPendingProjects, page],
  );

  const handleProjectClick = useCallback((project: IProjectResponseBody) => {
    history.push(Routes.adminProject.replace(':id', String(project.id)));
  }, []);

  const resetPage = useCallback(() => {
    setPage(1);
  }, []);

  const handleProjectStartReview = async (project: IProjectResponseBody) => {
    await startProjectReview(project.id);
    setPage(1);
    refreshTable(!tableRefreshTrigger);
  };

  const handleProjectApprove = async (project: IProjectResponseBody, isAuditApproved?: boolean) => {
    const projectDetails = await adminProjectsAPI.getProjectById(project.id);
    try {
      await approveProject({ project: projectDetails, isAuditApproved });
      setPage(1);
      refreshTable(!tableRefreshTrigger);
    } catch (error) {
      Notification({
        notificationType: NotificationTypes.Error,
        message: t('common:errors.connect'),
        description: t(`common:errors.${error.message}`, error.message),
      });
    }
  };

  const handleProjectReject = async (project: IProjectResponseBody, reason?: string) => {
    await rejectProject({ id: project.id, reason });
    setPage(1);
    refreshTable(!tableRefreshTrigger);
  };

  const renderActions = (project: IProjectResponseBody) => {
    switch (project.status) {
      case ProjectStatus.Pending:
        return (
          <>
            <StartReviewActionView
              name={t('projects.project', { name: project.name })}
              onStartReview={() => handleProjectStartReview(project)}
              tableAction
            />
          </>
        );
      case ProjectStatus.InReview:
        return (
          <>
            <Row horizontalSpace={RowSpace.ExtraSmall} wrap={false}>
              <Col flexible>
                <ApproveActionView
                  name={t('projects.project', { name: project.name })}
                  onApprove={(checked?: boolean) => handleProjectApprove(project, checked)}
                  checkboxText={t('projects.auditApproved')}
                  tableAction
                />
              </Col>
              <Col flexible>
                <RejectActionView
                  name={t('projects.project', { name: project.name })}
                  onReject={(reason: string) => handleProjectReject(project, reason)}
                  tableAction
                />
              </Col>
            </Row>
          </>
        );
      default:
        return <div className={styles.emptyAction} />;
    }
  };

  const columns = useMemo(
    () => [
      {
        title: t('projects.id'),
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: t('projects.name'),
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: t('projects.dateCreated'),
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (date: string) => formatDateTime(date),
      },
      {
        title: t('projects.status'),
        dataIndex: 'status',
        key: 'status',
        render: (status: ProjectStatus) => t(`common:project.status.${status}`),
      },
      {
        key: 'actions',
        width: 140,
        render: renderActions,
      },
    ],
    [t, page, tableRefreshTrigger],
  );

  return (
    <div>
      <FilterProvider fetchData={loadProjectsList} onFilter={resetPage} dependencies={[page, tableRefreshTrigger]}>
        <AdminTableFilters statuses={filterStatuses} />
      </FilterProvider>
      <div className={styles.table}>
        <Table
          columns={columns}
          page={page}
          refresh={() => loadProjectsList(parseQueryParams(location.search))}
          loading={isPendingProjectsLoading}
          data={pendingProjects?.items}
          total={pendingProjects?.meta.totalItems}
          onPageChange={setPage}
          onRowClick={handleProjectClick}
          tab={tab}
          bigPlaceholder={true}
        />
      </div>
    </div>
  );
};

export default memo(AdminProjectsTableView);
