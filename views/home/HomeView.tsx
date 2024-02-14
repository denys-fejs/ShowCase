import { useTranslation } from 'react-i18next';
import BasicSearchHeader from 'views/common/headers/basic-search-header/BasicSearchHeader';
import { IPaginationResponse, IProjectsListResponseBody, IStoreModel, paramsMap, SectionTypes } from 'types';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { useEffect } from 'react';
import ProjectSectionView from 'views/projects/project-section-view/ProjectSectionView';

//styles
import styles from './HomeView.module.scss';
import projectsBanner from 'resources/images/bg/projectsBanner.png';

const HomeView = () => {
  const { t } = useTranslation(['views/home', 'views/projects']);
  const topProjectList = useStoreState<IStoreModel, IPaginationResponse<IProjectsListResponseBody> | null>(
    (store) => store.project.topProjectsList,
  );
  const topEmissionReductionsProjectList = useStoreState<
    IStoreModel,
    IPaginationResponse<IProjectsListResponseBody> | null
  >((store) => store.project.topEmissionReductionsProjectsList);
  const newProjectList = useStoreState<IStoreModel, IPaginationResponse<IProjectsListResponseBody> | null>(
    (store) => store.project.newProjectsList,
  );
  const loadTopProjectsList = useStoreActions<IStoreModel>((actions) => actions.project.loadTopProjectsList);
  const loadTopEmissionReductionsProjectsList = useStoreActions<IStoreModel>(
    (actions) => actions.project.loadTopEmissionReductionsProjectsList,
  );
  const loadNewProjectsList = useStoreActions<IStoreModel>((actions) => actions.project.loadNewProjectsList);

  useEffect(() => {
    loadTopProjectsList(paramsMap[SectionTypes.TopProjects]);
    loadTopEmissionReductionsProjectsList(paramsMap[SectionTypes.TopEmissionReductions]);
    loadNewProjectsList(paramsMap[SectionTypes.NewProjects]);
  }, [loadTopProjectsList, loadTopEmissionReductionsProjectsList, loadNewProjectsList]);

  return (
    <>
      <BasicSearchHeader onSearch={() => undefined} />
      <div className={styles.banner} style={{ backgroundImage: `url(${projectsBanner})` }}>
        <div className={styles.title}>{t(`views/projects:main.title`)}</div>
      </div>
      {topProjectList && (
        <ProjectSectionView
          type={SectionTypes.TopProjects}
          projects={topProjectList}
          showMoreStyle={styles.hideShowMoreButton}
        />
      )}
      {topEmissionReductionsProjectList && (
        <ProjectSectionView
          type={SectionTypes.TopEmissionReductions}
          projects={topEmissionReductionsProjectList}
          showMoreStyle={styles.hideShowMoreButton}
        />
      )}
      {newProjectList && (
        <ProjectSectionView
          type={SectionTypes.NewProjects}
          projects={newProjectList}
          showMoreStyle={styles.hideShowMoreButton}
        />
      )}
    </>
  );
};

export default HomeView;
