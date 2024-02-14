import { ReactNode } from 'react';

import styles from './SectionText.module.scss';

interface IProps {
  children: ReactNode;
}

const SectionText = ({ children }: IProps) => {
  return <p className={styles.text}>{children}</p>;
};

export default SectionText;
