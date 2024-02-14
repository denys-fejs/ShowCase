import { COUNTRIES_MAP, DEFAULT_PAGE_SIZE, Routes } from 'constants/index';
import { useHistory } from 'react-router';
import { PrimaryButton, Table } from 'components';
import { useTranslation } from 'react-i18next';
import React, { useCallback, useMemo, useState } from 'react';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { IPaginationResponse, IPoolslistResponseBody, IStoreModel, ProjectTypes } from 'types';
import pick from 'lodash.pick';
import Flags from 'country-flag-icons/react/3x2';
import { GlobalOutlined } from '@ant-design/icons';
import styles from './AdminPoolsView.module.scss';
import FilterProvider from 'views/common/filter/FilterProvider';
import BasicSearchHeader from 'views/common/headers/basic-search-header/BasicSearchHeader';
import SectionHeader from 'views/common/headers/section-header/SectionHeader';
import PoolsFilterView from 'views/pools/filter/PoolsFilterView';
import { parseQueryParams } from 'utils';

const AdminPoolsView = () => {
  const history = useHistory();
  const handleCreatePool = () => {
    history.push(Routes.adminCreatePool);
  };
  const { t } = useTranslation('views/pools');
  const [page, setPage] = useState(1);

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
    history.push(`${Routes.adminPoolDetails.replace(':id', `${at.id}`)}`);
  }, []);

  return (
    <>
      <FilterProvider fetchData={loadPools}>
        <BasicSearchHeader onSearch={() => undefined} />
        <SectionHeader>{t('title')}</SectionHeader>
        <PrimaryButton onClick={handleCreatePool} className={styles.buttonCreate}>
          {t('createPool')}
        </PrimaryButton>
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

export default AdminPoolsView;
