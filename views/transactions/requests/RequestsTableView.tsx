import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import pick from 'lodash.pick';
import { useLocation } from 'react-router';

import appConfig from 'config/appConfig';
import { DEFAULT_PAGE_SIZE } from 'constants/index';
import { useFetchCallback } from 'hooks';
import projectRequestAPI from 'api/project/projectRequestAPI';
import { IIssueTokensList, ITokensRequestsResponseBody } from 'types';
import { formatDateDayLocale, formatTxHash, parseQueryParams } from 'utils';
import { Table } from 'components';

import FilterProvider from 'views/common/filter/FilterProvider';
import RequestsTableFilerView from './filter/RequestsTableFilerView';

import styles from './RequestsTableView.module.scss';

const RequestsTableView = () => {
  const { t } = useTranslation(['views/transactions', 'common']);
  const [page, setPage] = useState(1);
  const location = useLocation();

  const { response, loading, fetchCallback } = useFetchCallback<ITokensRequestsResponseBody>(
    (params) => {
      return projectRequestAPI.getMyRequests({
        page,
        limit: DEFAULT_PAGE_SIZE,
        ...pick(params, ['createdAt', 'amount', 'type', 'status']),
      });
    },
    [page],
  );

  const handleTxClick = useCallback((request: IIssueTokensList) => {
    if (request.txHash) {
      window.open(`${appConfig.explorerUrl}/tx/${request.txHash}`, '_blank');
    }
  }, []);

  const columns = useMemo(
    () => [
      {
        title: t('requests.id'),
        key: 'id',
        dataIndex: 'id',
      },
      {
        title: t('requests.tx'),
        key: 'txHash',
        dataIndex: 'txHash',
        render: (hash: string) => (hash ? formatTxHash(hash) : '-'),
      },
      {
        title: t('requests.type'),
        key: 'type',
        dataIndex: 'type',
        render: (type: string) => t(`common:tokensRequest.type.${type}`),
      },
      {
        title: t('requests.date'),
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (createdAt: string) => formatDateDayLocale(createdAt),
      },
      {
        title: t('requests.amount'),
        dataIndex: 'amount',
        key: 'amount',
        render: (amount: number) => `${amount} ${t('common:blockchain.tokenUnit')}`,
      },
      {
        title: t('requests.status'),
        key: 'status',
        dataIndex: 'status',
        render: (status: string) => t(`common:tokensRequest.status.${status}`),
      },
    ],
    [t],
  );

  return (
    <>
      <FilterProvider fetchData={fetchCallback} dependencies={[page]}>
        <RequestsTableFilerView />
      </FilterProvider>
      <div className={styles.table}>
        <Table
          columns={columns}
          page={page}
          loading={loading}
          data={response?.items}
          refresh={() => fetchCallback(parseQueryParams(location.search))}
          total={response?.meta.totalItems}
          onPageChange={setPage}
          onRowClick={handleTxClick}
          tab='requests'
          bigPlaceholder={true}
        />
      </div>
    </>
  );
};

export default RequestsTableView;
