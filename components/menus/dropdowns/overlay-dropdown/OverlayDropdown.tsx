import { ReactNode } from 'react';
import { Dropdown, DropDownProps } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
import cn from 'classnames';

import { Icons } from 'types';
import IconSvg from 'components/icons';

import styles from './OverlayDropdown.module.scss';

interface IProps extends DropDownProps {
  children?: ReactNode;
  icon?: Icons;
}

const OverlayDropdown = ({ children, trigger = ['click'], icon, className, ...rest }: IProps) => {
  return (
    <Dropdown trigger={trigger} className={cn(styles.dropdown, className)} {...rest}>
      <div className={styles.dropdownWrapper}>
        {icon && (
          <div className={styles.icon}>
            <IconSvg icon={icon} />
          </div>
        )}
        <div className={styles.flexContainer}>
          <div>{children}</div>
          <CaretDownOutlined className={styles.arrow} />
        </div>
      </div>
    </Dropdown>
  );
};

export default OverlayDropdown;
