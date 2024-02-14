import React, { useMemo } from 'react';
import Countdown, { CountdownRenderProps } from 'react-countdown';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useStoreActions, useStoreState } from 'easy-peasy';
import moment from 'moment';

import { BidsFilter, Routes } from 'constants/index';
import { BasicDropdown, IconSvg } from 'components';
import { IStoreModel } from 'types';

import styles from './AuctionInfoView.module.scss';

interface IProps {
  filter?: BidsFilter;
  setFilter?: (filter: BidsFilter) => void;
}

const AuctionInfoView = ({ filter = BidsFilter.All, setFilter }: IProps) => {
  const { t } = useTranslation('views/auction');
  const auctionInfo = useStoreState<IStoreModel>((state) => state.auction.auctionInfo);
  const getAuctionInfo = useStoreActions<IStoreModel>((actions) => actions.auction.getAuctionInfo);
  const endTime = Number(auctionInfo?.endTime) * 1000;

  const filterItems = useMemo(() => {
    return setFilter
      ? [
          {
            content: t('filter.all'),
            onClick: () => setFilter(BidsFilter.All),
          },
          {
            content: t('filter.my'),
            onClick: () => setFilter(BidsFilter.My),
          },
        ]
      : undefined;
  }, [setFilter]);

  const handleComplete = () => {
    getAuctionInfo({ auctionId: auctionInfo.auctionId });
  };

  const renderCountdown = ({ formatted, completed, days }: CountdownRenderProps) => {
    if (completed) {
      return (
        <>
          {t('createAuction.auctionEnded')}: <span>{moment(endTime).format('ll')}</span>
        </>
      );
    } else {
      return (
        <>
          {t('createAuction.timeLeft')}:{' '}
          <span>{`${days ? days + 'd' : ''} ${formatted.hours}:${formatted.minutes}:${formatted.seconds}`}</span>
        </>
      );
    }
  };

  return (
    <div className={styles.projectInfo}>
      <div className={styles.left}>
        <h1>
          {auctionInfo.project.tokenName}
          <span className={styles.tokenAbbreviation}>
            {auctionInfo.amount} {auctionInfo?.project?.tokenTicker}
          </span>
        </h1>
        <Link to={Routes.projectDetails.replace(':id', `${auctionInfo.project.id}`)}>
          {t('createAuction.projectInformation')}
        </Link>
      </div>
      <div className={styles.right}>
        <div className={styles.timeLeft}>
          {endTime && (
            <>
              <IconSvg icon='time' />
              <Countdown date={endTime} renderer={renderCountdown} onComplete={handleComplete} />
            </>
          )}
        </div>
        {filterItems && (
          <div>
            <BasicDropdown name='filterBids' items={filterItems} placement='bottomCenter'>
              {t(`filter.${filter}`)}
            </BasicDropdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuctionInfoView;
