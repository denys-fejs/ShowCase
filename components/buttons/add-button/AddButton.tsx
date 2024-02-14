import { PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

import styles from './AddButton.module.scss';

interface IAddButtonProps {
  onClick?: () => void;
}

const AddButton = ({ onClick }: IAddButtonProps) => {
  const { t } = useTranslation('common');

  return (
    <div className={styles.addBtn} onClick={onClick}>
      <PlusOutlined className={styles.addBtnPlus} />
      <div className={styles.text}>{t('input.add')}</div>
    </div>
  );
};
export default AddButton;
