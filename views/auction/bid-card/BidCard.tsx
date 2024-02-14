import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { IconSvg } from 'components';
import { IAuctionBidCard } from 'types/api/auction';
import { Routes } from 'constants/routes';

//styles
import styles from './BidCard.module.scss';
import Countdown from 'react-countdown';
import moment from 'moment';

//types
interface IPropsTypes {
  item: IAuctionBidCard;
}

const BidCard = ({ item }: IPropsTypes) => {
  const { t } = useTranslation('views/auction');
  const { endTime } = item;

  const renderer = (props: any) => {
    const { formatted } = props;

    if (props.completed) {
      return (
        <>
          <IconSvg icon={'mask'} />
          {t('createAuction.auctionEnded')}: <span>{moment(endTime).format('ll')}</span>
        </>
      );
    } else {
      return (
        <>
          <IconSvg icon={'time'} />
          {t('createAuction.timeLeft')}:{' '}
          <span>{`${props.days ? props.days + 'd' : ''} ${formatted.hours}:${formatted.minutes}:${
            formatted.seconds
          }`}</span>
        </>
      );
    }
  };

  return (
    <div className={styles.bidCard}>
      <Link to={Routes.auction.replace(':auctionId', String(item.auctionId))}>
        <h1>{item.tokenName}</h1>
      </Link>
      <div className={styles.subTitle}>
        <div className={styles.time}>{endTime && <Countdown date={endTime} renderer={renderer}></Countdown>}</div>
      </div>
      <div className={styles.inputsContainer}>
        <div className={styles.tokensToBuy}>
          <span className={styles.title}>{t('createAuction.tokensToBuy')}</span>
          <div className={styles.textArea}>
            <span>{item.amountToBuy}</span>
          </div>
        </div>
        <div className={styles.ccToBid}>
          <span className={styles.title}>{t('createAuction.ccToBid')}</span>
          <div className={styles.textArea}>
            <span>{item.bidPrice}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BidCard;
