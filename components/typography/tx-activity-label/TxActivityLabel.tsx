import cn from 'classnames';
import { useTranslation } from 'react-i18next';

import { MethodSignatures } from 'constants/blockchain';
import { isTxMethod } from 'utils';

import styles from './TxActivityLabel.module.scss';

interface IProps {
  className?: string;
  messagePayload?: string;
  out?: boolean;
}

const TxActivityLabel = ({ className = '', messagePayload = '', out = true }: IProps) => {
  const { t } = useTranslation('common');

  const renderLabel = () => {
    if (isTxMethod(messagePayload, MethodSignatures.RegisterProject)) {
      return <div className={styles.registerProject}>{t('blockchain.txActivity.registerProject')}</div>;
    }

    if (isTxMethod(messagePayload, MethodSignatures.RegisterCompany)) {
      return <div className={styles.registerCompany}>{t('blockchain.txActivity.registerCompany')}</div>;
    }

    if (isTxMethod(messagePayload, MethodSignatures.MintToken)) {
      return <div className={styles.mintToken}>{t('blockchain.txActivity.mintToken')}</div>;
    }

    if (isTxMethod(messagePayload, MethodSignatures.Mint)) {
      return <div className={styles.mint}>{t('blockchain.txActivity.mint')}</div>;
    }

    if (isTxMethod(messagePayload, MethodSignatures.Burn)) {
      return <div className={styles.burn}>{t('blockchain.txActivity.burn')}</div>;
    }

    if (isTxMethod(messagePayload, MethodSignatures.TransferToken) && out) {
      return <div className={styles.sendToken}>{t('blockchain.txActivity.sendToken')}</div>;
    }

    if (isTxMethod(messagePayload, MethodSignatures.Deposit)) {
      return <div className={styles.deposit}>{t('blockchain.txActivity.deposit')}</div>;
    }

    if (isTxMethod(messagePayload, MethodSignatures.Withdraw)) {
      return <div className={styles.withdraw}>{t('blockchain.txActivity.withdraw')}</div>;
    }

    if (isTxMethod(messagePayload, MethodSignatures.Approve)) {
      return <div className={styles.approve}>{t('blockchain.txActivity.approve')}</div>;
    }

    if (isTxMethod(messagePayload, MethodSignatures.TransferBridge)) {
      return <div className={styles.withdraw}>{t('blockchain.txActivity.transferBridge')}</div>;
    }

    if (!out) {
      return <div className={styles.receive}>{t('blockchain.txActivity.receive')}</div>;
    }

    return <div className={styles.send}>{t('blockchain.txActivity.send')}</div>;
  };

  return <div className={cn(styles.container, className)}>{renderLabel()}</div>;
};

export default TxActivityLabel;
