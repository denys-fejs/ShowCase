import EmissionsBar from '../emission-bar';
import DetailsItem from 'components/typography/details-item';
import cn from 'classnames';
import { useTranslation } from 'react-i18next';

import styles from './EmissionPlan.module.scss';

interface IProps {
  burned?: number;
  planed?: number;
  available?: number;
}

const EmissionPlan = ({ planed = 0, available = 0, burned = 0 }: IProps) => {
  const { t } = useTranslation('views/project');
  const rateBurned = (burned / planed) * 100;
  const rateAvailable = (available / planed) * 100;

  return (
    <div className={styles.emissionsBar}>
      <EmissionsBar rateBurned={rateAvailable + rateBurned} rateAvailable={rateAvailable} />
      <ul className={styles.emissionsValues}>
        <li className={styles.emissionsItem}>
          <DetailsItem
            title={t('projectInfo.emissionPlan.available')}
            value={`${available} ${t('projectInfo.emissionUnit')}`}
          />
        </li>
        <li className={cn(styles.emissionsItem, styles.burned)}>
          <DetailsItem
            title={t('projectInfo.emissionPlan.burned')}
            value={`${burned} ${t('projectInfo.emissionUnit')}`}
          />
        </li>
        <li className={cn(styles.emissionsItem, styles.planed)}>
          <DetailsItem
            title={t('projectInfo.emissionPlan.planed')}
            value={`${planed} ${t('projectInfo.emissionUnit')}`}
          />
        </li>
      </ul>
    </div>
  );
};

export default EmissionPlan;
