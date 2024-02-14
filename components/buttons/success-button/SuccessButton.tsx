import React, { memo, ReactNode } from 'react';
import { Button } from 'antd';
import { ButtonProps } from 'antd/lib/button';
import cn from 'classnames';

import styles from './SuccessButton.module.scss';

interface IProps extends ButtonProps {
  children?: ReactNode;
  className?: string;
  onClick?: (event?: any) => void;
}

const SuccessButton = ({ children, className, onClick, ...rest }: IProps) => {
  return (
    <Button size='middle' className={cn(styles.button, className)} onClick={onClick} {...rest}>
      {children}
    </Button>
  );
};

export default memo(SuccessButton);
