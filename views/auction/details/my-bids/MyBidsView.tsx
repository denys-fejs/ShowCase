import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { InfoCircleOutlined } from '@ant-design/icons';

import { IBidDetails, IStoreModel, IWalletState } from 'types';
import { AuctionContract } from 'blockchain';
import { ErrorTypes, NotificationTypes } from 'constants/index';
import { useFetch } from 'hooks';
import { isAddressesEqual } from 'utils';
import { Notification, PrimaryButton } from 'components';

import MakeBidView from '../make-bid/MakeBidView';

import styles from './MyBidsView.module.scss';

interface IProps {
  bids: Array<IBidDetails>;
}

const MyBidsView = ({ bids }: IProps) => {
  const { t } = useTranslation(['views/auction', 'common']);
  const wallet = useStoreState<IStoreModel, IWalletState>((store) => store.blockchain.wallet);
  const walletAddress = useStoreState<IStoreModel, string | null>((store) => store.blockchain.wallet?.walletAddress);
  const auctionInfo = useStoreState<IStoreModel>((state) => state.auction.auctionInfo);
  const endAuction = useStoreActions<IStoreModel>((actions) => actions.auction.endAuction);
  const getAuctionInfo = useStoreActions<IStoreModel>((actions) => actions.auction.getAuctionInfo);
  const isAuctionExpired = Number(auctionInfo?.endTime) * 1000 < moment().valueOf();

  const { myBidsCount, totalAmount, winAmount, totalBidPrice, winningBidsPrice } = useMemo(() => {
    const myBids = bids.filter(({ bidder }) => isAddressesEqual(bidder, walletAddress));

    return myBids.reduce(
      ({ myBidsCount, totalAmount, winAmount, totalBidPrice, winningBidsPrice }, bid) => {
        return {
          myBidsCount,
          totalAmount: totalAmount + bid.amountToBuy,
          winAmount: winAmount + bid.win,
          totalBidPrice: totalBidPrice + bid.price,
          winningBidsPrice: winningBidsPrice + bid.win * bid.pricePerToken,
        };
      },
      {
        myBidsCount: myBids.length,
        totalAmount: 0,
        winAmount: 0,
        totalBidPrice: 0,
        winningBidsPrice: 0,
      },
    );
  }, [bids, walletAddress]);

  const { response: isAuctionValid } = useFetch(async () => {
    if (!wallet.provider) {
      throw new Error(ErrorTypes.NoMetamask);
    }
    const auction = await AuctionContract.getAuction(auctionInfo.auctionStarter);
    return auction.isValid;
  }, [auctionInfo?.auctionStarter, isAuctionExpired]);

  const handleEndAuction = async () => {
    try {
      await endAuction(auctionInfo.auctionStarter);
      await getAuctionInfo({ auctionId: auctionInfo.auctionId });
    } catch (error) {
      Notification({
        notificationType: NotificationTypes.Error,
        message: t('common:errors.title'),
        description: t(`common:errors.${error.message}`, error.message),
      });
    }
  };

  return (
    <>
      <div className={styles.myBidsInfo}>
        {walletAddress ? (
          <>
            <h1>{t('createAuction.myBids')}</h1>
            <div className={styles.info}>
              <div className={styles.bids}>
                <h2>{t('myBids.bids')}</h2>
                <span>{myBidsCount}</span>
              </div>
              <div className={styles.totalAmount}>
                <h2>{t('myBids.totalAmount')}</h2>
                <span>
                  {totalAmount || 0} {auctionInfo?.project?.tokenTicker}
                </span>
              </div>
              <div className={styles.winAmount}>
                <h2>{t('myBids.winAmount')}</h2>
                <span>
                  {winAmount || 0} {auctionInfo?.project?.tokenTicker}
                </span>
              </div>
              <div className={styles.totalBidsPrice}>
                <h2>{t('myBids.totalBidsPrice')}</h2>
                <span>
                  {totalBidPrice} {t('common:blockchain.unit')}
                </span>
              </div>
              <div className={styles.winningBidsPrice}>
                <h2>{t('myBids.winningBidsPrice')}</h2>
                <span>
                  {winningBidsPrice} {t('common:blockchain.unit')}
                </span>
              </div>
            </div>
            <div className={styles.btnContainer}>
              {!isAuctionExpired && auctionInfo.auctionStarter !== walletAddress && <MakeBidView />}
              {isAuctionExpired && isAuctionValid && (
                <PrimaryButton onClick={handleEndAuction} className={styles.btn}>
                  {t('endAuction')}
                </PrimaryButton>
              )}
            </div>
          </>
        ) : (
          <div className={styles.warning}>{t('myBids.noWalletWarning')}</div>
        )}
      </div>
      <div className={styles.hint}>
        <InfoCircleOutlined className={styles.icon} />
        <span>{t('myBids.auctionHint')}</span>
      </div>{' '}
    </>
  );
};

export default MyBidsView;
