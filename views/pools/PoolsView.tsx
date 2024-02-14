import { COUNTRIES_MAP, DEFAULT_PAGE_SIZE, Routes } from 'constants/index';
import BasicSearchHeader from 'views/common/headers/basic-search-header/BasicSearchHeader';
import React, { useCallback, useMemo, useState } from 'react';
import SectionHeader from 'views/common/headers/section-header/SectionHeader';
import { useTranslation } from 'react-i18next';
import PoolsFilterView from './filter/PoolsFilterView';
import FilterProvider from '../common/filter/FilterProvider';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { IPaginationResponse, IPoolslistResponseBody, IStoreModel, ProjectTypes } from 'types';
import styles from './PoolsView.module.scss';
import { Table } from 'components';
import { parseQueryParams } from 'utils';
import pick from 'lodash.pick';
import Flags from 'country-flag-icons/react/3x2';
import { GlobalOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router';

export const poolsListMock = [
  {
    id: 1,
    name: 'LiqToken1',
    country: 'US',
    type: 'Recycle',
    standard: 'Verra',
    description:
      'This is liquidity token, created for purchasing special projects tokens. This token unites projects related to reforestation in America. You can buy this token and exchange it for any project token available within this pool',
  },
  {
    id: 2,
    name: 'LiqToken2',
    country: 'US',
    type: 'Recycle',
    standard: 'Verra',
    description:
      'This is liquidity token, created for purchasing special projects tokens. This token unites projects related to reforestation in America. You can buy this token and exchange it for any project token available within this pool',
  },
  {
    id: 3,
    name: 'LiqToken3',
    country: 'US',
    type: 'Recycle',
    standard: 'Verra',
    description:
      'This is liquidity token, created for purchasing special projects tokens. This token unites projects related to reforestation in America. You can buy this token and exchange it for any project token available within this pool',
  },
  {
    id: 4,
    name: 'LiqToken4',
    country: 'US',
    type: 'Recycle',
    standard: 'Verra',
    description:
      'This is liquidity token, created for purchasing special projects tokens. This token unites projects related to reforestation in America. You can buy this token and exchange it for any project token available within this pool',
  },
];

const PoolsView = () => {
  const { t } = useTranslation('views/pools');
  const [page, setPage] = useState(1);
  const history = useHistory();
  const poolsList = useStoreState<IStoreModel, IPaginationResponse<IPoolslistResponseBody> | null>(
    (store) => store.pool.poolsList,
  );

  const loadPoolsList = useStoreActions<IStoreModel>((actions) => actions.pool.loadPoolsList);

  const loadPools = useCallback(
    (params) => {
      return loadPoolsList({
        page,
        limit: DEFAULT_PAGE_SIZE,
        ...pick(params, ['search', 'country', 'type', 'standard']),
      });
    },
    [page],
  );

  const renderTypes = (types: ProjectTypes[]) => {
    return `${types[0]}${types.length > 1 ? ` and ${types.length - 1} more` : ''}`;
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
        dataIndex: 'name',
        width: 220,
      },
      {
        title: t('table.type'),
        key: 'type',
        render: (at: IPoolslistResponseBody) => renderTypes(at.type),
      },
      {
        title: t('table.country'),
        key: 'country',
        render: (at: IPoolslistResponseBody) => (at.country ? renderCountryWithFlag(at.country[0]) : ''),
      },
    ],
    [t],
  );

  const handleRowClick = useCallback((at: IPoolslistResponseBody) => {
    history.push(`${Routes.poolDetails.replace(':id', `${at.id}`)}`);
  }, []);

  return (
    <>
      <FilterProvider fetchData={loadPools}>
        <BasicSearchHeader onSearch={() => undefined} />
        <SectionHeader>{t('title')}</SectionHeader>
        <PoolsFilterView />
        <div className={styles.table}>
          <Table
            columns={columns}
            page={page}
            refresh={() => loadPools(parseQueryParams(location.search))}
            data={poolsList?.items}
            onPageChange={setPage}
            onRowClick={handleRowClick}
            total={poolsList?.meta.totalItems}
            bigPlaceholder={true}
          />
        </div>
      </FilterProvider>
    </>
  );
};

export default PoolsView;
