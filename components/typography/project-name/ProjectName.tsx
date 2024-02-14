import { ProjectAuditStatus, ProjectStatus } from 'constants/project';
import TooltipIcon from 'components/icons/tooltip-icon';
import { findStatusIcon } from 'utils/statusDetails';
import { useTranslation } from 'react-i18next';

interface IProps {
  name: string;
  status: ProjectStatus;
  auditStatus: ProjectAuditStatus;
}

const ProjectName = ({ name, status, auditStatus }: IProps) => {
  const statusDetails = findStatusIcon(status, auditStatus);
  if (statusDetails.icon === 'pending') {
    statusDetails.icon = 'greenPending';
  }
  const { t } = useTranslation('views/project');
  return (
    <>
      {name}
      {statusDetails.message && statusDetails.icon && (
        <TooltipIcon icon={statusDetails.icon} message={t(statusDetails.message)} />
      )}
    </>
  );
};

export default ProjectName;
