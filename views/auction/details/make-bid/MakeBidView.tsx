import React, { useContext, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FormikProps } from 'formik';
import { useStoreActions, useStoreState } from 'easy-peasy';

import appConfig from 'config/appConfig';
import { AuctionBidSchema } from 'validators/auction';
import { NotificationTypes, SocketEvents } from 'constants/index';
import { RowSpace, IBidInfo, IAuctionBidForm, IStoreModel, IWalletState } from 'types';
import { Provider } from 'blockchain';
import { useFetch, useModal } from 'hooks';
import { formatHashRequest, formatTxHash } from 'utils';
import { ActionModal, Col, Form, CalculatedFormField, Row, PrimaryButton, Notification, CopyButton } from 'components';
import SocketContext from 'views/common/socket/SocketContext';

import styles from './MakeBidView.module.scss';

const MakeBidView = () => {
  const { isOpen, open, close, loading } = useModal();
  const formRef = useRef<FormikProps<IBidInfo>>(null);
  const { t } = useTranslation('views/auction');
  const auctionInfo = useStoreState<IStoreModel>((state) => state.auction.auctionInfo);
  const wallet = useStoreState<IStoreModel, IWalletState>((store) => store.blockchain.wallet);
  const makeABid = useStoreActions<IStoreModel>((actions) => actions.auction.makeABid);
  const { emit } = useContext(SocketContext);

  const { response: balance } = useFetch(async () => {
    return wallet.walletAddress ? await Provider.getBalance(wallet.walletAddress) : null;
  }, [wallet.walletAddress]);

  const onSubmit = async (values: IAuctionBidForm) => {
    const { amountToBuy, ccToBid } = values;
    try {
      const bidStartPrice = (ccToBid / amountToBuy).toFixed(3);
      if (parseFloat(bidStartPrice) < Number(auctionInfo.startPrice)) {
        Notification({
          notificationType: NotificationTypes.Error,
          message: t('common:common.error'),
          description: `${t('createAuction.minimumPrice')} is lower than ${auctionInfo.startPrice} ${t(
            'common:blockchain.unit',
          )} for 1 ${auctionInfo.project?.tokenName}`,
        });
        return;
      }

      if (balance && ccToBid > parseFloat(balance)) {
        Notification({
          notificationType: NotificationTypes.Error,
          message: t('common:common.error'),
          description: t('notEnoughBalance'),
        });
        return;
      }

      const response = await makeABid({
        auctionStarter: auctionInfo.auctionStarter,
        auctionId: auctionInfo.auctionId,
        amountToBuy,
        ccToBid,
      });

      if (response?.hash && emit && auctionInfo.auctionId) {
        const txHash = formatHashRequest(response.hash);
        emit(SocketEvents.AuctionBidNew, { txHash, auctionId: Number(auctionInfo.auctionId) });
        Notification({
          notificationType: NotificationTypes.Info,
          message: t('myBids.inProgressMessage'),
          description: (
            <>
              {t('myBids.inProgressDescription')} <CopyButton textToCopy={txHash}>{formatTxHash(txHash)}</CopyButton>
              <br />
              <a
                href={`${appConfig.explorerUrl}/tx/${txHash}`}
                target='_blank'
                rel='noreferrer'
                className={styles.viewTransaction}
              >
                {t('common:common.viewTransaction')}
              </a>
            </>
          ),
          duration: 10,
        });
      }

      close();
    } catch (error) {
      Notification({
        notificationType: NotificationTypes.Error,
        message: t('common:errors.connect'),
        description: t(`common:errors.${error.message}`, error.message),
      });
    }
  };

  const okHandler = () => {
    if (formRef.current) {
      formRef.current.handleSubmit();
    }
  };

  return (
    <>
      <PrimaryButton onClick={open} className={styles.button}>
        {t('createAuction.makeAbid')}
      </PrimaryButton>
      <ActionModal
        isOpen={isOpen}
        close={close}
        loading={loading}
        onOk={okHandler}
        okText={t('createAuction.makeAbid')}
        title={t('createAuction.makeAbid')}
      >
        <Form onSubmit={onSubmit} formRef={formRef} validationSchema={AuctionBidSchema}>
          <Row verticalSpace={RowSpace.ExtraSmall} horizontalSpace={RowSpace.Small}>
            <Col>
              <CalculatedFormField name='amountToBuy' placeholder={t('createAuction.tokensToBuy')} required />
            </Col>
            <Col>
              <CalculatedFormField name='ccToBid' placeholder={t('createAuction.ccToBid')} required />
            </Col>
            <Col>
              <CalculatedFormField name='priceForToken' placeholder={t('createAuction.priceForToken')} disabled />
            </Col>
          </Row>
          <div>
            <span>
              {t('createAuction.minimumPrice')}: {auctionInfo?.startPrice} {t('common:blockchain.unit')} for 1{' '}
              {auctionInfo?.project?.tokenName}
            </span>
          </div>
        </Form>
      </ActionModal>
    </>
  );
};

export default MakeBidView;
