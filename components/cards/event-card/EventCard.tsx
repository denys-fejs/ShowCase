import { Card } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

import IconSvg from 'components/icons';
import { COUNTRIES_MAP } from 'constants/countries';
import { formatDate } from 'utils/formatDate';

import styles from './EventCard.module.scss';
import Flags from 'country-flag-icons/react/3x2';
import { IProjectEventResponse } from 'types/api/project-events';

interface IProps {
  data: IProjectEventResponse;
}
const EventCard = ({ data }: IProps) => {
  const { country, startDate, title, description, endDate, url } = data;
  const { t } = useTranslation(['views/project', 'common']);
  const Flag = country ? Flags[country] : GlobalOutlined;
  return (
    <a href={url} target='_blank' rel='noreferrer'>
      <Card
        className={styles.eventCard}
        title={
          <div className={styles.dateBlock}>
            <IconSvg icon='event' />
            <span className={styles.date}>{formatDate(startDate, 'D dd')}</span>
            {endDate && startDate !== endDate && (
              <span className={styles.date}>{`- ${formatDate(endDate, 'D dd')}`}</span>
            )}
          </div>
        }
        extra={
          <div className={styles.projectCountry}>
            {!!country && (
              <>
                <Flag className={styles.flag} />
                <span>{t([`common:country.${country}`, COUNTRIES_MAP[country]])}</span>
              </>
            )}
          </div>
        }
      >
        <h5 className={styles.title}>{title}</h5>
        <p className={styles.description}>{description}</p>
      </Card>
    </a>
  );
};

export default EventCard;
