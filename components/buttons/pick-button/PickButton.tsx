import { memo, ReactNode } from 'react';
import { Button } from 'antd';
import { ButtonSize } from 'antd/es/button';
import cn from 'classnames';

import styles from './PickButton.module.scss';

interface IProps {
  children?: ReactNode;
  className?: string;
  active?: boolean;
  onClick?: (event?: any) => void;
  size?: ButtonSize;
}

const PickButton = ({ children, className, active = false, size = 'middle', onClick }: IProps) => {
  return (
    <Button size={size} className={cn(styles.button, className, { [styles.active]: active })} onClick={onClick}>
      {children}
    </Button>
  );
};

export default memo(PickButton);
