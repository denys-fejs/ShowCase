import BasicSearchHeader from 'views/common/headers/basic-search-header/BasicSearchHeader';
import { IBreadcrums, IPoolForm } from 'types';
import { NotificationTypes, Routes } from 'constants/index';
import { useTranslation } from 'react-i18next';
import { Breadcrumbs, Notification } from 'components';
import CreatePoolForm from 'views/admin/pools/create-pool/create-pool-form/CreatePoolForm';
import { useHistory } from 'react-router';
import { adminPoolsAPI } from 'api/admin/adminPoolsAPI';

import styles from 'views/admin/pools/create-pool/CreatePoolView.module.scss';

const CreatePoolView = () => {
  const { t } = useTranslation('views/pools');
  const history = useHistory();

  const handleSubmit = async (values: IPoolForm) => {
    //first we should create token address on blockchain
    const tokenAddr = '0xf981CFC11136e79b8E8647b917d29F9ea692021d';
    const data = await adminPoolsAPI.createPool({ ...values, tokenAddr: tokenAddr });
    Notification({
      notificationType: NotificationTypes.Success,
      message: 'Success',
      description: t('poolSaved'),
    });
    history.push(`${Routes.adminPoolDetails.replace(':id', `${data.id}`)}`);
  };

  const breadcrumbsItems: IBreadcrums[] = [
    {
      title: t('title'),
      route: Routes.adminPools,
      key: 0,
    },
    {
      title: t('createPool'),
      key: 1,
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <BasicSearchHeader />
      </div>
      <Breadcrumbs items={breadcrumbsItems} />
      <div className={styles.content}>
        <CreatePoolForm handleSubmit={handleSubmit} poolDetails={{}} />
      </div>
    </div>
  );
};

export default CreatePoolView;
