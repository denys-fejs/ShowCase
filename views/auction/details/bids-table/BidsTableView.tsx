import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Pagination } from 'antd';
import { useTranslation } from 'react-i18next';
import { useStoreState } from 'easy-peasy';

import appConfig from 'config/appConfig';
import { BidsFilter, DEFAULT_PAGE_SIZE, NotificationTypes, SocketEvents } from 'constants/index';
import { IAuctionBids, IBidDetails, IStoreModel } from 'types';
import { formatCash, formatWalletAddress, isAddressesEqual } from 'utils';
import { Notification, Table } from 'components';
import SocketContext from 'views/common/socket/SocketContext';

import styles from './BidsTableView.module.scss';

interface IProps {
  bids: Array<IBidDetails>;
  setAuctionBids: (bids: Array<IAuctionBids>) => unknown;
  filter?: BidsFilter;
}

const BidsTableView = ({ bids, setAuctionBids, filter = BidsFilter.All }: IProps) => {
  const { t } = useTranslation('views/auction');
  const auctionInfo = useStoreState<IStoreModel>((state) => state.auction.auctionInfo);
  const [currentPage, setCurrentPage] = useState(1);
  const { subscribe } = useContext(SocketContext);
  const walletAddress = useStoreState<IStoreModel, string | null>((store) => store.blockchain.wallet?.walletAddress);
  const filteredBids = useMemo(() => {
    return bids.filter(({ bidder }) => {
      if (filter === BidsFilter.My && walletAddress) {
        return isAddressesEqual(bidder, walletAddress);
      }

      return true;
    });
  }, [bids, filter, walletAddress]);

  useEffect(() => {
    if (subscribe) {
      subscribe(SocketEvents.AuctionBid, ({ data }) => {
        setAuctionBids([...auctionInfo.bids, data]);
        Notification({
          notificationType: NotificationTypes.Success,
          message: t('table.bidPlaced'),
        });
      });
    }
  }, []);

  const handleTxClick = useCallback((bid: IBidDetails) => {
    window.open(`${appConfig.explorerUrl}/tx/${bid.txHash}`, '_blank');
  }, []);

  const rowClassName = useCallback(({ winningShare }: IBidDetails) => {
    if (winningShare === 100) {
      return 'green';
    } else if (winningShare > 0) {
      return 'yellow';
    } else {
      return '';
    }
  }, []);

  const showTotal = () => {
    const total = filteredBids.length;
    const indexOfLastBid = currentPage * DEFAULT_PAGE_SIZE;
    const indexOfFirstBid = indexOfLastBid - DEFAULT_PAGE_SIZE;
    return (
      <div className={styles.totalPagination}>
        {indexOfFirstBid + 1} - {indexOfLastBid > total ? total : indexOfLastBid} of {total}
      </div>
    );
  };

  const columns = useMemo(
    () => [
      {
        title: t('table.address'),
        dataIndex: 'bidder',
        width: 100,
        render: (bidder: string) => (
          <a
            href={`${appConfig.explorerUrl}/account/${bidder}`}
            target='_blank'
            rel='noreferrer'
            className={styles.link}
            onClick={(e) => e.stopPropagation()}
          >
            {formatWalletAddress(bidder)}
          </a>
        ),
      },
      {
        title: t('table.bidAmount'),
        dataIndex: 'amountToBuy',
        render: (amountToBuy: number) => formatCash(amountToBuy),
      },
      {
        title: t('table.winAmount'),
        dataIndex: 'win',
        render: (win: number) => formatCash(win),
      },
      {
        title: t('table.priceForToken'),
        dataIndex: 'pricePerToken',
        render: (pricePerToken: number) => `${formatCash(pricePerToken)} ${t(`common:blockchain.unit`)}`,
      },
      {
        title: t('table.totalPrice'),
        dataIndex: 'price',
        render: (price: number) => `${formatCash(price)} ${t(`common:blockchain.unit`)}`,
      },
      {
        title: t('table.winShare'),
        dataIndex: 'winningShare',
        render: (winningShare: number) => `${winningShare.toLocaleString()} %`,
      },
    ],
    [filteredBids, auctionInfo, t],
  );

  const pagedBids = useMemo(() => {
    return filteredBids.slice((currentPage - 1) * DEFAULT_PAGE_SIZE, currentPage * DEFAULT_PAGE_SIZE);
  }, [filteredBids, currentPage]);

  return (
    <>
      <div className={styles.bidSection}>
        <div className={styles.bidList}>
          <Table
            columns={columns}
            showSorterTooltip={false}
            className={styles.table}
            onRowClick={handleTxClick}
            data={pagedBids}
            rowClassName={rowClassName}
            text={t('createAuction.noBids')}
          />
        </div>
      </div>
      {filteredBids && filteredBids.length > DEFAULT_PAGE_SIZE && (
        <div className={styles.pagination}>
          <Pagination
            defaultCurrent={1}
            total={filteredBids.length}
            pageSize={DEFAULT_PAGE_SIZE}
            showTotal={showTotal}
            onChange={(page: number) => setCurrentPage(page)}
          />
        </div>
      )}
    </>
  );
};

export default BidsTableView;
