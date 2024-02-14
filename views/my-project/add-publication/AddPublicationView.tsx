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
import AddPublicationForm from './add-publication-form/AddPublicationForm';

const AddPublicationView = () => {
  const history = useHistory();
  const { state } = useLocation();
  const { t } = useTranslation('views/project');

  const userProject = useStoreState<IStoreModel, IProjectDetailsResponseBody | null>((store) => store.project.project);
  // TODO: find a way to get my-project here
  const projectId = userProject?.publicProjectId;
  if (!projectId) {
    history.push(Routes.myProject);
  }

  const createProjectPublication = useStoreActions<IStoreModel>((actions) => actions.project.addProjectPublication);
  const editProjectPublication = useStoreActions<IStoreModel>((actions) => actions.project.editProjectPublication);

  const publication = get(state, 'publication');

  const breadcrumbsItems: IBreadcrums[] = [
    {
      title: t('myProject'),
      route: Routes.myProject,
      key: 0,
    },
    {
      title: publication ? t('editPublication') : t('createPublication'),
      key: 1,
    },
  ];

  const handleSubmit = async (values: any) => {
    const publicationBody = {
      title: values.title,
      description: values.description,
      sourceUrl: values.sourceUrl,
      coverImage: values.coverImage,
    };

    publication?.id
      ? await editProjectPublication({
          projectId: projectId,
          publication: publicationBody,
          publicationId: publication.id,
        })
      : await createProjectPublication({ projectId, publication: publicationBody });

    history.push(`${Routes.myProject}?tab=publications`);
  };

  return (
    <>
      <BasicSearchHeader />
      <Breadcrumbs items={breadcrumbsItems} />
      <SectionHeader>{publication ? t('editPublication') : t('createPublication')}</SectionHeader>
      <AddPublicationForm publication={publication} handleSubmit={handleSubmit} />
    </>
  );
};

export default AddPublicationView;
