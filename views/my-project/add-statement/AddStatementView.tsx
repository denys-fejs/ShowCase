import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useHistory } from 'react-router';
import { useStoreActions, useStoreState } from 'easy-peasy';
import get from 'lodash.get';
import SectionHeader from 'views/common/headers/section-header/SectionHeader';
import AddStatementForm from './add-statement-form/AddStatementForm';
import { IStoreModel } from 'types/store/store';
import { IProjectDetailsResponseBody } from 'types/api/project';
import { IProjectStatement } from 'types/api/project-statement';
import { Routes } from 'constants/routes';
import { Breadcrumbs } from 'components';
import { IBreadcrums } from 'types/components/breadcrumbs';
import BasicSearchHeader from 'views/common/headers/basic-search-header/BasicSearchHeader';
import useAuthRole from 'hooks/useAuthRole';
import { UserRole } from 'constants/user';

const AddStatementView = () => {
  useAuthRole({ isAuthRequired: true, rolesRequired: [UserRole.Project] });

  const history = useHistory();
  const { state } = useLocation();
  const { t } = useTranslation('views/project');

  const userProject = useStoreState<IStoreModel, IProjectDetailsResponseBody | null>((store) => store.project.project);
  // TODO: find a way to get my-project here
  const projectId = userProject?.publicProjectId;
  if (!projectId) {
    history.push(Routes.myProject);
  }

  const createProjectStatement = useStoreActions<IStoreModel>((actions) => actions.project.addProjectStatement);
  const editProjectStatement = useStoreActions<IStoreModel>((actions) => actions.project.editProjectStatement);

  const statement = get(state, 'statement');

  const breadcrumbsItems: IBreadcrums[] = [
    {
      title: t('myProject'),
      route: Routes.myProject,
      key: 0,
    },
    {
      title: statement ? t('editStatement') : t('createStatement'),
      key: 1,
    },
  ];

  const handleSubmit = async (values: Omit<IProjectStatement, 'id'>) => {
    const statementBody = {
      title: values.title,
      category: values.category,
      url: values.url,
      date: new Date(values.date).toISOString(),
    };

    statement?.id
      ? await editProjectStatement({
          projectId: get(state, 'projectId'),
          statement: statementBody,
          statementId: statement.id,
        })
      : await createProjectStatement({ projectId, statement: statementBody });

    history.push(`${Routes.myProject}?tab=statements`);
  };

  return (
    <>
      <BasicSearchHeader />
      <Breadcrumbs items={breadcrumbsItems} />
      <SectionHeader>{statement ? t('editStatement') : t('createStatement')}</SectionHeader>
      <AddStatementForm statement={statement} handleSubmit={handleSubmit} />
    </>
  );
};

export default AddStatementView;
