import { useMemo } from 'react';
import { Menu } from 'antd';
import { useTranslation } from 'react-i18next';
import { Link, matchPath, useHistory } from 'react-router-dom';
import { useStoreState } from 'easy-peasy';

import { IStoreModel, IProjectDetailsResponseBody, INavMenuItem } from 'types';
import { findStatusIcon } from 'utils';
import IconSvg from 'components/icons';

import styles from './NavMenu.module.scss';

interface IPropsTypes {
  items: Array<INavMenuItem>;
}

const NavMenu = ({ items }: IPropsTypes) => {
  const { t } = useTranslation('views/common');
  const history = useHistory();
  const currentPath = history.location.pathname;

  const userProject = useStoreState<IStoreModel, IProjectDetailsResponseBody | null>((store) => store.project.project);

  const selectedKeys = useMemo(() => {
    return items.filter(({ path }) => !!matchPath(currentPath, { path, exact: true })).map(({ key }) => key);
  }, [currentPath, history]);

  return (
    <Menu theme='dark' mode='inline' selectedKeys={selectedKeys} className={styles.menu}>
      {items.map((item: INavMenuItem) => {
        return (
          <Menu.Item key={item.key} icon={<IconSvg icon={item.icon} />}>
            <Link to={item.path}>{t(`navBar.menu.${item.name}`)}</Link>
            {item.name === 'myProject' && userProject && (
              <div className={styles.statusIcon}>
                <IconSvg icon={findStatusIcon(userProject.status, userProject.auditStatus).icon} />
              </div>
            )}
          </Menu.Item>
        );
      })}
    </Menu>
  );
};

export default NavMenu;
