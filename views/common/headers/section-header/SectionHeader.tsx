import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import cn from 'classnames';

import { SectionTitle, Divider } from 'components';
import SortingSelectView from '../sorting-select-view/SortingSelectView';

import styles from './SectionHeader.module.scss';

interface IProps {
  children?: ReactNode;
  className?: string;
  hideDivider?: boolean;
  onSort?: (value: string) => void;
}

const SectionHeader = ({ children, className, hideDivider, onSort }: IProps) => {
  const { t } = useTranslation('views/common');
  return (
    <div className={cn(className, styles.sectionHeaderWrapper)}>
      <div className={styles.mainTitleContainer}>
        <SectionTitle className={styles.leftAlign}>{children}</SectionTitle>
        {!!onSort && (
          <div className={styles.sortingContainer}>
            <span className={styles.sortingLabel}>{t('header.sortBy')}</span>
            <SortingSelectView />
          </div>
        )}
      </div>
      {!hideDivider && <Divider color={'lightGrey'} />}
    </div>
  );
};

export default SectionHeader;
