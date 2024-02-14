import styles from './DetailsItem.module.scss';

interface IProps {
  title: string;
  value: string | number;
}
const DetailsItem = ({ title, value }: IProps) => {
  return (
    <>
      <span className={styles.title}>{title}</span>
      <span className={styles.value}>{value}</span>
    </>
  );
};

export default DetailsItem;
