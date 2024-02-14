import { useStoreActions, useStoreState } from 'easy-peasy';
import { useTranslation } from 'react-i18next';
import { IPaginationResponse, IProjectsListResponseBody, IStoreModel } from 'types';
import FilterProvider from 'views/common/filter/FilterProvider';
import BasicSearchHeader from 'views/common/headers/basic-search-header/BasicSearchHeader';
import SectionHeader from 'views/common/headers/section-header/SectionHeader';

import FavoriteProjectSectionView from './favorite-projects-section-view/FavoriteProjectsSectionView';

// styles
import styles from './FavoriteProjectsView.module.scss';

const FavoriteProjectsView = () => {
  const { t } = useTranslation('views/favorite-projects');

  const favoriteProjectsList = useStoreState<IStoreModel, IPaginationResponse<IProjectsListResponseBody> | null>(
    (store) => store.project.favoriteProjectsList,
  );

  const loadFavoriteProjectsList = useStoreActions<IStoreModel>((actions) => actions.project.loadFavoriteProjectsList);

  return (
    <FilterProvider fetchData={loadFavoriteProjectsList}>
      <div className={styles.gradient} />
      <BasicSearchHeader />
      <SectionHeader>{t('title')}</SectionHeader>

      {favoriteProjectsList && <FavoriteProjectSectionView projects={favoriteProjectsList} />}
    </FilterProvider>
  );
};

export default FavoriteProjectsView;
