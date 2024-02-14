import { ReactNode } from 'react';

//styles
import styles from './DetailsSection.module.scss';

interface IProps {
  title: string;
  children: ReactNode;
  placeholder?: ReactNode;
}
const DetailsSection = ({ title, children, placeholder = 'No Data' }: IProps) => {
  return (
    <div className={styles.detailsSectionContainer}>
      <div className={styles.headerSection}>
        <h3 className={styles.header}>{title}</h3>
      </div>
      {children || <div className={styles.placeholder}>{placeholder}</div>}
    </div>
  );
};

export default DetailsSection;
