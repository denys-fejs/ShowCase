import React, { useCallback, useMemo, useState } from 'react';
import { useStoreState } from 'easy-peasy';
import { useTranslation } from 'react-i18next';
import { IPaginationResponse, IPurchasedProject, IPurchasesResponseBody, IStoreModel } from 'types';
import { useFetchCallback } from 'hooks';
import purchasesAPI from 'api/explorer/purchasesAPI';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router';
import { COUNTRIES_MAP, DEFAULT_PAGE_SIZE, Routes } from 'constants/index';
import pick from 'lodash.pick';
import appConfig from 'config/appConfig';
import { formatDateDayLocale, formatTxHash, parseQueryParams } from 'utils';
import { Table } from 'components';
import FilterProvider from 'views/common/filter/FilterProvider';
import PurchaseHistoryTableFilterView from './filter/PurchasesHistoryTableFilterView';
import defaultCoverImg from 'resources/images/bg/tristan-1.png';
import Flags from 'country-flag-icons/react/3x2';
import { GlobalOutlined } from '@ant-design/icons';

import styles from '../PortfolioView.module.scss';

const PurchasesHistoryTableView = () => {
  const { t } = useTranslation('views/portfolio');
  const walletAddress = useStoreState<IStoreModel, string | null>((store) => store.blockchain.wallet.walletAddress);
  const [page, setPage] = useState(1);
  const location = useLocation();

  const { response, loading, fetchCallback } = useFetchCallback<IPaginationResponse<IPurchasesResponseBody>>(
    (params) => {
      return walletAddress
        ? purchasesAPI.getPurchases(walletAddress, {
            page,
            limit: DEFAULT_PAGE_SIZE,
            ...pick(params, ['search', 'date', 'type', 'standard']),
          })
        : null;
    },
    [walletAddress, page],
  );
  const handleTxClick = useCallback((at: IPurchasesResponseBody) => {
    window.open(`${appConfig.explorerUrl}/tx/${at.txHash}`, '_blank');
  }, []);

  const renderNameWithPic = (project: IPurchasedProject | undefined) => {
    return project ? (
      <Link
        to={Routes.projectDetails.replace(':id', String(project.id))}
        className={styles.nameCell}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={styles.image}
          style={{ backgroundImage: `url(${project.coverImage ? project.coverImage : defaultCoverImg}` }}
        />
        {project?.name}
      </Link>
    ) : (
      ''
    );
  };

  const renderCountryWithFlag = (country: string) => {
    const Flag = Flags[country] || GlobalOutlined;
    return (
      <div className={styles.countryCell}>
        <Flag className={styles.flag} />
        {COUNTRIES_MAP[country] || country}
      </div>
    );
  };

  const columns = useMemo(
    () => [
      {
        title: t('table.name'),
        key: 'name',
        render: (at: IPurchasesResponseBody) => renderNameWithPic(at.project),
        width: 220,
      },
      {
        title: t('table.tx'),
        key: 'txHash',
        dataIndex: 'txHash',
        render: (hash: string) => (hash ? formatTxHash(hash) : '-'),
      },
      {
        title: t('table.purchaseDate'),
        key: 'purchaseDate',
        render: (at: IPurchasesResponseBody) => formatDateDayLocale(at.purchaseDate),
      },
      {
        title: t('table.location'),
        key: 'location',
        render: (at: IPurchasesResponseBody) => (at.project?.country ? renderCountryWithFlag(at.project.country) : ''),
      },
      {
        title: t('table.projectType'),
        key: 'projectType',
        render: (at: IPurchasesResponseBody) => at.project?.projectType,
      },
      {
        title: t('table.amount'),
        key: 'amount',
        render: (at: IPurchasesResponseBody) => `${at.amount} ${at.project?.tokenTicker}`,
      },
    ],
    [t],
  );
  const data = response?.items?.filter((item) => item.project);
  return (
    <>
      <FilterProvider fetchData={fetchCallback} dependencies={[page, walletAddress]}>
        <PurchaseHistoryTableFilterView />
      </FilterProvider>
      <div className={styles.table}>
        <Table
          columns={columns}
          page={page}
          loading={loading}
          refresh={() => fetchCallback(parseQueryParams(location.search))}
          data={data}
          onPageChange={setPage}
          total={data?.length}
          onRowClick={handleTxClick}
          tab='purchases'
          bigPlaceholder={true}
        />
      </div>
    </>
  );
};

export default PurchasesHistoryTableView;
