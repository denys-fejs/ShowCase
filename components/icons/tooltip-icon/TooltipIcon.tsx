import IconSvg from '../IconSvg';
import { Tooltip } from 'antd';
import { Icons } from 'types/components/icons';
import styles from './TooltipIcon.module.scss';

interface IProps {
  icon: Icons;
  message: string;
}
const TooltipIcon = ({ icon, message }: IProps) => {
  return (
    <>
      <Tooltip placement='bottom' title={message}>
        <span className={styles.icon}>
          <IconSvg icon={icon} />
        </span>
      </Tooltip>
    </>
  );
};

export default TooltipIcon;
