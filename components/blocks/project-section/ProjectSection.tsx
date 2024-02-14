import { ReactNode, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import cn from 'classnames';
import { IPaginationResponse, IProjectsListResponseBody, paramsMap, RowSpace, SectionTypes } from 'types';
import { Routes } from 'constants/routes';
import { Col, Divider, MoreButton, ProjectCard, Row, ShowMoreSectionButton } from 'components';
import SortingSelectView from 'views/common/headers/sorting-select-view/SortingSelectView';
import TopProjectsSectionView from 'views/projects/top-projects-section/TopProjectsSectionView';
// TODO: Refactor to avoid dependency on views
import FilterContext from 'views/common/filter/FilterContext';

import styles from './ProjectSection.module.scss';

interface IProps {
  type?: string;
  projects: IPaginationResponse<IProjectsListResponseBody>;
  children?: ReactNode;
  cardsToDisplay: number;
  isSort?: boolean;
  showMoreStyle?: string;
  onFavoriteClick?: (id: number, name: string, isFavorite?: boolean) => Promise<boolean>;
}

const ProjectSection = ({ type, projects, cardsToDisplay, isSort, showMoreStyle = '', onFavoriteClick }: IProps) => {
  const { t } = useTranslation(['views/common', 'views/projects']);
  const { setParams } = useContext(FilterContext);
  const showMore = () => {
    if (totalItems <= itemsToDisplay) {
      return;
    }
    setParams({ limit: itemsToDisplay + cardsToDisplay });
  };

  const {
    items: projectsList,
    meta: { totalItems: totalItems },
  } = projects;

  const itemsToDisplay = projects.meta.itemCount;

  return (
    <>
      <div className={styles.projectSectionContainer}>
        {type && (
          <div className={styles.projectSectionHeader}>
            <h5
              className={cn(styles.projectSectionTitle, {
                [styles.whiteSectionTitle]: type === SectionTypes.MyPurchases,
              })}
            >
              {t(type)}
            </h5>
            {paramsMap[type] && paramsMap[type].sortBy && (
              <Link to={`${Routes.projects}?sortBy=${paramsMap[type].sortBy}`}>
                <MoreButton>{t('More')}</MoreButton>
              </Link>
            )}
            {isSort && (
              <div className={styles.sortingContainer}>
                <span className={styles.sortingLabel}>{t('header.sortBy')}</span>
                <SortingSelectView />
              </div>
            )}
          </div>
        )}
        <Divider color={'lightGrey'} />
        {type === SectionTypes.TopProjects ? (
          <TopProjectsSectionView projects={projectsList} />
        ) : (
          <div className={styles.projectsList}>
            <Row verticalSpace={RowSpace.Middle} horizontalSpace={RowSpace.Middle}>
              {projectsList.length > 0 ? (
                projectsList.slice(0, itemsToDisplay).map((project) => (
                  <Col key={project.id} xxl={4} xl={6} lg={8} md={12}>
                    <Link to={Routes.projectDetails.replace(':id', `${project.id}`)}>
                      <ProjectCard project={project} onFavoriteClick={onFavoriteClick} />
                    </Link>
                  </Col>
                ))
              ) : (
                <div className={styles.noProjectsPlaceholder}>
                  <h3>{t('views/projects:common.noProjectsFound')}</h3>
                  <p>{t('views/projects:common.comeBackSoon')}</p>
                </div>
              )}
            </Row>
          </div>
        )}
      </div>
      {totalItems > itemsToDisplay && itemsToDisplay > 0 && (
        <ShowMoreSectionButton className={showMoreStyle} onClick={showMore}>
          {t('Show more')}
        </ShowMoreSectionButton>
      )}
    </>
  );
};

export default ProjectSection;
