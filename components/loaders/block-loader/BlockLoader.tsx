import { ReactNode } from 'react';
import { Spin } from 'antd';
import { SpinProps } from 'antd/lib/spin';
import cn from 'classnames';

//styles
import styles from './BlockLoader.module.scss';

interface IProps extends SpinProps {
  isLoading?: boolean;
  children?: ReactNode;
  className?: string;
}

const BlockLoader = ({ isLoading, children, className = '', size = 'large', ...rest }: IProps) => {
  if (isLoading) {
    return (
      <div className={cn(styles.loaderContainer, className)}>
        <Spin size={size} {...rest}>
          {children}
        </Spin>
      </div>
    );
  }

  return <>{children}</>;
};

export default BlockLoader;
