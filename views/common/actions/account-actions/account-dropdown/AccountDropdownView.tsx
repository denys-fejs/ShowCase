import { useEffect, useMemo } from 'react';
import { notification } from 'antd';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useStoreActions, useStoreState } from 'easy-peasy';

import appConfig from 'config/appConfig';
import { Routes } from 'constants/index';
import { ICardMenuItem, IStoreModel, IUserProfileResponseBody, IWalletState } from 'types';
import { formatWalletAddress, isAddressesEqual, isChainIdsEqual } from 'utils';
import {
  CardMenu,
  CopyButton,
  DropdownCard,
  IconSvg,
  OverlayDropdown,
  PrimaryButton,
  AlertNotification,
} from 'components';

//styles
import styles from './AccountDropdownView.module.scss';

interface IProps {
  className?: string;
}

const AccountDropdownView = ({ className }: IProps) => {
  const { t } = useTranslation('views/common');
  const history = useHistory();
  const isAuthorized = useStoreState<IStoreModel>((store) => store.auth.isAuthorized);
  const profile = useStoreState<IStoreModel, IUserProfileResponseBody | null>((store) => store.user.profile);
  const wallet = useStoreState<IStoreModel, IWalletState>((store) => store.blockchain.wallet);
  const walletChainId = wallet.chainId;

  const signOut = useStoreActions<IStoreModel>((actions) => actions.auth.signOut);
  const disconnectWallet = useStoreActions<IStoreModel>((actions) => actions.blockchain.wallet.disconnect);

  const accountAddress = profile ? profile.accountAddress : wallet.walletAddress;

  useEffect(() => {
    if (
      wallet.isConnected &&
      wallet.walletAddress &&
      profile?.accountAddress &&
      !isAddressesEqual(wallet.walletAddress, profile?.accountAddress)
    ) {
      AlertNotification({
        key: 'wrongWalletAddress',
        message: t('wallet.warnings.wrongAddress'),
        top: 80,
      });
    } else {
      notification.close('wrongWalletAddress');
    }
  }, [t, wallet.isConnected, wallet.walletAddress, profile?.accountAddress]);

  useEffect(() => {
    if (wallet.isConnected && !isChainIdsEqual(walletChainId, appConfig.chainId)) {
      AlertNotification({
        key: 'wrongChainId',
        message: t('wallet.warnings.wrongNetwork', { chainId: appConfig.chainId }),
        top: 80,
      });
    } else {
      notification.close('wrongChainId');
    }
  }, [t, wallet.isConnected, walletChainId]);

  const accountMenuItems = useMemo<Array<ICardMenuItem>>(() => {
    return [
      {
        icon: 'profile',
        title: t('profile.profile'),
        route: Routes.profile,
        hidden: !isAuthorized,
      },
      {
        icon: 'favourites',
        title: t('profile.favourites'),
        route: Routes.favoriteProjects,
      },
    ];
  }, [t, isAuthorized]);

  return (
    <OverlayDropdown
      className={className}
      icon='avatar'
      overlay={
        <DropdownCard>
          <div className={styles.cardHeader}>
            <div className={styles.avatar}>
              <IconSvg icon='avatar' />
            </div>
            {profile?.companyName && <div className={styles.companyName}>{profile?.companyName}</div>}
            {accountAddress && (
              <div className={styles.walletAddress}>
                <CopyButton textToCopy={accountAddress}>{formatWalletAddress(accountAddress)}</CopyButton>
              </div>
            )}
          </div>
          <CardMenu items={accountMenuItems} />
          <div className={styles.buttons}>
            {isAuthorized ? (
              <PrimaryButton className={styles.accountCardSignOut} onClick={signOut}>
                {t('authorization.signOut')}
              </PrimaryButton>
            ) : (
              <PrimaryButton className={styles.accountCardRegister} onClick={() => history.push(Routes.signUp)}>
                {t('authorization.register')}
              </PrimaryButton>
            )}
            {wallet.isConnected && (
              <PrimaryButton className={styles.accountCardDisconnect} onClick={disconnectWallet}>
                {t('wallet.disconnect')}
              </PrimaryButton>
            )}
          </div>
        </DropdownCard>
      }
    >
      <div className={styles.dropdownLabel}>{profile?.companyName || formatWalletAddress(accountAddress || '')}</div>
    </OverlayDropdown>
  );
};

export default AccountDropdownView;
