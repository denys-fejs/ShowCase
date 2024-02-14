import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useHistory } from 'react-router';
import { useStoreActions, useStoreState } from 'easy-peasy';
import get from 'lodash.get';
import SectionHeader from 'views/common/headers/section-header/SectionHeader';
import AddMilestoneForm from './add-milestone-form/AddMilestoneForm';
import { IStoreModel } from 'types/store/store';
import { IProjectDetailsResponseBody } from 'types/api/project';
import { IProjectMilestone } from 'types/api/project-milestones';
import { Routes } from 'constants/routes';
import { Breadcrumbs } from 'components';
import { IBreadcrums } from 'types/components/breadcrumbs';
import BasicSearchHeader from 'views/common/headers/basic-search-header/BasicSearchHeader';

const AddMilestoneView = () => {
  const history = useHistory();
  const { state } = useLocation();
  const { t } = useTranslation('views/project');

  const userProject = useStoreState<IStoreModel, IProjectDetailsResponseBody | null>((store) => store.project.project);
  // TODO: find a way to get my-project here
  const projectId = userProject?.publicProjectId;
  if (!projectId) {
    history.push(Routes.myProject);
  }

  const createProjectMilestone = useStoreActions<IStoreModel>((actions) => actions.project.addProjectMilestone);
  const editProjectMilestone = useStoreActions<IStoreModel>((actions) => actions.project.editProjectMilestone);

  const milestone = get(state, 'milestone');

  const handleSubmit = async (values: Omit<IProjectMilestone, 'id'>) => {
    const milestoneBody = {
      title: values.title,
      url: values.url,
      date: new Date(values.date).toISOString(),
      description: values.description,
    };

    milestone?.id
      ? await editProjectMilestone({
          projectId: get(state, 'projectId'),
          milestone: milestoneBody,
          milestoneId: milestone.id,
        })
      : await createProjectMilestone({ projectId, milestone: milestoneBody });

    history.push(`${Routes.myProject}?tab=milestones`);
  };

  const breadcrumbsItems: IBreadcrums[] = [
    {
      title: t('myProject'),
      route: Routes.myProject,
      key: 0,
    },
    {
      title: milestone ? t('editMilestone') : t('createMilestone'),
      key: 1,
    },
  ];

  return (
    <>
      <BasicSearchHeader />
      <Breadcrumbs items={breadcrumbsItems} />
      <SectionHeader>{milestone ? t('editMilestone') : t('createMilestone')}</SectionHeader>
      <AddMilestoneForm milestone={milestone} handleSubmit={handleSubmit} />
    </>
  );
};

export default AddMilestoneView;
