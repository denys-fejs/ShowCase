import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';

import { ICardMenuItem } from 'types';
import IconSvg from 'components/icons';

//styles
import styles from './CardMenu.module.scss';

interface IProps {
  items: Array<ICardMenuItem>;
}

const CardMenu = ({ items }: IProps) => {
  return (
    <Menu theme='dark' mode='inline' className={styles.menu}>
      {items
        .filter(({ hidden }) => !hidden)
        .map(({ icon, title, route }, i) => (
          <Menu.Item key={`${route}-${i}`} icon={<IconSvg icon={icon} />}>
            <Link to={route}>{title}</Link>
          </Menu.Item>
        ))}
    </Menu>
  );
};

export default memo(CardMenu);
