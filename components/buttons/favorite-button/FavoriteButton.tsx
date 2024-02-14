import { IconButton, IconSvg } from 'components';
import { memo } from 'react';
import { ButtonSize } from 'types';
import cn from 'classnames';
import styles from './FavoriteButton.module.scss';

interface IProps {
  size?: ButtonSize;
  onClick?: (event?: any) => void;
  loading?: boolean;
  isActive?: boolean;
}

const FavoriteButton = ({ onClick, isActive = false, size = ButtonSize.Small, loading = false }: IProps) => {
  return (
    <IconButton onClick={onClick} size={size} loading={loading} className={cn(styles.favoriteButton, styles[size])}>
      <IconSvg icon={isActive ? 'starFilled' : 'star'} />
    </IconButton>
  );
};

export default memo(FavoriteButton);
