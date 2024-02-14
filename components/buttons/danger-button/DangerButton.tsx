import { memo, ReactNode } from 'react';
import { Button } from 'antd';
import cn from 'classnames';

import styles from './DangerButton.module.scss';

interface IProps {
  children?: ReactNode;
  className?: string;
  onClick: (event?: any) => void;
}

const DangerButton = ({ children, className, onClick }: IProps) => {
  return (
    <Button size='large' className={cn(styles.button, className)} onClick={onClick}>
      {children}
    </Button>
  );
};

export default memo(DangerButton);
