import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { LeftOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router';

import { RowSpace } from 'types';
import { Col, Row, Search } from 'components';

import FilterContext from 'views/common/filter/FilterContext';
import LanguageSelectView from 'views/common/actions/language-select/LanguageSelectView';
import AccountActionsView from 'views/common/actions/account-actions/AccountActionsView';

//styles
import styles from './BasicSearchHeader.module.scss';

interface IProps {
  onSearch?: (value: string) => void;
}

const BasicSearchHeader = ({ onSearch }: IProps) => {
  const { t } = useTranslation('views/common');
  const { setParams, search } = useContext(FilterContext);
  const history = useHistory();

  return (
    <header className={styles.header}>
      <Row verticalSpace={RowSpace.None} horizontalSpace={RowSpace.None} justify='space-between' align='middle'>
        <Col flexible>
          {onSearch ? (
            <div className={styles.filterItem}>
              <Search
                name='search'
                icon='search'
                options={[]}
                selectedValue={search}
                onSearch={(searchText) => {
                  setParams ? setParams({ search: searchText }) : onSearch(searchText);
                }}
                placeholder={t(`search.placeholder`)}
              />
            </div>
          ) : (
            <div className={styles.backBtn} onClick={() => history.goBack()}>
              <LeftOutlined />
            </div>
          )}
        </Col>
        <Col flexible>
          <div className={styles.rightSide}>
            <LanguageSelectView />
            <AccountActionsView />
          </div>
        </Col>
      </Row>
    </header>
  );
};

export default BasicSearchHeader;
