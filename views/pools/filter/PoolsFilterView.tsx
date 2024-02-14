import { memo, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { RowSpace } from 'types';
import { Col, Row, Search } from 'components';

import FilterContext from 'views/common/filter/FilterContext';
import FilterSearchSelect from 'views/common/filter/filter-search-select/FilterSearchSelect';

import styles from './PoolsFilterView.module.scss';
import { countiesOptions, projectStandardOptions, projectTypesOptions } from '../../projects/ProjectFilterConfig';

const PoolsFilterView = () => {
  const { t } = useTranslation(['views/pools', 'common']);
  const { setParams, queryParams } = useContext(FilterContext);

  return (
    <Row verticalSpace={RowSpace.None}>
      <Col flexible>
        <Search
          className={styles.input}
          name='search'
          icon='search'
          options={[]}
          selectedValue={queryParams.search}
          onSearch={(searchText) => setParams({ search: searchText })}
          placeholder={t(`pools.search`)}
          size='large'
        />
      </Col>
      <Col flexible>
        <FilterSearchSelect
          className={styles.input}
          filterName='type'
          icon='document'
          options={projectTypesOptions}
          placeholder={t(`pools.type`)}
          emptyContent={t('common:common.all')}
          isProjectsFilter={false}
          selectMode='multiple'
        />
      </Col>
      <Col flexible>
        <FilterSearchSelect
          className={styles.input}
          filterName='standard'
          icon='agency'
          options={projectStandardOptions}
          placeholder={t(`pools.standard`)}
          emptyContent={t('common:common.all')}
          isProjectsFilter={false}
          selectMode='multiple'
        />
      </Col>
      <Col flexible>
        <FilterSearchSelect
          className={styles.input}
          filterName='country'
          icon='mapPoint'
          options={countiesOptions}
          placeholder={t(`pools.country`)}
          emptyContent={t('common:common.all')}
          isProjectsFilter={false}
          selectMode='multiple'
        />
      </Col>
    </Row>
  );
};

export default memo(PoolsFilterView);
