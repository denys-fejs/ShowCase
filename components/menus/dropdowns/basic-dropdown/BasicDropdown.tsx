import { ReactNode } from 'react';
import { Dropdown, DropDownProps, Menu } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
import { IDropdownItem } from 'types/components/dropdowns';
import { Icons } from 'types/components/icons';
import IconSvg from 'components/icons';
import cn from 'classnames';
//styles
import styles from './BasicDropdown.module.scss';

interface IProps extends Omit<DropDownProps, 'overlay'> {
  name: string;
  items: Array<IDropdownItem>;
  children?: ReactNode;
  wide?: boolean;
  icon?: Icons;
  isCaretOutside?: boolean;
  className?: string;
}

const BasicDropdown = ({
  name,
  items,
  children,
  trigger = ['click'],
  wide = false,
  isCaretOutside = false,
  icon,
  className = '',
  ...rest
}: IProps) => {
  const renderItems = () => {
    return items.map(({ content, onClick }, index) => {
      return (
        <Menu.Item key={`${name}-${index}`} onClick={onClick}>
          {content}
        </Menu.Item>
      );
    });
  };

  return (
    <Dropdown
      overlay={<Menu>{renderItems()}</Menu>}
      trigger={trigger}
      className={wide ? `${styles.dropdown} ${styles.wide}` : styles.dropdown}
      {...rest}
    >
      <div className={cn(styles.dropdownWrapper, className)}>
        <div className={styles.dropdownNameWrapper}>
          {icon && (
            <div className={styles.icon}>
              <IconSvg icon={icon} />
            </div>
          )}
          <div className={styles.flexContainer}>
            <div className={styles.childrenContainer}>{children}</div>
            {!isCaretOutside && <CaretDownOutlined className={styles.arrow} />}
          </div>
        </div>
        {isCaretOutside && <CaretDownOutlined className={styles.arrow} />}
      </div>
    </Dropdown>
  );
};

export default BasicDropdown;
