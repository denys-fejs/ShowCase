import { memo, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { Col, DatePickerInput, Row, Search, TextInput } from 'components';
import FilterContext from 'views/common/filter/FilterContext';

import styles from './BurnedFilterView.module.scss';
import { Moment } from 'moment';

const BurnedFilerView = () => {
  const { t } = useTranslation('views/burned');
  const { setParams, queryParams } = useContext(FilterContext);

  return (
    <Row className={styles.filterBlock}>
      <Col flexible>
        <Search
          className={styles.searchTextInput}
          name='search'
          icon='search'
          options={[]}
          selectedValue={queryParams.search}
          onSearch={(searchText) => setParams({ search: searchText })}
          placeholder={t(`table.name`)}
          size='large'
        />
      </Col>
      <Col flexible>
        <DatePickerInput
          name='createdAt'
          value={queryParams.burnDate}
          placeholder={t(`table.date`)}
          onChange={(date?: Moment | null) => {
            setParams({ burnDate: date?.toDate() });
          }}
          className={styles.input}
          size='large'
        />
      </Col>
      <Col flexible>
        <TextInput
          name='certId'
          className={styles.numberInput}
          value={queryParams.certId}
          defaultValue={queryParams.certId}
          placeholder={t(`table.certificate`)}
          onChange={(amount?: string) => {
            setParams({ amount });
          }}
        />
      </Col>
    </Row>
  );
};

export default memo(BurnedFilerView);
