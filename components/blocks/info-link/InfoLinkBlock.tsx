import { Link } from 'react-router-dom';

import { Routes } from 'constants/routes';
import IconSvg from 'components/icons';
import { Icons } from 'types/components/icons';

import styles from './InfoLinkBlock.module.scss';

interface IProps {
  icon: Icons;
  title: string;
  text: string;
  linkLabel: string;
  linkRoute: Routes;
  height?: number;
  width?: number;
}

const InfoLinkBlock = ({ icon, title, text, linkLabel, linkRoute, height = 427, width = 348 }: IProps) => {
  return (
    <Link to={linkRoute} className={styles.block} style={{ height, width }}>
      <div className={styles.userTypeIcon}>
        <IconSvg icon={icon} />
      </div>
      <div className={styles.contentWrap}>
        <div className={styles.content}>
          <div>
            <h4 className={styles.title}>{title}</h4>
            <p className={styles.description}>{text}</p>
          </div>
          <div>
            <span className={styles.linkLabel}>{linkLabel}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default InfoLinkBlock;
