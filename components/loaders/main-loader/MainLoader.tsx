import { ReactNode } from 'react';
import { Spin } from 'antd';
import cn from 'classnames';

//styles
import styles from './MainLoader.module.scss';
interface IProps {
  isLoading?: boolean;
  children?: ReactNode;
  className?: string;
}

const MainLoader = ({ isLoading, children, className = '' }: IProps) => {
  if (isLoading) {
    return (
      <div className={cn(styles.loaderContainer, styles[className])}>
        <Spin size='large' />
      </div>
    );
  }

  return <>{children}</>;
};

export default MainLoader;
