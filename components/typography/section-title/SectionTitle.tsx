import { ReactNode } from 'react';
import cn from 'classnames';
import styles from './SectionTitle.module.scss';

interface IProps {
  children: ReactNode;
  subtitle?: ReactNode;
  className?: string;
}

const SectionTitle = ({ children, subtitle, className = '' }: IProps) => {
  return (
    <div className={cn(styles.container, className)}>
      <h2 className={styles.sectionTitle}>{children}</h2>
      {!!subtitle && <h3 className={styles.sectionSubtitle}>{subtitle}</h3>}
    </div>
  );
};

export default SectionTitle;
