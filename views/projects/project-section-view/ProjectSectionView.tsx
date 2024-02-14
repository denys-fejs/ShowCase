import { useCallback } from 'react';
import { useStoreActions } from 'easy-peasy';

import { ProjectSection } from 'components';
import { IPaginationResponse, IProjectsListResponseBody, IStoreModel, sectionSizeMap, SectionTypes } from 'types';

import styles from './ProjectSectionView.module.scss';

interface IProps {
  projects: IPaginationResponse<IProjectsListResponseBody>;
  type?: SectionTypes;
  isSort?: boolean;
  showMoreStyle?: string;
}

const ProjectSectionView = ({ projects, type = SectionTypes.MyPurchases, isSort, showMoreStyle = '' }: IProps) => {
  const cardsToDisplay = sectionSizeMap[type] || sectionSizeMap[SectionTypes.MyPurchases];

  const addToFavorites = useStoreActions<IStoreModel>((actions) => actions.project.addToFavorites);
  const removeFromFavorites = useStoreActions<IStoreModel>((actions) => actions.project.removeFromFavorites);

  const onFavoriteClick = useCallback(
    async (id: number, title: string, isFavorite?: boolean): Promise<boolean> => {
      if (isFavorite) {
        await removeFromFavorites(id);
      } else {
        await addToFavorites(id);
      }

      return true;
    },
    [projects, removeFromFavorites, addToFavorites],
  );

  return (
    <div className={styles.projectSectionView}>
      <ProjectSection
        type={type}
        projects={projects}
        cardsToDisplay={cardsToDisplay}
        isSort={isSort}
        showMoreStyle={showMoreStyle}
        onFavoriteClick={onFavoriteClick}
      />
    </div>
  );
};

export default ProjectSectionView;
