import { DocumentType } from 'types/api/document';
import { IProjectDetailsResponseBody } from 'types/api/project';
import { ProjectHeaderMainDetails, ProjectTitle } from 'components';

import ProjectDetailsTabsView from 'views/project-details/project-details-tabs-view/ProjectDetailsTabsView';
import IssueTokenDetails from './issue-token-details/IssueTokenDetails';

import styles from './ProjectDetails.module.scss';
import HeaderActions from 'views/my-project/actions/header-actions/HeaderActions';

interface IPropsTypes {
  documentsToShow?: Array<DocumentType>;
  userProject: IProjectDetailsResponseBody;
}

const ProjectDetails = ({ documentsToShow, userProject }: IPropsTypes) => {
  const { issueTokensRequest, publicProjectId } = userProject;
  return (
    <>
      <ProjectTitle project={userProject} />
      <HeaderActions project={userProject} />
      {issueTokensRequest && <IssueTokenDetails issueToken={issueTokensRequest} />}
      <ProjectHeaderMainDetails project={userProject} />
      <div className={styles.tabsWrapper}>
        <ProjectDetailsTabsView
          publicProjectId={publicProjectId}
          projectInfo={userProject}
          documentTypes={documentsToShow}
          canEdit
        />
      </div>
    </>
  );
};

export default ProjectDetails;
