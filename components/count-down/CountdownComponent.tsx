import moment from 'moment';
import Countdown from 'react-countdown';
import { useTranslation } from 'react-i18next';

//styles
import styles from './CountdownComponent.module.scss';

interface IPropsTypes {
  endTime?: number;
  text?: string;
}

const CountdownComponent = ({ endTime = 0, text = 'auctionEnded' }: IPropsTypes) => {
  const { t } = useTranslation('views/auction');

  const renderer = (props: any) => {
    const { formatted, completed } = props;
    if (completed) {
      return (
        <>
          {t(`createAuction.${text}`)}: <span className={styles.text}>{moment(endTime).format('ll')}</span>
        </>
      );
    } else {
      return (
        <>
          {t('createAuction.timeLeft')}:
          <span className={styles.text}>{`${props.days ? props.days + 'd' : ''} ${formatted.hours}:${
            formatted.minutes
          }:${formatted.seconds}`}</span>
        </>
      );
    }
  };

  return <Countdown date={endTime} renderer={renderer} />;
};

export default CountdownComponent;
