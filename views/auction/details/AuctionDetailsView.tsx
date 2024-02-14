import React, { useEffect, useMemo, useState } from 'react';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { useParams } from 'react-router';

import { BidsFilter } from 'constants/index';
import { IAuctionBids, IBidDetails, IStoreModel } from 'types';
import BasicSearchHeader from 'views/common/headers/basic-search-header/BasicSearchHeader';
import SocketView from 'views/common/socket/SocketView';

import MyBidsView from './my-bids/MyBidsView';
import AuctionInfoView from './auction-info/AuctionInfoView';
import BidsTableView from './bids-table/BidsTableView';

import styles from './AuctionDetailsView.module.scss';

const AuctionDetailsView = () => {
  const auctionInfo = useStoreState<IStoreModel>((state) => state.auction.auctionInfo);
  const getAuctionInfo = useStoreActions<IStoreModel>((actions) => actions.auction.getAuctionInfo);
  const [auctionBids, setAuctionBids] = useState<Array<IAuctionBids>>([]);
  const [filter, setFilter] = useState<BidsFilter>(BidsFilter.All);

  const { auctionId } = useParams<{ auctionId: string }>();

  useEffect(() => {
    getAuctionInfo({ auctionId });
  }, [auctionId]);

  useEffect(() => {
    if (auctionInfo) {
      setAuctionBids(auctionInfo.bids);
    }
  }, [auctionInfo]);

  const channels = useMemo(() => {
    if (auctionInfo?.auctionId) {
      return [`auction-${auctionInfo.auctionId}`];
    }
  }, [auctionInfo]);

  const sortedBids: Array<IBidDetails> = useMemo(() => {
    const bids = auctionBids.map((bid: IAuctionBids): IBidDetails => {
      return {
        id: bid.bidId,
        txHash: bid.txHash,
        amountToBuy: bid.amountToBuy,
        price: bid.bidPrice,
        pricePerToken: bid.bidPrice / bid.amountToBuy,
        bidder: bid.bidder,
        win: 0,
        winningShare: 0,
      };
    });

    bids.sort((bid1: IBidDetails, bid2: IBidDetails) => {
      if (bid2.pricePerToken === bid1.pricePerToken) {
        return bid1.id - bid2.id;
      } else {
        return bid2.pricePerToken - bid1.pricePerToken;
      }
    });

    let totalAmount = auctionInfo?.amount;
    return bids.map((bid: IBidDetails) => {
      let win = 0;
      if (totalAmount >= bid.amountToBuy) {
        win = bid.amountToBuy;
        totalAmount = totalAmount - bid.amountToBuy;
      } else {
        win = totalAmount;
        totalAmount = 0;
      }
      return {
        ...bid,
        win,
        winningShare: (win / bid.amountToBuy) * 100,
      };
    });
  }, [auctionBids]);

  return (
    auctionInfo && (
      <SocketView channels={channels}>
        <BasicSearchHeader />
        <div className={styles.auctionWrapper}>
          <div className={styles.left}>
            <MyBidsView bids={sortedBids} />
          </div>
          <div className={styles.right}>
            <AuctionInfoView filter={filter} setFilter={setFilter} />
            <BidsTableView filter={filter} bids={sortedBids} setAuctionBids={setAuctionBids} />
          </div>
        </div>
      </SocketView>
    )
  );
};

export default AuctionDetailsView;
