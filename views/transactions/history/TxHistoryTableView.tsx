import { useCallback, useMemo, useState } from 'react';
import { useStoreState } from 'easy-peasy';
import { useTranslation } from 'react-i18next';
import pick from 'lodash.pick';
import { useLocation } from 'react-router';

import appConfig from 'config/appConfig';
import txAPI from 'api/explorer/txAPI';
import { DEFAULT_PAGE_SIZE } from 'constants/index';
import { useFetchCallback } from 'hooks';
import { IAccountTxResponseBody, IPaginationResponse, IStoreModel } from 'types';
import { calculateTxCost, formatDateDayLocale, formatTxHash, parseQueryParams } from 'utils';
import { Table, TxActivityLabel, WeiLabel } from 'components';

import FilterProvider from 'views/common/filter/FilterProvider';
import TxHistoryTableFilerView from './filter/TxHistoryTableFilterView';

import styles from './TxHistoryTableView.module.scss';

const TxHistoryTableView = () => {
  const { t } = useTranslation(['views/transactions', 'common']);
  const [page, setPage] = useState(1);
  const walletAddress = useStoreState<IStoreModel, string | null>((store) => store.blockchain.wallet.walletAddress);
  const location = useLocation();

  const { response, loading, fetchCallback } = useFetchCallback<IPaginationResponse<IAccountTxResponseBody>>(
    (params) => {
      return walletAddress
        ? txAPI.getAccountTxs(walletAddress, {
            page,
            limit: DEFAULT_PAGE_SIZE,
            ...pick(params, ['search', 'amount', 'createdAt']),
          })
        : null;
    },
    [walletAddress, page],
  );

  const handleTxClick = useCallback((at: IAccountTxResponseBody) => {
    window.open(`${appConfig.explorerUrl}/tx/${at.txHash}`, '_blank');
  }, []);

  const renderActivity = (at: IAccountTxResponseBody) => {
    return <TxActivityLabel messagePayload={at.tx.msgPayload} out={at.out} />;
  };

  const columns = useMemo(
    () => [
      {
        title: t('history.txHash'),
        key: 'txHash',
        dataIndex: 'txHash',
        render: (hash: string) => formatTxHash(hash),
        width: 220,
      },
      {
        title: t('history.activity'),
        key: 'activity',
        render: renderActivity,
      },
      {
        title: t('history.amount'),
        key: 'amount',
        render: (at: IAccountTxResponseBody) => (
          <WeiLabel value={at.tx?.value} unit={t('common:blockchain.unit')} isEth />
        ),
      },
      {
        title: t('history.date'),
        key: 'createdAt',
        render: (at: IAccountTxResponseBody) => formatDateDayLocale(at.tx?.createdAt),
      },
      {
        title: t('history.cost'),
        key: 'cost',
        render: (at: IAccountTxResponseBody) => (
          <WeiLabel value={calculateTxCost(at.tx?.txGasPrice, at.tx?.txGasUsed)} unit={t('common:blockchain.unit')} />
        ),
      },
    ],
    [t],
  );

  return (
    <>
      <FilterProvider fetchData={fetchCallback} dependencies={[page, walletAddress]}>
        <TxHistoryTableFilerView />
      </FilterProvider>
      <div className={styles.table}>
        <Table
          columns={columns}
          page={page}
          refresh={() => fetchCallback(parseQueryParams(location.search))}
          loading={loading}
          data={response?.items}
          total={response?.meta.totalItems}
          onPageChange={setPage}
          onRowClick={handleTxClick}
          tab='transactions'
          bigPlaceholder={true}
        />
      </div>
    </>
  );
};

export default TxHistoryTableView;
