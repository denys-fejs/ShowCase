import { ReactNode, useState } from 'react';
import { DeleteOutlined } from '@ant-design/icons';

//styles
import styles from './ActionsList.module.scss';
import { IconSvg } from '../index';

interface IPropsTypes {
  children: ReactNode;
  editHandler?: any;
  deleteHandler?: any;
  key: number;
  item: any;
  canEdit?: boolean;
}

const ActionsList = ({ children, editHandler, deleteHandler, item, canEdit }: IPropsTypes) => {
  const [isShow, setIsShow] = useState(false);
  const [style, setStyle] = useState({ display: 'none' });

  return (
    <div
      className={styles.cardContainer}
      onMouseEnter={() => {
        canEdit && setStyle({ display: 'block' });
      }}
      onMouseLeave={() => {
        setStyle({ display: 'none' });
        setIsShow(false);
      }}
    >
      {children}
      <div style={style} className={styles.dotsContainer}>
        <div onClick={() => setIsShow(!isShow)} className={styles.dots}></div>
      </div>
      {isShow && (
        <div style={isShow && style} className={styles.actions}>
          <div className={styles.actionItem} onClick={() => editHandler(item)}>
            Edit
            <IconSvg icon='edit' />
          </div>
          <div className={styles.actionItem} onClick={() => deleteHandler(item)}>
            Delete
            <DeleteOutlined />
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionsList;
