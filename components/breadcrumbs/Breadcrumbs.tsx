import { Fragment } from 'react';
import { Breadcrumb } from 'antd';
import { IBreadcrums } from 'types';

//styles
import styles from './Breadcrumbs.module.scss';

interface IPropsTypes {
  items: Array<IBreadcrums>;
}
const Breadcrumbs = ({ items }: IPropsTypes) => {
  return (
    <div className={styles.breadcrumbsContainer}>
      <Breadcrumb className={styles.breadcrumbs} separator='>'>
        {items.map((item: IBreadcrums) => {
          const { title = '', key, route } = item;

          return (
            <Fragment key={title + key}>
              <Breadcrumb.Item className={route ? styles.route : ''} href={route}>
                {title}
              </Breadcrumb.Item>
            </Fragment>
          );
        })}
      </Breadcrumb>
    </div>
  );
};

export default Breadcrumbs;
