import { SyntheticEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import cn from 'classnames';
import { CheckOutlined } from '@ant-design/icons';
import useModal from 'hooks/useModal';
import { NotificationTypes } from 'constants/index';
import { ActionModal, CheckboxInput, Notification, PrimaryButton, SecondaryButton } from 'components';

import styles from './ApproveActionView.module.scss';

interface IProps {
  name?: string;
  onApprove: (checked?: boolean) => Promise<void>;
  checkboxText?: string;
  tableAction?: boolean;
  className?: string;
}

const ApproveActionView = ({ className, name, onApprove, checkboxText, tableAction = false }: IProps) => {
  const { t } = useTranslation(['views/admin', 'common']);
  const [checked, setChecked] = useState<boolean | undefined>();
  const { isOpen, open, close, loading, setLoading } = useModal();

  const stopPropagation = (event: SyntheticEvent) => {
    event.stopPropagation();
  };

  const handleConfirm = async () => {
    setLoading(true);
    await onApprove(checked);
    Notification({
      notificationType: NotificationTypes.Success,
      message: t('common:common.success'),
      description: t('actions.approve.success', { name }),
    });
    close();
  };

  return (
    <div onClick={stopPropagation}>
      {tableAction ? (
        <SecondaryButton onClick={open} className={cn(styles.button, styles.tableAction)}>
          {<CheckOutlined />}
        </SecondaryButton>
      ) : (
        <PrimaryButton onClick={open} className={cn(styles.button, className)}>
          {t('common:common.approve')}
        </PrimaryButton>
      )}
      <ActionModal
        isOpen={isOpen}
        close={close}
        loading={loading}
        onOk={handleConfirm}
        okText={t('common:common.approve')}
        title={t('actions.approve.title', { name })}
      >
        <p>{t('actions.approve.message', { name })}</p>
        {!!checkboxText && (
          <CheckboxInput
            name='checkbox'
            label={checkboxText}
            value={checked}
            onChange={setChecked}
            itemClassName={styles.item}
            className={styles.checkbox}
          />
        )}
      </ActionModal>
    </div>
  );
};

export default ApproveActionView;
