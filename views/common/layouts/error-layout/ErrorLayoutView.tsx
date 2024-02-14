import { ReactNode } from 'react';

import FooterView from 'views/common/footer/FooterView';
import BasicHeaderView from 'views/common/headers/basic-header/BasicHeaderView';

import styles from './ErrorLayoutView.module.scss';

interface IProps {
  children?: ReactNode;
}

const ErrorLayoutView = ({ children }: IProps) => {
  return (
    <div className={styles.container}>
      <BasicHeaderView />
      <div className={styles.content}>{children}</div>
      <FooterView />
    </div>
  );
};

export default ErrorLayoutView;
