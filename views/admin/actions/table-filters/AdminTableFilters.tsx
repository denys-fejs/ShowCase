import { memo, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Moment } from 'moment';

import { CompanyStatus, ProjectStatus, UserStatus } from 'constants/index';
import { ISelectInputOption, IssueTokenStatus, IssueTokenType, tokenRequestTypeMap } from 'types';
import { Col, DatePickerInput, Row, Search } from 'components';
import FilterSearchSelect from 'views/common/filter/filter-search-select/FilterSearchSelect';
import FilterContext from 'views/common/filter/FilterContext';

import styles from './AdminTableFilters.module.scss';

interface IProps {
  statuses: Array<ProjectStatus | CompanyStatus | UserStatus | IssueTokenStatus>;
  types?: Array<IssueTokenType | any>;
}

const AdminTableFilters = ({ statuses, types }: IProps) => {
  const { t } = useTranslation(['views/admin', 'common']);
  const { setParams, queryParams } = useContext(FilterContext);

  const projectStatusOptions = useMemo(() => {
    return ['', ...statuses].map((value) => ({
      value,
      content: t(
        [`common:project.status.${value}`, `common:company.status.${value}`, `common:user.status.${value}`],
        value,
      ),
    }));
  }, [t, statuses]);

  let typeOptions: { value: any; content: string }[] | ISelectInputOption[] = [];
  if (types) {
    typeOptions = useMemo(() => {
      return ['', ...types].map((value: string) => ({
        value: value ? tokenRequestTypeMap[value] : '',
        content: t([`common:project.tokensRequest.type.${value}`], value),
      }));
    }, [t, statuses]);
  }

  return (
    <Row>
      <Col flexible>
        <Search
          className={styles.searchTextInput}
          name='name'
          icon='search'
          options={[]}
          selectedValue={queryParams.name}
          onSearch={(searchText) => setParams({ name: searchText })}
          placeholder={t(`filter.name`)}
          size='large'
        />
      </Col>
      <Col flexible>
        <DatePickerInput
          value={queryParams.createdAt}
          placeholder={t(`filter.dateCreated`)}
          onChange={(date?: Moment | null) => {
            setParams({ createdAt: date?.toDate() });
          }}
          className={styles.input}
          size='large'
        />
      </Col>
      <Col flexible>
        <FilterSearchSelect
          filterName='status'
          options={projectStatusOptions}
          placeholder={t(`filter.status`)}
          emptyContent={t('common:common.all')}
          className={styles.searchSelect}
          isProjectsFilter={false}
        />
      </Col>
      {types && (
        <Col flexible>
          <FilterSearchSelect
            filterName='type'
            options={typeOptions}
            placeholder={t(`filter.type`)}
            className={styles.searchSelect}
            emptyContent={t('common:common.all')}
            isProjectsFilter={false}
          />
        </Col>
      )}
    </Row>
  );
};

export default memo(AdminTableFilters);
