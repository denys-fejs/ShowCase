import { memo, ReactNode } from 'react';
import cn from 'classnames';
import { Button } from 'antd';

import styles from './MoreButton.module.scss';

interface IProps {
  children?: ReactNode;
  onClick?: () => void;
  className?: string;
}

const MoreButton = ({ children, onClick, className = '' }: IProps) => {
  return (
    <Button size='large' className={cn(styles.buttonMore, className)} onClick={onClick}>
      {children}
    </Button>
  );
};

export default memo(MoreButton);
