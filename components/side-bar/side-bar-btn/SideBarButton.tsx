import { IconSvg } from 'components';

//styles
import styles from './SideBarButton.module.scss';

interface IPropsTypes {
  onClick: () => void;
  filterBy: string;
  setCurrentFilter: (_: string) => void;
  subTitle?: string;
}

const SideBarButton = ({ onClick, filterBy, setCurrentFilter, subTitle }: IPropsTypes) => {
  return (
    <div
      className={styles.filterBtnContainer}
      onClick={() => {
        setCurrentFilter(filterBy);
        onClick();
      }}
    >
      <div className={styles.titleContainer}>
        <span className={styles.title}>{filterBy}</span>
        <p>{subTitle}</p>
      </div>
      <IconSvg icon='arrowRight' />
    </div>
  );
};

export default SideBarButton;
