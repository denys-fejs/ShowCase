import { memo, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { useHistory } from 'react-router-dom';
import { useLocation } from 'react-router';
import { parseQueryParams } from 'utils';
import { IStoreModel } from 'types/store/store';
import { RowSpace, IPendingCompaniesResponseBody, ICompanyResponseBody } from 'types';
import adminCompaniesAPI from 'api/admin/adminCompaniesAPI';
import { CompanyStatus } from 'constants/company';
import { DEFAULT_PAGE_SIZE } from 'constants/common';
import { formatDateTime } from 'utils/formatDate';
import FilterProvider from 'views/common/filter/FilterProvider';
import StartReviewActionView from 'views/admin/actions/start-review/StartReviewActionView';
import { Routes } from 'constants/routes';
import RejectActionView from 'views/admin/actions/reject/RejectActionView';
import ApproveActionView from 'views/admin/actions/approve/ApproveActionView';
import AdminTableFilters from 'views/admin/actions/table-filters/AdminTableFilters';
import { Row, Col, Table } from 'components';

//styles
import styles from './AdminCompaniesTableView.module.scss';

interface IProps {
  filterStatuses: Array<CompanyStatus>;
  tab?: string;
}

const AdminCompaniesTableView = ({ filterStatuses, tab = 'companies' }: IProps) => {
  const { t } = useTranslation(['views/admin', 'common']);
  const history = useHistory();
  const location = useLocation();
  const [page, setPage] = useState(1);
  const [tableRefreshTrigger, refreshTable] = useState(false);
  const pendingCompanys = useStoreState<IStoreModel, IPendingCompaniesResponseBody | null>(
    (store) => store.admin.companies.pendingCompanies,
  );
  const isPendingCompanysLoading = useStoreState<IStoreModel, boolean>(
    (store) => store.admin.companies.isPendingCompaniesLoading,
  );
  const loadPendingCompanies = useStoreActions<IStoreModel>((actions) => actions.admin.companies.loadPendingCompanies);
  const startCompanyReview = useStoreActions<IStoreModel>((actions) => actions.admin.companies.startCompanyReview);
  const approveCompany = useStoreActions<IStoreModel>((actions) => actions.admin.companies.approveCompany);
  const rejectCompany = useStoreActions<IStoreModel>((actions) => actions.admin.companies.rejectCompany);

  const loadCompaniesList = useCallback(
    (params) => {
      return loadPendingCompanies({
        page,
        limit: DEFAULT_PAGE_SIZE,
        ...params,
        status: params?.status ? [params.status] : filterStatuses,
      });
    },
    [loadPendingCompanies, page],
  );

  const handleCompanyClick = useCallback((company: ICompanyResponseBody) => {
    history.push(Routes.adminCompany.replace(':id', String(company.id)));
  }, []);

  const resetPage = useCallback(() => {
    setPage(1);
  }, []);

  const handleCompanyStartReview = async (company: ICompanyResponseBody) => {
    await startCompanyReview(company.id);
    setPage(1);
    refreshTable(!tableRefreshTrigger);
  };

  const handleCompanyApprove = async (company: ICompanyResponseBody) => {
    const companyDetails = await adminCompaniesAPI.getCompanyById(company.id);
    await approveCompany(companyDetails);
    setPage(1);
    refreshTable(!tableRefreshTrigger);
  };

  const handleCompanyReject = async (company: ICompanyResponseBody, reason?: string) => {
    await rejectCompany({ id: company.id, reason });
    setPage(1);
    refreshTable(!tableRefreshTrigger);
  };

  const renderActions = (company: ICompanyResponseBody) => {
    switch (company.status) {
      case CompanyStatus.Pending:
        return (
          <>
            <StartReviewActionView
              name={t('companies.company', { name: company.name })}
              onStartReview={() => handleCompanyStartReview(company)}
              tableAction
            />
          </>
        );
      case CompanyStatus.InReview:
        return (
          <>
            <Row horizontalSpace={RowSpace.ExtraSmall} wrap={false}>
              <Col flexible>
                <ApproveActionView
                  name={t('companies.company', { name: company.name })}
                  onApprove={() => handleCompanyApprove(company)}
                  tableAction
                />
              </Col>
              <Col flexible>
                <RejectActionView
                  name={t('companies.company', { name: company.name })}
                  onReject={(reason: string) => handleCompanyReject(company, reason)}
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
        title: t('companies.id'),
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: t('companies.name'),
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: t('companies.dateCreated'),
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (date: string) => formatDateTime(date),
      },
      {
        title: t('companies.status'),
        dataIndex: 'status',
        key: 'status',
        render: (status: CompanyStatus) => t(`common:company.status.${status}`),
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
      <FilterProvider fetchData={loadCompaniesList} onFilter={resetPage} dependencies={[page, tableRefreshTrigger]}>
        <AdminTableFilters statuses={filterStatuses} />
      </FilterProvider>
      <div className={styles.table}>
        <Table
          columns={columns}
          page={page}
          refresh={() => loadCompaniesList(parseQueryParams(location.search))}
          loading={isPendingCompanysLoading}
          data={pendingCompanys?.items}
          total={pendingCompanys?.meta.totalItems}
          onPageChange={setPage}
          onRowClick={handleCompanyClick}
          tab={tab}
          bigPlaceholder={true}
        />
      </div>
    </div>
  );
};

export default memo(AdminCompaniesTableView);
