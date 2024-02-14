import { useContext, useEffect } from 'react';
import { useStoreState } from 'easy-peasy';

import { IStoreModel } from 'types/store/store';
import { MainLoader } from 'components';
import { IProjectDetailsResponseBody, ProjectTypes } from 'types/api/project';
import { DocumentType } from 'types/api/document';
import MainLayoutContext from 'views/common/layouts/main-layout/basic/BasicMainLayoutContext';
import ProjectDetails from '../ProjectDetails';
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

const ProjectDetailsView = () => {
  const userProject = useStoreState<IStoreModel, IProjectDetailsResponseBody | null>((store) => store.project.project);
  const isProjectLoading = useStoreState<IStoreModel, boolean>((store) => store.project.isProjectLoading);
  const coverBg = userProject?.projectType
    ? projectTypeBackgroundMap[userProject?.projectType]
    : projectTypeBackgroundMap[ProjectTypes.EnergyDemand];
  const { setBackgroundImage } = useContext(MainLayoutContext);
  useEffect(() => {
    setBackgroundImage && setBackgroundImage(coverBg);

    return () => {
      setBackgroundImage && setBackgroundImage('');
    };
  }, [coverBg, setBackgroundImage]);

  return (
    <>
      <MainLoader isLoading={isProjectLoading}>
        {userProject && <ProjectDetails documentsToShow={documentsToShow} userProject={userProject} />}
      </MainLoader>
    </>
  );
};

export default ProjectDetailsView;
