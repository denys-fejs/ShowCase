import { Link } from 'react-router-dom';

import { Routes } from 'constants/index';
import { RowSpace } from 'types';
import { Row, Col, MainLogo } from 'components';

import LanguageSelectView from 'views/common/actions/language-select/LanguageSelectView';
import AccountActionsView from 'views/common/actions/account-actions/AccountActionsView';

import styles from './BasicHeaderView.module.scss';

const BasicHeaderView = () => {
  return (
    <header className={styles.header}>
      <Row
        wrap={false}
        verticalSpace={RowSpace.None}
        horizontalSpace={RowSpace.None}
        justify='space-between'
        align='middle'
      >
        <Col flexible>
          <Link to={Routes.home}>
            <MainLogo />
          </Link>
        </Col>
        <Col flexible>
          <div className={styles.rightSide}>
            <LanguageSelectView />
            <AccountActionsView hideSignIn />
          </div>
        </Col>
      </Row>
    </header>
  );
};

export default BasicHeaderView;
