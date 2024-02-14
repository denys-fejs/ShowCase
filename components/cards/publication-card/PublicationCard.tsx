import { Card } from 'antd';
import { useTranslation } from 'react-i18next';
import IconSvg from 'components/icons';
import { formatDateTime } from 'utils/formatDate';

//styles
import styles from './PublicationCard.module.scss';
import defaultCoverImg from 'resources/images/bg/publicationBg.png';

interface IProps {
  item: any;
}

const PublicationCard = ({ item }: IProps) => {
  const { t } = useTranslation('views/common');
  const { coverImage, title, description, publicationDate, sourceUrl } = item;
  const coverBg = coverImage || defaultCoverImg;
  const dateString = formatDateTime(publicationDate);
  return (
    <Card style={{ backgroundImage: `url("${coverBg}")` }} className={styles.publicationCard} extra={<div></div>}>
      <span className={styles.title}>{title}</span>
      <p className={styles.description}>{description}</p>
      <span className={styles.cornerDate}>{dateString}</span>
      <a href={sourceUrl} className={styles.learnMore} target='_blank' rel='noreferrer'>
        {t('learnMore')}
        <IconSvg icon='arrowRight' />
      </a>
    </Card>
  );
};

export default PublicationCard;
