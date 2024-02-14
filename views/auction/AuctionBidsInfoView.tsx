import React, { useCallback, useEffect } from 'react';
import { useStoreActions, useStoreState } from 'easy-peasy';
import moment from 'moment';
import { Pagination, Tooltip } from 'antd';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';
import BasicSearchHeader from 'views/common/headers/basic-search-header/BasicSearchHeader';
import { IconSvg, Table } from 'components';
import BidCard from './bid-card/BidCard';
import { IStoreModel } from 'types';
import { IAuctionBids, IAuctionsListResponseBody } from 'types/api/auction';
import { Routes } from 'constants/routes';

//styles
import styles from './AuctionBidsInfoView.module.scss';
import Countdown from 'react-countdown';

const AuctionBidsInfoView = () => {
  const { t } = useTranslation('views/auction');

  const walletAddress = useStoreState<IStoreModel, string | null>((store) => store.blockchain.wallet.walletAddress);
  const auctionBidsInfo = useStoreState<IStoreModel>((state) => state.auction.auctionBidsInfo);
  const auctionList = useStoreState<IStoreModel>((state) => state.auction.auctionList);

  const getAuctionBidsInfo = useStoreActions<IStoreModel>((actions) => actions.auction.getAuctionBidsInfo);
  const getAuctionList = useStoreActions<IStoreModel>((actions) => actions.auction.getAuctionsList);

  const history = useHistory();

  const loadAuctionBidsCallback = useCallback(() => {
    getAuctionList({ walletAddress });
  }, [walletAddress]);

  useEffect(() => {
    getAuctionBidsInfo({ walletAddress, page: 1, pageSize: 10 });
    loadAuctionBidsCallback();
  }, []);

  const auctionData = () => {
    return auctionList
      ?.map((item: IAuctionsListResponseBody) => {
        const endTime = item?.endTime * 1000;
        const endDate = moment(endTime).format('ll');
        const time = moment().valueOf();

        return {
          timeStatus: endTime > time ? endTime : 'Ended',
          tokenName: item.tokenName ? item.tokenName : '-',
          type: endTime > time ? 'time' : 'ended',
          id: item?.auctionId,
          endDate,
          startTime: item.startTime,
        };
      })
      .sort((currentAuction: any, nextAuction: any) => nextAuction.startTime - currentAuction.startTime)
      .sort((currentAuction: any) => {
        if (currentAuction.timeStatus === 'Ended') {
          return 1;
        }
      });
  };

  const bidsData = () => {
    return auctionBidsInfo?.items?.map((item: IAuctionBids) => {
      const endTime = item?.auctionEndTime * 1000;
      const endDate = moment(endTime).format('ll');
      const time = moment().valueOf();

      return {
        timeStatus: endTime > time ? endTime : 'Ended',
        tokenName: item.tokenName ? item.tokenName : '-',
        type: endTime > time ? 'time' : 'ended',
        id: item?.bidId,
        amountToBuy: item?.amountToBuy,
        bidPrice: item?.bidPrice,
        endDate,
        endTime,
        auctionId: item?.auctionId,
      };
    });
  };

  const onChange = (page: any, pageSize: any) => {
    getAuctionBidsInfo({ walletAddress, page, pageSize });
  };

  const handleAuctionClick = useCallback((auction: any) => {
    history.push(Routes.auction.replace(':auctionId', String(auction.id)));
  }, []);

  function showTotal() {
    return (
      <div className={styles.totalPagination}>
        1 - {auctionBidsInfo?.meta?.totalPages} of {auctionBidsInfo?.meta?.itemCount}
      </div>
    );
  }

  const renderer = (props: any) => {
    const { formatted } = props;
    return (
      <>
        <span>{`${props.days ? props.days + 'd' : ''} ${formatted.hours}:${formatted.minutes}:${
          formatted.seconds
        }`}</span>
      </>
    );
  };

  const columns = [
    {
      title: 'My Auctions',
      className: 'title',
      dataIndex: 'tokenName',
    },
    {
      dataIndex: 'timeStatus',
      render: (type: string, item: any) => {
        return (
          <>
            {type === 'Ended' ? (
              <div className={styles.row}>
                <Tooltip title={item.endDate} mouseEnterDelay={0.5} placement='topLeft'>
                  {type}
                </Tooltip>
                <IconSvg icon='mask' />
              </div>
            ) : (
              <div className={styles.row}>
                {item.timeStatus && <Countdown date={item.timeStatus} renderer={renderer}></Countdown>}
                <IconSvg icon='time' />
              </div>
            )}
          </>
        );
      },
    },
  ];
  const bids = bidsData();

  const rowClassName = useCallback((record) => {
    return record.type === 'time' ? 'time' : '';
  }, []);

  return (
    <>
      <BasicSearchHeader onSearch={() => undefined} />
      <div className={styles.container}>
        <div className={styles.left}>
          <Table
            columns={columns}
            maxHeight={768}
            refresh={loadAuctionBidsCallback}
            showSorterTooltip={false}
            className={styles.table}
            data={auctionData()}
            onRowClick={handleAuctionClick}
            scroll={{ y: `calc(100vh - 300px)` }}
            text={t('noAuctions')}
            rowClassName={rowClassName}
          />
        </div>
        <div className={styles.right}>
          <div className={styles.bidCardContainer}>
            <div className={styles.title}>{t('createAuction.myBids')}</div>
            <div className={styles.bidsWrapper}>
              {bids && bids.length > 0 ? (
                <>
                  {bids.map((item: any) => {
                    return (
                      <React.Fragment key={item.id}>
                        <BidCard item={item} />
                      </React.Fragment>
                    );
                  })}
                </>
              ) : (
                <div className={styles.noBidsPlaceholder}>{t('noData')}</div>
              )}
            </div>
          </div>
          {bids && bids.length > 0 && (
            <div className={styles.pagination}>
              <Pagination
                defaultCurrent={1}
                total={auctionBidsInfo?.meta?.itemCount}
                showTotal={showTotal}
                onChange={onChange}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AuctionBidsInfoView;
