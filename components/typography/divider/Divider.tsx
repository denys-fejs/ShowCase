import { ReactNode } from 'react';
import { Divider as AntdDivider, DividerProps } from 'antd';
import cn from 'classnames';

import styles from './Divider.module.scss';

interface IProps extends DividerProps {
  children?: ReactNode;
  color?: string;
  type?: 'horizontal' | 'vertical';
}

const Divider = ({ children, orientation = 'left', color = '', type = 'horizontal', className, ...rest }: IProps) => {
  return (
    <AntdDivider
      {...rest}
      className={cn(styles[color], styles.divider, className)}
      type={type}
      orientation={orientation}
      plain
      style={type === 'vertical' ? { height: '1.9em' } : {}}
    >
      {children}
    </AntdDivider>
  );
};

export default Divider;
