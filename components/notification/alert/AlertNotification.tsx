import { ReactNode } from 'react';
import { NotificationPlacement } from 'antd/es/notification';
import { WarningOutlined } from '@ant-design/icons';

import { NotificationTypes } from 'constants/notificationTypes';

import Notification from '../basic/Notification';

import styles from './AlertNotification.module.scss';

interface IAlertNotificationProps {
  key: string;
  message: ReactNode;
  top?: number;
  placement?: NotificationPlacement;
  okText?: string;
}

const AlertNotification = ({
  key,
  message,
  top,
  placement = 'topRight',
  okText = 'GOT IT',
}: IAlertNotificationProps) => {
  Notification({
    key,
    placement,
    top,
    notificationType: NotificationTypes.Warning,
    message: undefined,
    description: message,
    className: styles.alert,
    icon: <WarningOutlined className={styles.icon} />,
    closeIcon: <div className={styles.okButton}>{okText}</div>,
    autoClose: false,
  });
};

export default AlertNotification;
