import cn from 'classnames';
import styles from './DataRow.module.scss';
import IconSvg from 'components/icons';
import { Icons } from 'types/components/icons';

interface IProps {
  icon: Icons;
  label: string;
  data?: string;
  className?: string;
  link?: string;
  downloadUrl?: string;
  auditDocument?: boolean;
}

const DataRow = ({ icon, label, data, className = '', link = '', downloadUrl = '', auditDocument }: IProps) => {
  return (
    <div className={styles.contactsDataRow}>
      <div className={styles.icon}>
        <IconSvg icon={icon} />
      </div>
      <div className={cn(styles.contactsData, { [styles.border]: auditDocument })}>
        <div className={cn(styles.padding, className, { [styles.isData]: !data })}>
          <h6 className={cn(styles.label, { [styles.auditDocumentLabel]: auditDocument })}>{label}</h6>
          {link ? (
            <a href={link} className={styles.data}>
              {data}
            </a>
          ) : (
            <span className={cn(styles.data, { [styles.auditDocumentData]: auditDocument })}>{data}</span>
          )}
        </div>
        {downloadUrl && (
          <a className={styles.download} href={downloadUrl} download>
            <IconSvg icon='download' />
          </a>
        )}
      </div>
    </div>
  );
};

export default DataRow;
