import { ReactNode } from 'react';
import { Card } from 'antd';
import cn from 'classnames';

import styles from './BasicCard.module.scss';

interface IProps {
  title?: ReactNode;
  extra?: ReactNode;
  children?: ReactNode;
  className?: string;
}

const BasicCard = ({ title, extra, children, className = '' }: IProps) => {
  return (
    <Card className={cn(styles.basicCard, className)} title={title} extra={extra}>
      {children}
    </Card>
  );
};

export default BasicCard;
