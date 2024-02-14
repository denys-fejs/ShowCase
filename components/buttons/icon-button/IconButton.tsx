import { memo, ReactNode } from 'react';
import { Button } from 'antd';
import cn from 'classnames';
import { ButtonSize } from 'types/components/buttons';
import styles from './IconButton.module.scss';

interface IProps {
  children?: ReactNode;
  onClick?: () => void;
  className?: string;
  size?: ButtonSize;
  loading?: boolean;
}

const IconButton = ({ children, onClick, className = '', size = ButtonSize.Middle, loading = false }: IProps) => {
  return <Button className={cn(className, styles.button, size)} onClick={onClick} loading={loading} icon={children} />;
};

export default memo(IconButton);
