import { ReactNode } from 'react';
import { Card } from 'antd';

import styles from './DropdownCard.module.scss';

interface IProps {
  children?: ReactNode;
}

const DropdownCard = ({ children }: IProps) => {
  return <Card className={styles.accountCard}>{children}</Card>;
};

export default DropdownCard;
