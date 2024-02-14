import { useTranslation } from 'react-i18next';
import appConfig from 'config/appConfig';

//styles
import styles from './TokenNamePrice.module.scss';
import { formatWalletAddress } from 'utils';
import { AddTokenButton, CopyButton } from 'components';

interface IPropsTypes {
  tokenName: string | null;
  tokenPrice: number | null;
  tokenTicker: string | null;
  tokenAddr: string | null;
  addNewTokenHanler: () => void;
}

const TokenNamePrice = ({ tokenName, tokenTicker, tokenAddr, addNewTokenHanler }: IPropsTypes) => {
  const { t } = useTranslation(['views/project', 'common']);

  return (
    <div className={styles.container}>
      <div className={styles.leftSide}>
        <span className={styles.title}>{t('tokenInfo.tokenName')}</span>
        <div className={styles.subTitleWrapper}>
          <a
            href={`${appConfig.explorerUrl}/account/${tokenAddr}`}
            target='_blank'
            rel='noreferrer'
            className={styles.subTitle}
          >
            {tokenName ? tokenName : '-'}
          </a>
          <span className={styles.tokenAbbreviation}>{tokenTicker ? tokenTicker : '-'}</span>
        </div>
      </div>
      <div className={styles.actionsBox}>
        <div className={styles.rightSide}>
          <span className={styles.title}>{t('tokenInfo.tokenAddr')}</span>
          <span className={styles.subTitlePrice}>
            {tokenAddr && (
              <CopyButton textToCopy={tokenAddr} className={styles.subtitleAddress}>
                {formatWalletAddress(tokenAddr)}
              </CopyButton>
            )}
          </span>
        </div>
        <div className={styles.rightSide}>
          <span className={styles.subTitlePrice}>{tokenAddr && <AddTokenButton onClick={addNewTokenHanler} />}</span>
        </div>
      </div>
    </div>
  );
};

export default TokenNamePrice;
