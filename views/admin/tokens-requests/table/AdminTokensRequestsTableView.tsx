import { memo, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { useHistory } from 'react-router-dom';
import { useLocation } from 'react-router';

import { IStoreModel } from 'types';
import { ITokensRequestsResponseBody, IIssueTokens, IIssueTokensList } from 'types/api/issue-tokens';
import { IssueTokenStatus, IssueTokenType } from 'types/api/issue-tokens';
import { formatDateTime } from 'utils/formatDate';

import FilterProvider from 'views/common/filter/FilterProvider';
import StartReviewActionView from 'views/admin/actions/start-review/StartReviewActionView';
import { Routes } from 'constants/routes';
import { DEFAULT_PAGE_SIZE } from 'constants/common';
import RejectActionView from 'views/admin/actions/reject/RejectActionView';
import { Row, Col, Table } from 'components';
import ApproveActionView from 'views/admin/actions/approve/ApproveActionView';
import { RowSpace } from 'types/components/grid';
import AdminTableFilters from 'views/admin/actions/table-filters/AdminTableFilters';

import styles from './AdminTokensRequestsTableView.module.scss';
import { parseQueryParams } from 'utils';

interface IProps {
  filterStatuses: Array<IssueTokenStatus>;
  filterTypes: Array<IssueTokenType>;
  tab?: string;
}

const getMappedRequests = (requests: Array<IIssueTokensList> | undefined) => {
  if (!requests) return undefined;
  return requests.map((request: IIssueTokensList) => ({
    ...request,
    name: request.projectName,
  }));
};

const AdminTokensRequestsTableView = ({ filterStatuses, filterTypes, tab = 'requests' }: IProps) => {
  const { t } = useTranslation(['views/admin', 'common']);
  const history = useHistory();
  const location = useLocation();

  const [page, setPage] = useState(1);
  const [tableRefreshTrigger, refreshTable] = useState(false);
  const tokensRequestsList = useStoreState<IStoreModel, ITokensRequestsResponseBody | null>(
    (store) => store.admin.tokensRequests.tokensRequestsList,
  );
  const isPendingProjectsLoading = useStoreState<IStoreModel, boolean>(
    (store) => store.admin.projects.isPendingProjectsLoading,
  );
  const loadTokensRequests = useStoreActions<IStoreModel>((actions) => actions.admin.tokensRequests.loadTokensRequests);
  const startTokenRequestReview = useStoreActions<IStoreModel>(
    (actions) => actions.admin.tokensRequests.startTokenRequestReview,
  );
  const approveTokensRequest = useStoreActions<IStoreModel>(
    (actions) => actions.admin.tokensRequests.approveTokenRequest,
  );
  const rejectTokensRequest = useStoreActions<IStoreModel>(
    (actions) => actions.admin.tokensRequests.rejectTokenRequest,
  );

  const handleProjectClick = useCallback((tokensRequest: IIssueTokens) => {
    history.push(Routes.adminTokensRequest.replace(':id', String(tokensRequest.id)));
  }, []);

  const loadRequestsList = useCallback(
    (params) => {
      return loadTokensRequests({
        page,
        limit: DEFAULT_PAGE_SIZE,
        ...params,
      });
    },
    [loadTokensRequests, page],
  );

  const resetPage = useCallback(() => {
    setPage(1);
  }, []);

  const handleTokenRequestStartReview = async (tokenRequest: IIssueTokensList) => {
    await startTokenRequestReview(tokenRequest.id);
    setPage(1);
    refreshTable(!tableRefreshTrigger);
  };

  const handleTokenRequestApprove = async (tokenRequest: IIssueTokensList) => {
    await approveTokensRequest({
      id: tokenRequest.id,
      amount: tokenRequest.amount,
      type: tokenRequest.type,
      accountAddress: tokenRequest.accountAddress,
      projectId: tokenRequest.projectParentId,
    });
    setPage(1);
    refreshTable(!tableRefreshTrigger);
  };

  const handleTokenRequestReject = async (tokenRequest: IIssueTokensList, reason?: string) => {
    await rejectTokensRequest({ id: tokenRequest.id, reason });
    setPage(1);
    refreshTable(!tableRefreshTrigger);
  };

  const renderActions = (tokenRequest: IIssueTokensList) => {
    switch (tokenRequest.status) {
      case IssueTokenStatus.Pending:
        return (
          <>
            <StartReviewActionView
              name={t('projects.request', { name: tokenRequest.projectName })}
              onStartReview={() => handleTokenRequestStartReview(tokenRequest)}
              tableAction
            />
          </>
        );
      case IssueTokenStatus.InReview:
        return (
          <>
            <Row horizontalSpace={RowSpace.ExtraSmall} wrap={false}>
              <Col flexible>
                <ApproveActionView
                  name={t('projects.request', { name: tokenRequest.projectName })}
                  onApprove={() => handleTokenRequestApprove(tokenRequest)}
                  tableAction
                />
              </Col>
              <Col flexible>
                <RejectActionView
                  name={t('projects.request', { name: tokenRequest.projectName })}
                  onReject={(reason: string) => handleTokenRequestReject(tokenRequest, reason)}
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
        title: t('requests.id'),
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: t('requests.name'),
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: t('requests.dateCreated'),
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (date: string) => formatDateTime(date),
      },
      {
        title: t('requests.type'),
        dataIndex: 'type',
        key: 'type',
        render: (type: any) => t(`common:tokensRequest.type.${type}`),
      },
      {
        title: t('requests.status'),
        dataIndex: 'status',
        key: 'status',
        render: (status: IssueTokenStatus) => t(`common:tokensRequest.status.${status}`),
      },
      {
        title: t('requests.amount'),
        dataIndex: 'amount',
        key: 'amount',
        render: (amount: number) => `${amount} ${t('requests.unit')}`,
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
      <FilterProvider fetchData={loadRequestsList} onFilter={resetPage} dependencies={[page, tableRefreshTrigger]}>
        <AdminTableFilters statuses={filterStatuses} types={filterTypes} />
      </FilterProvider>
      <div className={styles.table}>
        <Table
          columns={columns}
          page={page}
          refresh={() => loadRequestsList(parseQueryParams(location.search))}
          loading={isPendingProjectsLoading}
          data={getMappedRequests(tokensRequestsList?.items)}
          total={tokensRequestsList?.meta.totalItems}
          onPageChange={setPage}
          onRowClick={handleProjectClick}
          tab={tab}
          bigPlaceholder={true}
        />
      </div>
    </div>
  );
};

export default memo(AdminTokensRequestsTableView);
