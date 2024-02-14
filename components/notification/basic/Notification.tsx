import { notification } from 'antd';
import { ArgsProps } from 'antd/lib/notification';
import { NotificationPlacement } from 'antd/es/notification';
import cn from 'classnames';

import { NotificationTypes } from 'constants/notificationTypes';

import styles from './Notification.module.scss';

interface INotificationProps extends ArgsProps {
  notificationType: NotificationTypes;
  className?: string;
  placement?: NotificationPlacement;
  autoClose?: boolean;
}

const Notification = ({
  notificationType,
  className,
  placement = 'bottomRight',
  autoClose = true,
  ...rest
}: INotificationProps) => {
  notification[notificationType]({
    ...rest,
    placement,
    className: cn(styles.notification, className),
    duration: autoClose ? 5 : null,
  });
};

export default Notification;
