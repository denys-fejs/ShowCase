import { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { useStoreActions, useStoreState } from 'easy-peasy';

import { NotificationTypes, ProjectStatus, projectTypeBackgroundMap } from 'constants/index';
import { DocumentType, IProjectDetailsResponseBody, IStoreModel, ProjectTypes, RowSpace } from 'types';
import { Col, Notification, ProjectHeaderMainDetails, ProjectTitle, Row } from 'components';

import BasicSearchHeader from 'views/common/headers/basic-search-header/BasicSearchHeader';
import MainLayoutContext from 'views/common/layouts/main-layout/basic/BasicMainLayoutContext';
import StartReviewActionView from '../actions/start-review/StartReviewActionView';
import ApproveActionView from '../actions/approve/ApproveActionView';
import RejectActionView from '../actions/reject/RejectActionView';
import OverviewTab from 'views/project-details/project-details-tabs-view/overview-tab/OverviewTab';

import styles from './AdminProjectDetailsView.module.scss';

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

const AdminProjectDetailsView = () => {
  const { t } = useTranslation('views/admin');
  const { id } = useParams<{ id: string }>();
  const { setSubFooter, setBackgroundImage } = useContext(MainLayoutContext);
  const project = useStoreState<IStoreModel, IProjectDetailsResponseBody | null>(
    (store) => store.admin.projects.project,
  );
  const loadProjectById = useStoreActions<IStoreModel>((actions) => actions.admin.projects.loadProjectById);
  const startProjectReview = useStoreActions<IStoreModel>((actions) => actions.admin.projects.startProjectReview);
  const approveProject = useStoreActions<IStoreModel>((actions) => actions.admin.projects.approveProject);
  const rejectProject = useStoreActions<IStoreModel>((actions) => actions.admin.projects.rejectProject);
  const hasActions = !!project && [ProjectStatus.Pending, ProjectStatus.InReview].includes(project.status);
  const coverBg = project?.projectType
    ? projectTypeBackgroundMap[project?.projectType]
    : projectTypeBackgroundMap[ProjectTypes.EnergyDemand];

  useEffect(() => {
    loadProjectById(id);
  }, [id]);

  useEffect(() => {
    if (hasActions && setSubFooter) {
      setSubFooter(<div className={styles.buttonsContainer}>{renderActions()}</div>);
    }

    return () => {
      setSubFooter && setSubFooter(null);
    };
  }, [project, hasActions, setSubFooter, t]);

  useEffect(() => {
    setBackgroundImage && setBackgroundImage(coverBg);

    return () => {
      setBackgroundImage && setBackgroundImage('');
    };
  }, [coverBg, setBackgroundImage]);

  const handleProjectStartReview = async (project: IProjectDetailsResponseBody) => {
    await startProjectReview(project.id);
    await loadProjectById(id);
  };

  const handleProjectApprove = async (project: IProjectDetailsResponseBody, isAuditApproved?: boolean) => {
    try {
      await approveProject({ project, isAuditApproved });
      await loadProjectById(id);
    } catch (error) {
      Notification({
        notificationType: NotificationTypes.Error,
        message: t('common:errors.connect'),
        description: t(`common:errors.${error.message}`, error.message),
      });
    }
  };

  const handleProjectReject = async (project: IProjectDetailsResponseBody, reason?: string) => {
    await rejectProject({ id: project.id, reason });
    await loadProjectById(id);
  };

  const renderActions = () => {
    switch (project?.status) {
      case ProjectStatus.Pending:
        return (
          <>
            <StartReviewActionView
              name={t('projects.project', { name: project.name })}
              onStartReview={() => handleProjectStartReview(project)}
            />
          </>
        );
      case ProjectStatus.InReview:
        return (
          <>
            <Row horizontalSpace={RowSpace.Small} wrap={false}>
              <Col flexible>
                <ApproveActionView
                  name={t('projects.project', { name: project.name })}
                  onApprove={(checked?: boolean) => handleProjectApprove(project, checked)}
                  checkboxText={t('projects.auditApproved')}
                />
              </Col>
              <Col flexible>
                <RejectActionView
                  name={t('projects.project', { name: project.name })}
                  onReject={(reason: string) => handleProjectReject(project, reason)}
                />
              </Col>
            </Row>
          </>
        );
      default:
        return '';
    }
  };

  return (
    <>
      <BasicSearchHeader />
      {project && (
        <>
          <ProjectTitle project={project} />
          <ProjectHeaderMainDetails project={project} />
          <OverviewTab projectInfo={project} documentTypes={documentsToShow} />
        </>
      )}
    </>
  );
};

export default AdminProjectDetailsView;
