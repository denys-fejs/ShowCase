import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { NotificationTypes, VERIFICATION_MESSAGE_REFRESH_INTERVAL } from 'constants/index';
import { IStoreModel, IWalletState } from 'types';
import addressVerificationAPI from 'api/user/addressVerificationAPI';
import { useFetch } from 'hooks';
import { Notification, PrimaryButton, SectionTitle } from 'components';
import ConnectWalletView from 'views/common/actions/connect-wallet/ConnectWalletView';

import styles from './WalletVerificationView.module.scss';
import { isAddressesEqual } from 'utils';
import { Tooltip } from 'antd';

const WalletVerificationView = () => {
  const { t } = useTranslation('views/wallet-verification');
  const address = useStoreState<IStoreModel, string | undefined>((store) => store.user.profile?.accountAddress);
  const wallet = useStoreState<IStoreModel, IWalletState>((store) => store.blockchain.wallet);
  const verifyAddress = useStoreActions<IStoreModel>((store) => store.blockchain.wallet.verifyAddress);

  const { response, loading, retry } = useFetch(() => addressVerificationAPI.getVerificationMessage(), []);
  const token = loading ? 'Loading...' : response?.data[0]?.value;

  const [addressMatch, setAddressMatch] = useState(false);

  // Reload address verification message every 4 minutes
  useEffect(() => {
    const intervalId = setInterval(() => {
      retry();
    }, VERIFICATION_MESSAGE_REFRESH_INTERVAL);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    setAddressMatch(isAddressesEqual(address, wallet.walletAddress));
  }, [address, wallet.walletAddress]);

  const handleAddressVerification = async () => {
    await verifyAddress(response?.data);
    Notification({
      notificationType: NotificationTypes.Success,
      message: 'Success',
      description: t('successMessage'),
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.messageBox}>
        <SectionTitle
          subtitle={
            <div className={styles.description}>
              <p>{t('description')}</p>
              <p>{t('walletLabel', { address })}</p>
              <p>{t('tokenLabel', { token })}</p>
            </div>
          }
        >
          {t('title')}
        </SectionTitle>
        {wallet.isConnected ? (
          <Tooltip
            title={t('pleaseConnectRegisteredWallet')}
            overlayInnerStyle={addressMatch ? { display: 'none' } : undefined}
            placement='bottom'
          >
            <div>
              <PrimaryButton
                className={styles.button}
                onClick={handleAddressVerification}
                loading={loading}
                disabled={!addressMatch}
              >
                {t('verifyButton')}
              </PrimaryButton>
            </div>
          </Tooltip>
        ) : (
          <ConnectWalletView className={styles.button} size='large' shadow={true} />
        )}
      </div>
    </div>
  );
};

export default WalletVerificationView;
