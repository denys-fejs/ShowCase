import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useStoreState } from 'easy-peasy';

import { Provider } from 'blockchain';
import { IMainLayoutMenuLink, IStoreModel, IWalletState } from 'types';
import { Routes, UserRole } from 'constants/index';
import useFetch from 'hooks/useFetch';
import { LabelPrimary, PrimaryButton } from 'components';

import BasicMainLayoutView from '../basic/BasicMainLayoutView';

interface IProps {
  children?: ReactNode;
}

const menuLinks: Array<IMainLayoutMenuLink> = [
  {
    key: 'admin',
    icon: 'dashboard',
    name: 'admin',
    path: Routes.admin,
    roles: [UserRole.Admin],
  },
  {
    key: '1',
    icon: 'projects',
    name: 'projects',
    path: Routes.projects,
  },
  {
    key: '2',
    icon: 'portfolio',
    name: 'portfolio',
    path: Routes.portfolio,
    isWalletRequired: true,
  },
  {
    key: '3',
    icon: 'wallet',
    name: 'transactions',
    path: Routes.transactions,
    isWalletRequired: true,
  },
  {
    key: '4',
    icon: 'project',
    name: 'myProject',
    path: Routes.myProject,
    roles: [UserRole.Project],
  },
  {
    key: '5',
    icon: 'company',
    name: 'myCompany',
    path: Routes.myCompany,
    roles: [UserRole.Company],
  },
  {
    key: '6',
    icon: 'auction',
    name: 'myAuctions',
    path: Routes.myAuctions,
    isWalletRequired: true,
  },
  {
    key: '7',
    icon: 'burned',
    name: 'burned',
    path: Routes.burned,
    roles: [UserRole.Company],
  },
  {
    key: '8',
    icon: 'link',
    name: 'pools',
    path: Routes.pools,
  },
];

const UserMainLayoutView = ({ children }: IProps) => {
  const { t } = useTranslation(['views/common', 'common']);

  const wallet = useStoreState<IStoreModel, IWalletState>((store) => store.blockchain.wallet);

  const { response: balance } = useFetch(async () => {
    return wallet.walletAddress ? await Provider.getBalance(wallet.walletAddress) : null;
  }, [wallet.walletAddress]);

  return (
    <BasicMainLayoutView
      menuLinks={menuLinks}
      sidebarActions={
        <>
          {
            <LabelPrimary>
              {balance ? (+balance).toFixed(2) : '0.00'} {t('common:blockchain.unit')}
            </LabelPrimary>
          }
          <PrimaryButton shadow={false}>{t('navBar.buyBtn')}</PrimaryButton>
        </>
      }
    >
      {children}
    </BasicMainLayoutView>
  );
};

export default UserMainLayoutView;
