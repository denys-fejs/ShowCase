import { useTranslation } from 'react-i18next';

import { IProjectDetailsResponseBody } from 'types/api/project';
import { DocumentType } from 'types/api/document';
import { MainTabs } from 'components';
import EventsTab from './events-tab/EventsTab';
import MilestonesTab from './milestones-tab/MilestonesTab';
import OverviewTab from './overview-tab/OverviewTab';
import PublicationsTab from './publications-tab/PublicationsTab';
import StatementsTab from './statements-tab/StatementsTab';

interface IPropsTypes {
  publicProjectId?: number;
  projectInfo: IProjectDetailsResponseBody;
  documentTypes?: Array<DocumentType>;
  canEdit?: boolean;
}

const ProjectDetailsTabsView = ({ projectInfo, publicProjectId, documentTypes, canEdit = false }: IPropsTypes) => {
  const { t } = useTranslation('views/project');
  const hasPublic = !!publicProjectId;

  return (
    <MainTabs
      queryParam='tab'
      items={[
        {
          key: 'overview',
          title: t('projectDetails.tabs.overview'),
          content: <OverviewTab projectInfo={projectInfo} documentTypes={documentTypes} />,
          isShow: true,
        },
        {
          key: 'publications',
          title: t('projectDetails.tabs.publications'),
          content: <PublicationsTab projectId={publicProjectId} canEdit={canEdit} />,
          isShow: hasPublic,
        },
        {
          key: 'events',
          title: t('projectDetails.tabs.events'),
          content: <EventsTab projectId={publicProjectId} canEdit={canEdit} />,
          isShow: hasPublic,
        },
        {
          key: 'statements',
          title: t('projectDetails.tabs.statements'),
          content: <StatementsTab projectId={publicProjectId} canEdit={canEdit} />,
          isShow: hasPublic,
        },
        {
          key: 'milestones',
          title: t('projectDetails.tabs.milestones'),
          content: <MilestonesTab projectId={publicProjectId} canEdit={canEdit} />,
          isShow: hasPublic,
        },
      ]}
    />
  );
};

export default ProjectDetailsTabsView;
