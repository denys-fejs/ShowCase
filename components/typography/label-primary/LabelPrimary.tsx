import { ReactNode } from 'react';
import cn from 'classnames';

//styles
import styles from './LabelPrimary.module.scss';
interface IProps {
  children: ReactNode;
  className?: string;
}

const LabelPrimary = ({ className, children }: IProps) => {
  return (
    <div className={cn(styles.label, className)}>
      <span>{children}</span>
    </div>
  );
};

export default LabelPrimary;
