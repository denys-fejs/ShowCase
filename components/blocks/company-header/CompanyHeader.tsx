import { Icons } from 'types';
import CopyButton from 'components/buttons/copy-button/CopyButton';
import IconSvg from 'components/icons/IconSvg';

import styles from './CompanyHeader.module.scss';

interface IProps {
  companyName: string;
  accountAddress: string;
  icon?: Icons;
}

const CompanyHeader = ({ companyName, accountAddress, icon = 'company' }: IProps) => {
  return (
    <div>
      <div className={styles.icon}>
        <IconSvg icon={icon} />
      </div>
      <h4 className={styles.companyName}>{companyName}</h4>
      <div className={styles.accountAddress}>
        <CopyButton textToCopy={accountAddress} />
      </div>
    </div>
  );
};

export default CompanyHeader;
