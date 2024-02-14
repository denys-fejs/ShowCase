import { useContext, useEffect, useMemo } from 'react';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { useParams } from 'react-router';

import { IBreadcrums, IProjectDetailsResponseBody, IStoreModel, ProjectTypes } from 'types';
import { Breadcrumbs, MainLoader, ProjectHeaderMainDetails } from 'components';
import { Routes } from 'constants/routes';
import BasicSearchHeader from 'views/common/headers/basic-search-header/BasicSearchHeader';
import MainLayoutContext from 'views/common/layouts/main-layout/basic/BasicMainLayoutContext';
import ProjectDetailsTabsView from './project-details-tabs-view/ProjectDetailsTabsView';
import ProjectDetailsHeader from './project-details-header/ProjectDetailsHeaderView';
import { useTranslation } from 'react-i18next';

//styles
import styles from './ProjectDetailsView.module.scss';
import SocketView from '../common/socket/SocketView';
import { projectTypeBackgroundMap } from 'constants/index';

const ProjectDetailsView = () => {
  const { id } = useParams<{ id: string }>();
  const { setBackgroundImage } = useContext(MainLayoutContext);
  const { t } = useTranslation('views/projects');
  const project = useStoreState<IStoreModel, IProjectDetailsResponseBody | null>((store) => store.project.projectById);
  const isProjectLoading = useStoreState<IStoreModel, boolean>((store) => store.project.isProjectLoading);
  const loadProjectById = useStoreActions<IStoreModel>((actions) => actions.project.loadProjectById);
  const coverBg = project?.projectType
    ? projectTypeBackgroundMap[project?.projectType]
    : projectTypeBackgroundMap[ProjectTypes.EnergyDemand];

  const breadcrumbsItems: IBreadcrums[] = [
    {
      title: t('title'),
      route: Routes.projects,
      key: 0,
    },
    {
      title: project?.name,
      key: 1,
    },
  ];

  const channels = useMemo(() => {
    if (project?.id) {
      return [`project-${project.id}`];
    }
  }, [project]);

  useEffect(() => {
    setBackgroundImage && setBackgroundImage(coverBg);

    return () => {
      setBackgroundImage && setBackgroundImage('');
    };
  }, [coverBg, setBackgroundImage]);

  useEffect(() => loadProjectById(id), []);

  return (
    <SocketView channels={channels}>
      <BasicSearchHeader />
      <Breadcrumbs items={breadcrumbsItems} />
      <div>
        <MainLoader isLoading={isProjectLoading}>
          {project && (
            <>
              <ProjectDetailsHeader project={project} />
              <ProjectHeaderMainDetails project={project} />
            </>
          )}
          <div className={styles.tabsWrapper}>
            {project && <ProjectDetailsTabsView projectInfo={project} publicProjectId={project.id} />}
          </div>
        </MainLoader>
      </div>
    </SocketView>
  );
};

export default ProjectDetailsView;
