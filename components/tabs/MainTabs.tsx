import { Fragment, ReactNode, useMemo, useState } from 'react';
import { useHistory, useLocation, useRouteMatch } from 'react-router';
import { Tabs } from 'antd';

import { parseQueryParams, stringifyQueryParams } from 'utils/query';

//styles
import styles from './MainTabs.module.scss';

export interface IMainTabsItem {
  key: string;
  title: ReactNode;
  content: ReactNode;
  isShow?: boolean;
}

interface IProps {
  items: Array<IMainTabsItem>;
  defaultActiveKey?: string;
  renderInactive?: boolean;
  queryParam?: string;
  isShow?: boolean;
}

const MainTabs = ({ items, defaultActiveKey = items?.[0].key, renderInactive = true, queryParam }: IProps) => {
  const location = useLocation();
  const history = useHistory();
  const match = useRouteMatch();

  const defaultKey = useMemo(() => {
    const queryParams = parseQueryParams(location.search);
    const keyFromQuery = String(queryParams[queryParam || '']);
    return items.some(({ key }) => key === keyFromQuery) ? keyFromQuery : defaultActiveKey;
  }, [queryParam]);

  const [activeKey, setActiveKey] = useState(defaultKey);

  const handleTabChange = (activeTab: string) => {
    if (queryParam) {
      history.replace({
        pathname: match.url,
        search: stringifyQueryParams({ ...parseQueryParams(location.search), [queryParam]: activeTab }),
      });
    }
    setActiveKey(activeTab);
  };

  const renderItems = () => {
    return items.map(({ key, title, content, isShow = true }) => (
      <Fragment key={key}>
        {isShow && (
          <Tabs.TabPane tab={title} key={key}>
            {renderInactive || activeKey === key ? content : ''}
          </Tabs.TabPane>
        )}
      </Fragment>
    ));
  };

  return (
    <div className={styles.tabs}>
      <Tabs defaultActiveKey={defaultKey} className={styles.tabs} onChange={handleTabChange}>
        {renderItems()}
      </Tabs>
    </div>
  );
};

export default MainTabs;
