import { useTranslation } from 'react-i18next';
import cn from 'classnames';

import { ICompanyDetailsResponseBody } from 'types';
import { CompanyStatus } from 'constants/index';
import { IconSvg } from 'components';

import styles from './CompanyStatusView.module.scss';

interface IProps {
  company: ICompanyDetailsResponseBody;
}

const CompanyStatusView = ({ company }: IProps) => {
  const { t } = useTranslation('views/company');

  if ([CompanyStatus.InReview, CompanyStatus.Pending].includes(company.status)) {
    return (
      <div className={styles.container}>
        <div className={cn(styles.statusLabel, styles.pendingLabel)}>
          <IconSvg icon='greenPending' />
          <span className={styles.statusText}>{t('waitingForApproval')}</span>
        </div>
      </div>
    );
  }

  if (company.status === CompanyStatus.Rejected) {
    return (
      <div className={styles.container}>
        <div className={cn(styles.statusLabel, styles.rejectLabel)}>
          <IconSvg icon='rejected' />
          <span className={styles.statusText}>{t('rejected')}</span>
        </div>
      </div>
    );
  }

  return <></>;
};

export default CompanyStatusView;
