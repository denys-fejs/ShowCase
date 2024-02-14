import { ReactNode } from 'react';

import styles from './Badge.module.scss';

interface IProps {
  children: ReactNode;
}

const Badge = ({ children }: IProps) => {
  return (
    <div className={styles.badge}>
      <span>{children}</span>
    </div>
  );
};

export default Badge;
