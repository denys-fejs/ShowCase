import { useTranslation } from 'react-i18next';
import { useStoreActions, useStoreState } from 'easy-peasy';

import BasicSearchHeader from 'views/common/headers/basic-search-header/BasicSearchHeader';
import SectionHeader from 'views/common/headers/section-header/SectionHeader';
import ProjectSectionView from './project-section-view/ProjectSectionView';
import Filter from 'views/common/filter/Filter';
import FilterProvider from 'views/common/filter/FilterProvider';
import { sectionSizeMap, SectionTypes } from 'types/components/projectSections';

import { IStoreModel } from 'types/store/store';
import { IProjectsListResponseBody } from 'types/api/project';
import { IPaginationResponse } from 'types/api/pagination';
import { filterConfig } from './ProjectFilterConfig';
import { useCallback } from 'react';

const ProjectsView = () => {
  const { t } = useTranslation('views/projects');

  const projectsList = useStoreState<IStoreModel, IPaginationResponse<IProjectsListResponseBody> | null>(
    (store) => store.project.projectsList,
  );

  const loadProjectsList = useStoreActions<IStoreModel>((actions) => actions.project.loadProjectsList);

  const loadProjects = useCallback(
    (params) => {
      return loadProjectsList({
        limit: sectionSizeMap[SectionTypes.All],
        ...params,
      });
    },
    [loadProjectsList],
  );

  return (
    <FilterProvider fetchData={loadProjects}>
      <BasicSearchHeader onSearch={() => undefined} />
      <SectionHeader onSort={() => undefined}>{t('title')}</SectionHeader>
      <Filter filterConfig={filterConfig} withSideBar />

      {projectsList && <ProjectSectionView projects={projectsList} type={SectionTypes.All} />}
    </FilterProvider>
  );
};

export default ProjectsView;
