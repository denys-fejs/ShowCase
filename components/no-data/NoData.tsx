import { PrimaryButton } from 'components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import cn from 'classnames';

//styles
import styles from './NoData.module.scss';

interface IPropsTypes {
  title?: string;
  bigPlaceholder?: boolean;
  text?: string;
  refresh?: (params?: any) => any;
}

const NoData = ({ title, bigPlaceholder = false, text, refresh }: IPropsTypes) => {
  const { t } = useTranslation('common');

  const refreshBtn = () => {
    if (refresh) {
      refresh();
    }
  };

  return (
    <div className={styles.container}>
      <div className={cn(styles.content, { [styles.big]: bigPlaceholder })}>
        {!text && <h1>{t('noData.noDataTitle', { title })}</h1>}
        {!text && <p>{t('noData.newDataTitle', { title })}</p>}
        {text && <h1>{text}</h1>}
        {refresh && <PrimaryButton onClick={() => refreshBtn()}>{t('noData.refresh', { title })}</PrimaryButton>}
      </div>
    </div>
  );
};

export default NoData;
