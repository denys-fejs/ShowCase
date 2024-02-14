import { memo, ReactNode } from 'react';
import cn from 'classnames';
import { Button, ButtonProps } from 'antd';
import { SizeType } from 'antd/es/config-provider/SizeContext';

import styles from './SecondaryButton.module.scss';

interface IProps extends ButtonProps {
  children?: ReactNode;
  size?: SizeType;
  className?: string;
  onClick: (event?: any) => void;
  disabled?: boolean;
}

const SecondaryButton = ({ children, className, onClick, size = 'middle', disabled, ...rest }: IProps) => {
  return (
    <Button
      {...rest}
      size={size}
      className={cn(styles.button, className, styles[size])}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </Button>
  );
};

export default memo(SecondaryButton);
