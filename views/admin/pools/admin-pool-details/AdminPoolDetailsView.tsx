import styles from 'views/admin/pools/admin-pool-details/AdminPoolDetailsView.module.scss';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { IBreadcrums, IPoolslistResponseBody, IStoreModel } from 'types';
import React, { useEffect } from 'react';
import { COUNTRIES_MAP, Routes } from 'constants/index';
import BasicSearchHeader from 'views/common/headers/basic-search-header/BasicSearchHeader';
import { Breadcrumbs, MainLoader, PrimaryButton, SectionText, SectionTitle } from 'components';
import { Link } from 'react-router-dom';
import Flags from 'country-flag-icons/react/3x2';
import { GlobalOutlined } from '@ant-design/icons';

const AdminPoolDetailsView = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation(['views/pools', 'common']);

  const poolDetails = useStoreState<IStoreModel, IPoolslistResponseBody | null>((store) => store.pool.poolDetails);
  const loadPoolDetails = useStoreActions<IStoreModel>((actions) => actions.pool.loadPoolDetails);
  useEffect(() => loadPoolDetails(id), []);
  const breadcrumbsItems: IBreadcrums[] = [
    {
      title: t('title'),
      route: Routes.adminPools,
      key: 0,
    },
    {
      title: poolDetails?.name,
      key: 1,
    },
  ];

  const renderCountryTag = (country: string) => {
    const Flag = country ? Flags[country] : GlobalOutlined;
    return (
      <div className={styles.projectCountry} key={country}>
        <Flag className={styles.flag} />
        <span>{t([`common:country.${country}`, country ? COUNTRIES_MAP[country] : ''])}</span>
      </div>
    );
  };

  return (
    <>
      <BasicSearchHeader />
      <Breadcrumbs items={breadcrumbsItems} />
      <MainLoader isLoading={!poolDetails}>
        <Link to={Routes.adminUpdatePool.replace(':id', `${id}`)}>
          <PrimaryButton className={styles.editButton}>{t('updatePool')}</PrimaryButton>
        </Link>
        <SectionTitle>{poolDetails?.name}</SectionTitle>
        <div className={styles.countries}>{poolDetails?.country.map((item) => renderCountryTag(item))}</div>
        <div className={styles.standards}>
          {poolDetails?.standard.map((standard) => (
            <span key={standard} className={styles.standardTag}>
              {standard}
            </span>
          ))}
        </div>
        <div className={styles.types}>
          {poolDetails?.type.map((type) => (
            <span key={type} className={styles.typesTag}>
              {type}
            </span>
          ))}
        </div>
        <SectionText>{poolDetails?.description}</SectionText>
      </MainLoader>
    </>
  );
};

export default AdminPoolDetailsView;
