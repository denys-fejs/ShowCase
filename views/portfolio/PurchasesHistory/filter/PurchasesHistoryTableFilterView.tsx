import { memo, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Moment } from 'moment';
import { Col, DatePickerInput, Row, Search } from 'components';
import FilterContext from 'views/common/filter/FilterContext';
import FilterSearchSelect from 'views/common/filter/filter-search-select/FilterSearchSelect';
import { projectStandardOptions, projectTypesOptions } from 'views/projects/ProjectFilterConfig';

import styles from './PurchasesHistoryTableFilterView.module.scss';

const PurchaseHistoryTableFilterView = () => {
  const { t } = useTranslation(['views/portfolio', 'common']);
  const { setParams, queryParams } = useContext(FilterContext);

  return (
    <Row className={styles.filtersRow}>
      <Col flexible>
        <Search
          className={styles.searchTextInput}
          name='search'
          icon='search'
          options={[]}
          selectedValue={queryParams.search}
          onSearch={(searchText) => setParams({ search: searchText })}
          placeholder={t(`filters.search`)}
          size='large'
        />
      </Col>
      <Col flexible>
        <FilterSearchSelect
          className={styles.selectInput}
          filterName='type'
          icon='document'
          options={projectTypesOptions}
          placeholder={t(`filters.type`)}
          emptyContent={t('common:common.all')}
        />
      </Col>
      <Col flexible>
        <FilterSearchSelect
          className={styles.selectInput}
          filterName='standard'
          icon='agency'
          options={projectStandardOptions}
          placeholder={t(`filters.standard`)}
          emptyContent={t('common:common.all')}
        />
      </Col>
      <Col flexible>
        <DatePickerInput
          name='purchaseDate'
          value={queryParams.date}
          placeholder={t(`filters.date`)}
          onChange={(date?: Moment | null) => {
            setParams({ date: date?.toDate() });
          }}
          className={styles.input}
          size='large'
        />
      </Col>
    </Row>
  );
};

export default memo(PurchaseHistoryTableFilterView);
