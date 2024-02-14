import cn from 'classnames';
import styles from './MainLogo.module.scss';

interface IProps {
  className?: string;
}

const MainLogo = ({ className }: IProps) => {
  return (
    <span className={cn(styles.logo, className)}>
      CARBON<span className={styles.highlighted}>COIN</span>
    </span>
  );
};

export default MainLogo;
