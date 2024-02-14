import React, { ReactNode } from 'react';
import styles from './PageTitle.module.scss';

interface IProps {
  children: ReactNode;
}

const PageTitle = ({ children }: IProps) => {
  return <h1 className={styles.pageTitle}>{children}</h1>;
};

export default PageTitle;
