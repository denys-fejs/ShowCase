import { useContext, useEffect } from 'react';
import { useParams } from 'react-router';
import { useStoreActions, useStoreState } from 'easy-peasy';

import { DocumentType, IIssueTokens, IStoreModel, ProjectTypes } from 'types';
import { ProjectHeaderMainDetails, ProjectTitle } from 'components';

import BasicSearchHeader from 'views/common/headers/basic-search-header/BasicSearchHeader';
import MainLayoutContext from 'views/common/layouts/main-layout/basic/BasicMainLayoutContext';
import OverviewTab from 'views/project-details/project-details-tabs-view/overview-tab/OverviewTab';

import IssueTokenDetails from './issue-token-details/IssueTokenDetails';
import { projectTypeBackgroundMap } from 'constants/index';

const documentsToShow = [
  DocumentType.VcsPipeline,
  DocumentType.VcsRegistration,
  DocumentType.VcsIssuance,
  DocumentType.VcsOther,
  DocumentType.CompanyLegal,
  DocumentType.FounderLegal,
  DocumentType.AuditCompanyLegal,
  DocumentType.Other,
];

const AdminTokenRequestView = () => {
  const { id } = useParams<{ id: string }>();
  const { setBackgroundImage } = useContext(MainLayoutContext);
  const issueToken = useStoreState<IStoreModel, IIssueTokens | null>(
    (store) => store.admin.tokensRequests.issueTokensRequest,
  );
  const loadIssueTokensRequest = useStoreActions<IStoreModel>(
    (actions) => actions.admin.tokensRequests.loadIssueTokensRequest,
  );

  useEffect(() => {
    loadIssueTokensRequest(id);
  }, [id]);

  const coverBg = issueToken?.project.projectType
    ? projectTypeBackgroundMap[issueToken?.project.projectType]
    : projectTypeBackgroundMap[ProjectTypes.EnergyDemand];

  useEffect(() => {
    setBackgroundImage && setBackgroundImage(coverBg);

    return () => {
      setBackgroundImage && setBackgroundImage('');
    };
  }, [coverBg, setBackgroundImage]);

  return (
    <>
      <BasicSearchHeader />
      {issueToken && (
        <>
          <ProjectTitle project={issueToken.project} />
          <IssueTokenDetails issueToken={issueToken} loadIssueTokensRequest={loadIssueTokensRequest} />
          <ProjectHeaderMainDetails project={issueToken.project} />
          <OverviewTab projectInfo={issueToken.project} documentTypes={documentsToShow} />
        </>
      )}
    </>
  );
};

export default AdminTokenRequestView;
