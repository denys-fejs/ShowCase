import { memo, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { useHistory } from 'react-router-dom';

import { IStoreModel, RowSpace, IAdminUserResponseBody, IAdminUsersResponseBody } from 'types';
import { UserStatus } from 'constants/user';
import { DEFAULT_PAGE_SIZE } from 'constants/common';
import { Routes } from 'constants/routes';
import { formatDateTime } from 'utils';
import { Row, Col, Table } from 'components';

import FilterProvider from 'views/common/filter/FilterProvider';
import RejectActionView from 'views/admin/actions/reject/RejectActionView';
import ApproveActionView from 'views/admin/actions/approve/ApproveActionView';
import AdminTableFilters from 'views/admin/actions/table-filters/AdminTableFilters';

import styles from './AdminUsersTableView.module.scss';

interface IProps {
  filterStatuses: Array<UserStatus>;
  tab?: string;
}

const AdminUsersTableView = ({ filterStatuses, tab = 'admins' }: IProps) => {
  const { t } = useTranslation(['views/admin', 'common']);
  const history = useHistory();
  const [page, setPage] = useState(1);
  const [tableRefreshTrigger, refreshTable] = useState(false);
  const usersResponse = useStoreState<IStoreModel, IAdminUsersResponseBody | null>((store) => store.admin.users.users);
  const isUsersLoading = useStoreState<IStoreModel, boolean>((store) => store.admin.users.isUsersLoading);
  const loadAdminUsers = useStoreActions<IStoreModel>((actions) => actions.admin.users.loadAdminUsers);
  const approveUser = useStoreActions<IStoreModel>((actions) => actions.admin.users.approveUser);
  const rejectUser = useStoreActions<IStoreModel>((actions) => actions.admin.users.rejectUser);

  const loadUsersList = useCallback(
    (params) => {
      return loadAdminUsers({
        page,
        limit: DEFAULT_PAGE_SIZE,
        ...params,
        status: params.status ? [params.status] : filterStatuses,
      });
    },
    [loadAdminUsers, page],
  );

  const handleUserClick = useCallback((company: IAdminUserResponseBody) => {
    history.push(Routes.adminUser.replace(':id', String(company.id)));
  }, []);

  const resetPage = useCallback(() => {
    setPage(1);
  }, []);

  const handleAdminUserApprove = async (user: IAdminUserResponseBody) => {
    await approveUser(user);
    setPage(1);
    refreshTable(!tableRefreshTrigger);
  };

  const handleAdminUserReject = async (user: IAdminUserResponseBody, reason?: string) => {
    await rejectUser({ id: user.id, reason });
    setPage(1);
    refreshTable(!tableRefreshTrigger);
  };

  const renderActions = (user: IAdminUserResponseBody) => {
    switch (user.status) {
      case UserStatus.Pending:
        return (
          <>
            <Row horizontalSpace={RowSpace.ExtraSmall} wrap={false}>
              <Col flexible>
                <ApproveActionView
                  name={t('admins.user', { name: user.name, surname: user.surname })}
                  onApprove={() => handleAdminUserApprove(user)}
                  tableAction
                />
              </Col>
              <Col flexible>
                <RejectActionView
                  name={t('admins.user', { name: user.name, surname: user.surname })}
                  onReject={(reason: string) => handleAdminUserReject(user, reason)}
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
        title: t('admins.email'),
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: t('admins.name'),
        key: 'name',
        render: (user: IAdminUserResponseBody) => t('admins.user', { name: user.name, surname: user.surname }),
      },
      {
        title: t('admins.accountAddress'),
        dataIndex: 'accountAddress',
        key: 'accountAddress',
      },
      {
        title: t('admins.dateCreated'),
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (date: string) => formatDateTime(date),
      },
      {
        title: t('admins.status'),
        dataIndex: 'status',
        key: 'status',
        render: (status: UserStatus) => t(`common:user.status.${status}`),
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
      <FilterProvider fetchData={loadUsersList} onFilter={resetPage} dependencies={[page, tableRefreshTrigger]}>
        <AdminTableFilters statuses={filterStatuses} />
      </FilterProvider>
      <div className={styles.table}>
        <Table
          columns={columns}
          page={page}
          loading={isUsersLoading}
          data={usersResponse?.items}
          total={usersResponse?.meta.totalItems}
          onPageChange={setPage}
          onRowClick={handleUserClick}
          tab={tab}
          bigPlaceholder={true}
        />
      </div>
    </div>
  );
};

export default memo(AdminUsersTableView);
