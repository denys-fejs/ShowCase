import { memo, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Moment } from 'moment';

import { Col, DatePickerInput, Row, Search, TextInput } from 'components';
import FilterContext from 'views/common/filter/FilterContext';

import styles from './TxHistoryTableFilerView.module.scss';

const TxHistoryTableFilerView = () => {
  const { t } = useTranslation(['views/transactions', 'common']);
  const { setParams, queryParams } = useContext(FilterContext);

  return (
    <Row>
      <Col flexible>
        <Search
          className={styles.searchTextInput}
          name='search'
          icon='search'
          options={[]}
          selectedValue={queryParams.search}
          onSearch={(searchText) => setParams({ search: searchText })}
          placeholder={t(`history.txHash`)}
          size='large'
        />
      </Col>
      <Col flexible>
        <DatePickerInput
          name='createdAt'
          value={queryParams.createdAt}
          placeholder={t(`history.date`)}
          onChange={(date?: Moment | null) => {
            setParams({ createdAt: date?.toDate() });
          }}
          className={styles.input}
          size='large'
        />
      </Col>
      <Col flexible>
        <TextInput
          name='amount'
          type='number'
          className={styles.numberInput}
          value={queryParams.amount}
          defaultValue={queryParams.amount}
          placeholder={t(`history.amount`)}
          onChange={(amount?: string) => {
            setParams({ amount });
          }}
        />
      </Col>
    </Row>
  );
};

export default memo(TxHistoryTableFilerView);
