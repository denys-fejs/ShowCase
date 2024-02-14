import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { useStoreState } from 'easy-peasy';

import { IStoreModel } from 'types';
import { Routes } from 'constants/index';
import { SecondaryButton } from 'components';

import ConnectWalletView from '../connect-wallet/ConnectWalletView';
import AccountDropdownView from './account-dropdown/AccountDropdownView';

import styles from './AccountActionsView.module.scss';

interface IProps {
  hideSignIn?: boolean;
}

const AccountActionsView = ({ hideSignIn }: IProps) => {
  const { t } = useTranslation('views/common');
  const history = useHistory();
  const isAuthorized = useStoreState<IStoreModel>((store) => store.auth.isAuthorized);
  const isConnected = useStoreState<IStoreModel>((store) => store.blockchain.wallet.isConnected);

  return (
    <>
      {!isAuthorized && !hideSignIn && (
        <>
          <SecondaryButton className={styles.logInButton} onClick={() => history.push(Routes.signIn)}>
            {t('authorization.logIn')}
          </SecondaryButton>
          <SecondaryButton className={styles.signUpButton} onClick={() => history.push(Routes.signUp)}>
            {t('authorization.signUp')}
          </SecondaryButton>
        </>
      )}
      {!isConnected && <ConnectWalletView className={styles.button} />}
      {(isConnected || isAuthorized) && <AccountDropdownView className={styles.button} />}
    </>
  );
};

export default AccountActionsView;
