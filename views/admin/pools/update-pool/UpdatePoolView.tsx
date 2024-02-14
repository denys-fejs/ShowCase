import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { IBreadcrums, IPoolslistResponseBody, IPoolUpdateRequestBody, IStoreModel } from 'types';
import { adminPoolsAPI } from 'api/admin/adminPoolsAPI';
import { Breadcrumbs, Notification } from 'components';
import { NotificationTypes, Routes } from 'constants/index';
import BasicSearchHeader from 'views/common/headers/basic-search-header/BasicSearchHeader';
import CreatePoolForm from 'views/admin/pools/create-pool/create-pool-form/CreatePoolForm';

import styles from 'views/admin/pools/create-pool/CreatePoolView.module.scss';

const UpdatePoolView = () => {
  const { t } = useTranslation('views/pools');
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const poolDetails = useStoreState<IStoreModel, IPoolslistResponseBody | null>((store) => store.pool.poolDetails);
  const loadPoolDetails = useStoreActions<IStoreModel>((actions) => actions.pool.loadPoolDetails);
  useEffect(() => loadPoolDetails(id), []);

  const handleSubmit = async (values: IPoolUpdateRequestBody) => {
    const data = await adminPoolsAPI.updatePool(values, values.id);
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
      title: t('updatePool'),
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
        <CreatePoolForm handleSubmit={handleSubmit} poolDetails={poolDetails || {}} />
      </div>
    </div>
  );
};

export default UpdatePoolView;
