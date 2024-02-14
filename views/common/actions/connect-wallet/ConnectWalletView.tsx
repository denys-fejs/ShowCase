import { useTranslation } from 'react-i18next';
import { useStoreActions } from 'easy-peasy';
import cn from 'classnames';
import { SizeType } from 'antd/lib/config-provider/SizeContext';

import useModal from 'hooks/useModal';
import { ErrorTypes, NotificationTypes } from 'constants/index';
import { IStoreModel } from 'types';
import { Notification, PrimaryButton, IconSvg, ActionModal } from 'components';

//styles
import styles from './ConnectWalletView.module.scss';

interface IProps {
  className?: string;
  size?: SizeType;
  shadow?: boolean;
}

const ConnectWalletView = ({ className, size = 'middle', shadow = false }: IProps) => {
  const { t } = useTranslation(['views/common', 'common']);
  const { open, isOpen, close } = useModal();
  const connectWallet = useStoreActions<IStoreModel>((store) => store.blockchain.wallet.connect);

  const handleConnect = async () => {
    try {
      await connectWallet();
      Notification({
        notificationType: NotificationTypes.Success,
        message: t('common:common.success'),
        description: t('wallet.connected'),
      });
    } catch (error) {
      if (error.message === ErrorTypes.NoMetamask) {
        open();
      } else {
        Notification({
          notificationType: NotificationTypes.Error,
          message: t('common:errors.connect'),
          description: t(`common::errors.${error.message}`, error.message),
        });
      }
    }
  };

  const handleInstallMetamask = () => {
    window.open('https://metamask.io/download.html', '_blank');
  };

  return (
    <>
      <PrimaryButton className={cn(styles.button, className)} onClick={handleConnect} size={size} shadow={shadow}>
        {t('wallet.connect')}
      </PrimaryButton>
      <ActionModal
        isOpen={isOpen}
        onOk={handleInstallMetamask}
        close={close}
        okText={t('wallet.noMetamask.button')}
        centered
        className={styles.noMetamaskModal}
      >
        <>
          <div>
            <IconSvg icon='metamask' />
          </div>
          <div className={styles.title}>{t('wallet.noMetamask.title')}</div>
          <div>{t('wallet.noMetamask.message')}</div>
        </>
      </ActionModal>
    </>
  );
};

export default ConnectWalletView;
