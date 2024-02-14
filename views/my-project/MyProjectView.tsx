import { useEffect } from 'react';
import { useStoreActions, useStoreState } from 'easy-peasy';

import { IStoreModel } from 'types/store/store';
import BasicSearchHeader from 'views/common/headers/basic-search-header/BasicSearchHeader';
import { MainLoader } from 'components';
import { IProjectDetailsResponseBody } from 'types/api/project';
import { ProjectStatus } from 'constants/project';

import NoProjectView from './no-project/NoProjectView';
import CreateProjectView from './create-project/CreateProjectView';
import ProjectDetailsView from './project-details/project-details-view/ProjectDetailsView';
import useAuthRole from 'hooks/useAuthRole';
import { UserRole } from 'constants/user';

//styles
import styles from './MyProjectView.module.scss';

const MyProjectView = () => {
  useAuthRole({ isAuthRequired: true, rolesRequired: [UserRole.Project] });

  const userProject = useStoreState<IStoreModel, IProjectDetailsResponseBody | null>((store) => store.project.project);
  const isProjectLoading = useStoreState<IStoreModel, boolean>((store) => store.project.isProjectLoading);

  const loadProject = useStoreActions<IStoreModel>((actions) => actions.project.loadProject);

  useEffect(loadProject, []);

  const renderContent = () => {
    switch (userProject?.status) {
      case ProjectStatus.Created:
        return <NoProjectView />;

      case ProjectStatus.Edited:
        return <CreateProjectView />;

      default:
        return <ProjectDetailsView />;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <BasicSearchHeader />
      </div>
      <div className={styles.content}>
        <MainLoader isLoading={isProjectLoading}>{renderContent()}</MainLoader>
      </div>
    </div>
  );
};

export default MyProjectView;
