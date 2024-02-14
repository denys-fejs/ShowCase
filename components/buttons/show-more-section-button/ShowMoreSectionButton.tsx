import { memo, ReactNode } from 'react';
import { Button } from 'antd';
import cn from 'classnames';

import styles from './ShowMoreSectionButton.module.scss';

interface IProps {
  children?: ReactNode;
  onClick: () => void;
  className?: string;
}

const ShowMoreSectionButton = ({ children, onClick, className }: IProps) => {
  return (
    <Button size='large' className={cn(styles.showMoreSectionButton, className)} onClick={onClick}>
      {children}
    </Button>
  );
};

export default memo(ShowMoreSectionButton);
