import { useState } from 'react';
import { useStoreActions } from 'easy-peasy';
import { useHistory } from 'react-router';
import ProjectMilestonesItem from './project-milestones-item';
import { IProjectMilestone } from '../../../types/api/project-milestones';
import ActionsList from '../../actions-list/ActionsList';
import ActionModal from '../../modal/action-modal/index';
import { useTranslation } from 'react-i18next';
import { Routes } from '../../../constants/routes';
import { IStoreModel } from '../../../types/store/store';
import useModal from '../../../hooks/useModal';
import styles from './ProjectMilestones.module.scss';

interface IProps {
  milestones: Array<IProjectMilestone & { id: number }>;
  projectId?: number;
  canEdit?: boolean;
}

const ProjectMilestones = ({ milestones, projectId, canEdit }: IProps) => {
  const { t } = useTranslation('common');
  const history = useHistory();
  const { isOpen, open, close, loading, setLoading } = useModal();

  const [title, setTitle] = useState('');
  const [milestoneId, setMilestoneId] = useState(null);

  const deleteProjectMilestone = useStoreActions<IStoreModel>((actions) => actions.project.deleteProjectMilestone);

  const editHandler = (milestone: Omit<IProjectMilestone, 'id'>) => {
    history.push({
      pathname: Routes.addProjectMilestone,
      state: { projectId, milestone },
    });
  };

  const deleteHandler = (item: any) => {
    setTitle(item.title);
    setMilestoneId(item.id);
    open();
  };

  const closeHandle = () => {
    setLoading(true);
    setTitle('');
    setMilestoneId(null);
    close();
  };

  const handleConfirm = async () => {
    await deleteProjectMilestone({ projectId, milestoneId });
  };

  return (
    <div className={styles.milestoneItemContainer}>
      {milestones.map((milestone: IProjectMilestone & { id: number }) => (
        <ActionsList
          editHandler={editHandler}
          deleteHandler={deleteHandler}
          key={milestone.id}
          item={milestone}
          canEdit={canEdit}
        >
          <ProjectMilestonesItem key={milestone.id} milestone={milestone} />
        </ActionsList>
      ))}
      <ActionModal
        isOpen={isOpen}
        close={closeHandle}
        loading={loading}
        onOk={handleConfirm}
        okText={t('actions.delete.button')}
        title={t('actions.delete.title')}
      >
        <p>{t('actions.delete.message', { title })}</p>
      </ActionModal>
    </div>
  );
};

export default ProjectMilestones;
