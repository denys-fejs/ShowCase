import { useEffect } from 'react';
import { useStoreActions, useStoreState } from 'easy-peasy';

import { IStoreModel } from 'types/store/store';
import BasicSearchHeader from 'views/common/headers/basic-search-header/BasicSearchHeader';
import { Breadcrumbs, MainLoader } from 'components';
import { IProjectDetailsResponseBody } from 'types/api/project';
import CreateProjectView from './../create-project/CreateProjectView';
import { ProjectStatus } from 'constants/project';
import { IBreadcrums } from 'types/components/breadcrumbs';
import { Routes } from 'constants/routes';
import useAuthRole from 'hooks/useAuthRole';
import { UserRole } from 'constants/user';

//styles
import styles from './../MyProjectView.module.scss';

const MyProjectView = () => {
  useAuthRole({ isAuthRequired: true, rolesRequired: [UserRole.Project] });

  const userProject = useStoreState<IStoreModel, IProjectDetailsResponseBody | null>((store) => store.project.project);
  const isProjectLoading = useStoreState<IStoreModel, boolean>((store) => store.project.isProjectLoading);
  const loadProject = useStoreActions<IStoreModel>((actions) => actions.project.loadProject);

  const breadcrumbsItems: IBreadcrums[] = [
    {
      title: 'My project',
      route: Routes.myProject,
      key: 0,
    },
    {
      title: 'Edit project',
      key: 1,
    },
  ];

  useEffect(loadProject, []);
  if (userProject && (userProject.status === ProjectStatus.Pending || userProject.status === ProjectStatus.InReview)) {
    window.location.href = `${window.location.protocol}//${window.location.host}${Routes.myProject}`;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <BasicSearchHeader />
      </div>
      <Breadcrumbs items={breadcrumbsItems} />
      <div className={styles.content}>
        <MainLoader isLoading={isProjectLoading}>
          <CreateProjectView editMode={true} />
        </MainLoader>
      </div>
    </div>
  );
};

export default MyProjectView;
