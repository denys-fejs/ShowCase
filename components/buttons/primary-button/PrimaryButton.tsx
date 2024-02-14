import { memo, ReactNode } from 'react';
import cn from 'classnames';
import { Button } from 'antd';
import { ButtonProps } from 'antd/lib/button';
import { SizeType } from 'antd/lib/config-provider/SizeContext';
import { ButtonSize } from 'types';

//styles
import styles from './PrimaryButton.module.scss';

interface IProps extends ButtonProps {
  children: string | ReactNode;
  size?: SizeType;
  className?: string;
  shadow?: boolean;
  isLoading?: boolean;
}

const PrimaryButton = ({ children, className, size = ButtonSize.Large, shadow = true, isLoading, ...rest }: IProps) => {
  return (
    <Button
      {...rest}
      htmlType='button'
      size={size}
      loading={isLoading}
      className={cn(styles.button, className, size, { [styles.shadow]: shadow })}
    >
      {children}
    </Button>
  );
};

export default memo(PrimaryButton);
