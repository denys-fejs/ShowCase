import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useHistory } from 'react-router';
import { useStoreActions, useStoreState } from 'easy-peasy';
import get from 'lodash.get';
import SectionHeader from 'views/common/headers/section-header/SectionHeader';
import { IStoreModel } from 'types/store/store';
import { IProjectDetailsResponseBody } from 'types/api/project';
import { Routes } from 'constants/routes';
import { Breadcrumbs } from 'components';
import { IBreadcrums } from 'types/components/breadcrumbs';
import BasicSearchHeader from 'views/common/headers/basic-search-header/BasicSearchHeader';
import { IProjectEventResponse } from 'types/api/project-events';
import AddEventsForm from './add-event-form/AddEventsForm';

const AddEventsView = () => {
  const history = useHistory();
  const { state } = useLocation();
  const { t } = useTranslation('views/project');

  const userProject = useStoreState<IStoreModel, IProjectDetailsResponseBody | null>((store) => store.project.project);
  const projectId = userProject?.publicProjectId;
  if (!projectId) {
    history.push(Routes.myProject);
  }

  const createProjectEvent = useStoreActions<IStoreModel>((actions) => actions.project.addProjectEvent);
  const editProjectEvent = useStoreActions<IStoreModel>((actions) => actions.project.editProjectEvent);

  const event = get(state, 'event');

  const handleSubmit = async (values: Omit<IProjectEventResponse, 'id'>) => {
    const eventBody = {
      title: values.title,
      url: values.url,
      description: values.description,
      startDate: new Date(values.startDate).toISOString(),
      endDate: new Date(values.endDate).toISOString(),
      city: values.city,
      province: values.province,
      streetAddress: values.streetAddress,
      postCode: values.postCode,
      country: values.country,
    };

    event?.id
      ? await editProjectEvent({
          projectId: get(state, 'projectId'),
          event: eventBody,
          eventId: event.id,
        })
      : await createProjectEvent({ projectId, event: eventBody });

    history.push(`${Routes.myProject}?tab=events`);
  };

  const breadcrumbsItems: IBreadcrums[] = [
    {
      title: t('myProject'),
      route: Routes.myProject,
      key: 0,
    },
    {
      title: event ? t('editEvent') : t('createEvent'),
      key: 1,
    },
  ];

  return (
    <>
      <BasicSearchHeader />
      <Breadcrumbs items={breadcrumbsItems} />
      <SectionHeader>{event ? t('editEvent') : t('createEvent')}</SectionHeader>
      <AddEventsForm event={event} handleSubmit={handleSubmit} />
    </>
  );
};

export default AddEventsView;
