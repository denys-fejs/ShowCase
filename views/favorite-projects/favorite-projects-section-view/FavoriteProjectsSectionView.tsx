import FavoriteProjectsSection from '../favorite-projects-section/FavoriteProjectsSection';
import { IPaginationResponse, IProjectsListResponseBody, sectionSizeMap, SectionTypes } from 'types';

import styles from './FavoriteProjectsSectionView.module.scss';

interface IProps {
  projects: IPaginationResponse<IProjectsListResponseBody>;
}

const FavoriteProjectsSectionView = ({ projects }: IProps) => {
  const cardsToDisplay = sectionSizeMap[SectionTypes.All];
  return (
    <div className={styles.projectSectionView}>
      <FavoriteProjectsSection projects={projects} cardsToDisplay={cardsToDisplay} />
    </div>
  );
};

export default FavoriteProjectsSectionView;
