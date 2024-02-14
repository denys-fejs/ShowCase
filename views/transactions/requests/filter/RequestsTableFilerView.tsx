import { memo, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Moment } from 'moment';

import { IssueTokenStatus, IssueTokenType, RowSpace, tokenRequestTypeMap } from 'types';
import { Col, DatePickerInput, Row, TextInput } from 'components';

import FilterContext from 'views/common/filter/FilterContext';
import FilterSearchSelect from 'views/common/filter/filter-search-select/FilterSearchSelect';

import styles from './RequestsTableFilerView.module.scss';

const RequestsTableFilerView = () => {
  const { t } = useTranslation(['views/transactions', 'common']);
  const { setParams, queryParams } = useContext(FilterContext);

  const projectStatusOptions = useMemo(() => {
    return ['', ...Object.values(IssueTokenStatus)].map((value) => ({
      value,
      content: t([`common:tokensRequest.status.${value}`], value),
    }));
  }, [t]);

  const typeOptions = useMemo(() => {
    return ['', ...Object.values(IssueTokenType)].map((value: string) => ({
      value: value ? tokenRequestTypeMap[value] : '',
      content: t([`common:tokensRequest.type.${value}`], value),
    }));
  }, [t]);

  return (
    <Row verticalSpace={RowSpace.None}>
      <Col flexible>
        <DatePickerInput
          name='createdAt'
          value={queryParams.createdAt}
          placeholder={t(`requests.date`)}
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
          placeholder={t(`requests.amount`)}
          onChange={(amount?: string) => {
            setParams({ amount });
          }}
        />
      </Col>
      <Col flexible>
        <FilterSearchSelect
          className={styles.input}
          filterName='type'
          options={typeOptions}
          placeholder={t(`requests.type`)}
          emptyContent={t('common:common.all')}
          isProjectsFilter={false}
        />
      </Col>
      <Col flexible>
        <FilterSearchSelect
          className={styles.input}
          filterName='status'
          options={projectStatusOptions}
          placeholder={t(`requests.status`)}
          emptyContent={t('common:common.all')}
          isProjectsFilter={false}
        />
      </Col>
    </Row>
  );
};

export default memo(RequestsTableFilerView);
