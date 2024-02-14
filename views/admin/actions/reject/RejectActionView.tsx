import { SyntheticEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import cn from 'classnames';
import { CloseOutlined } from '@ant-design/icons';
import useModal from 'hooks/useModal';
import { NotificationTypes } from 'constants/index';
import { ActionModal, DangerButton, Notification, TextAreaInput } from 'components';

import styles from './RejectActionView.module.scss';

interface IProps {
  name?: string;
  onReject: (reason: string) => Promise<void>;
  tableAction?: boolean;
  className?: string;
}

const RejectActionView = ({ className, name, onReject, tableAction = false }: IProps) => {
  const { t } = useTranslation(['views/admin', 'common']);
  const [reason, setReason] = useState<string | undefined>();
  const { isOpen, open, close, loading, setLoading } = useModal();

  const stopPropagation = (event: SyntheticEvent) => {
    event.stopPropagation();
  };

  const handleConfirm = async () => {
    if (!reason) {
      Notification({
        notificationType: NotificationTypes.Error,
        message: t('common:errors.title'),
        description: t('actions.reject.message', { name }),
      });
      return;
    }
    setLoading(true);
    await onReject(reason);
    Notification({
      notificationType: NotificationTypes.Success,
      message: t('common:common.success'),
      description: t('actions.reject.success', { name }),
    });
    close();
  };

  return (
    <div onClick={stopPropagation}>
      <DangerButton onClick={open} className={cn(styles.button, className, { [styles.tableAction]: tableAction })}>
        {tableAction ? <CloseOutlined /> : t('common:common.reject')}
      </DangerButton>
      <ActionModal
        isOpen={isOpen}
        close={close}
        loading={loading}
        onOk={handleConfirm}
        okText={t('common:common.reject')}
        title={t('actions.reject.title', { name })}
      >
        <p>{t('actions.reject.message', { name })}</p>
        <TextAreaInput
          name='rejectReason'
          value={reason}
          onChange={setReason}
          placeholder={t('actions.reject.comments')}
          autoSize={{ minRows: 3, maxRows: 6 }}
          required={true}
        />
      </ActionModal>
    </div>
  );
};

export default RejectActionView;
