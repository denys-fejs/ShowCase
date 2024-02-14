import { SyntheticEvent } from 'react';
import { useTranslation } from 'react-i18next';
import useModal from 'hooks/useModal';
import styles from './StartReviewActionView.module.scss';
import cn from 'classnames';
import { PrimaryButton, ActionModal } from 'components';
import { ButtonSize } from 'types';

interface IProps {
  name?: string;
  onStartReview: () => Promise<void>;
  tableAction?: boolean;
  className?: string;
}

const StartReviewActionView = ({ className, name, onStartReview, tableAction = false }: IProps) => {
  const { t } = useTranslation(['views/admin', 'common']);
  const { isOpen, open, close, loading, setLoading } = useModal();

  const stopPropagation = (event: SyntheticEvent) => {
    event.stopPropagation();
  };

  const handleConfirm = async () => {
    setLoading(true);
    await onStartReview();
    close();
  };

  return (
    <div onClick={stopPropagation}>
      {tableAction ? (
        <PrimaryButton onClick={open} size={ButtonSize.Small} className={cn(styles.button, styles.tableAction)}>
          {t('common:common.start')}
        </PrimaryButton>
      ) : (
        <PrimaryButton onClick={open} className={cn(styles.button, styles.tableAction, className)}>
          {t('actions.startReview.button')}
        </PrimaryButton>
      )}
      <ActionModal
        isOpen={isOpen}
        close={close}
        loading={loading}
        onOk={handleConfirm}
        okText={t('common:common.start')}
        title={t('actions.startReview.title', { name })}
      >
        <p>{t('actions.startReview.message', { name })}</p>
      </ActionModal>
    </div>
  );
};

export default StartReviewActionView;
