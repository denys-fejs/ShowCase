import { useStoreState } from 'easy-peasy';

import { TokenContract } from 'blockchain';
import useFetch from 'hooks/useFetch';
import { IStoreModel, IWalletState } from 'types';

import styles from './ProjectBalanceView.module.scss';

interface IProps {
  tokenAddr: string;
  tokenTicker?: string | null;
}

const ProjectBalanceView = ({ tokenAddr, tokenTicker = 't CO2' }: IProps) => {
  const wallet = useStoreState<IStoreModel, IWalletState>((store) => store.blockchain.wallet);

  const { response: tokenBalance } = useFetch(async () => {
    if (!wallet.walletAddress) {
      return null;
    }
    const contract = new TokenContract(tokenAddr);
    return contract.balanceOf(wallet.walletAddress);
  }, [wallet.walletAddress, tokenAddr]);

  return (
    <div className={styles.tokenBalance}>
      {tokenBalance ? (+tokenBalance).toFixed(2) : '0.00'} <span className={styles.tokenTicker}>{tokenTicker}</span>
    </div>
  );
};

export default ProjectBalanceView;
