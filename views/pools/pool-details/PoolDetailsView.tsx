import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import BasicSearchHeader from '../../common/headers/basic-search-header/BasicSearchHeader';
import { IBreadcrums, IPoolslistResponseBody, IProjectDetailsResponseBody, IStoreModel } from 'types';
import { COUNTRIES_MAP, Routes, UserRole } from 'constants/index';
import { useTranslation } from 'react-i18next';
import { Breadcrumbs, MainLoader, SectionText, SectionTitle } from 'components';
import { useStoreActions, useStoreState } from 'easy-peasy';
import Flags from 'country-flag-icons/react/3x2';
import { GlobalOutlined } from '@ant-design/icons';
import styles from 'views/admin/pools/admin-pool-details/AdminPoolDetailsView.module.scss';
import ApplyToPoolView from 'views/pools/apply-to-pool/ApplyToPoolView';
import { useAuthRole } from 'hooks';

const PoolDetailsView = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation('views/pools');
  const poolDetails = useStoreState<IStoreModel, IPoolslistResponseBody | null>((store) => store.pool.poolDetails);
  const loadPoolDetails = useStoreActions<IStoreModel>((actions) => actions.pool.loadPoolDetails);
  const { userRole } = useAuthRole({ isRedirect: false });
  const isAuthorized = useStoreState<IStoreModel>((store) => store.auth.isAuthorized);
  const loadProject = useStoreActions<IStoreModel>((actions) => actions.project.loadProject);
  const userProject = useStoreState<IStoreModel, IProjectDetailsResponseBody | null>((store) => store.project.project);
  useEffect(() => {
    loadPoolDetails(id);
    isAuthorized && userRole === UserRole.Project && loadProject();
  }, []);
  const breadcrumbsItems: IBreadcrums[] = [
    {
      title: t('title'),
      route: Routes.pools,
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
        <SectionTitle>{poolDetails?.name}</SectionTitle>
        {userProject?.tokenAddr && userProject?.publicProjectId && poolDetails && (
          <ApplyToPoolView
            tokenAddr={userProject?.tokenAddr}
            publicProjectId={userProject?.publicProjectId}
            poolId={poolDetails.id}
          />
        )}
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

export default PoolDetailsView;
