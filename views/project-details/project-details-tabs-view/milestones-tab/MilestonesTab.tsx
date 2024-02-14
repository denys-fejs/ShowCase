import { useCallback, useEffect, useState } from 'react';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';
import ProjectMilestones from 'components/blocks/project-milestones';
import AddButton from 'components/buttons/add-button/AddButton';
import { Routes } from 'constants/routes';
import { IPaginationResponse } from 'types/api/pagination';
import { IProjectMilestone } from 'types/api/project-milestones';
import { IStoreModel } from 'types/store/store';
import { TABS_ITEMS_PER_PAGE } from 'constants/index';
import { NoData, ShowMoreSectionButton } from 'components';

//styles
import styles from './MilestonesTab.module.scss';

interface IPropsTypes {
  projectId?: number;
  canEdit?: boolean;
}

const MilestonesTab = ({ projectId, canEdit }: IPropsTypes) => {
  const { t } = useTranslation('common');

  const history = useHistory();
  const [itemsToDisplay, setItemsToDisplay] = useState(TABS_ITEMS_PER_PAGE);

  const milestonesList = useStoreState<IStoreModel, IPaginationResponse<IProjectMilestone & { id: number }> | null>(
    (store) => store.project.projectMilestones,
  );

  const loadProjectMilestones = useStoreActions<IStoreModel>((actions) => actions.project.loadProjectMilestones);

  const handleAddMilestone = () => {
    history.push(Routes.addProjectMilestone);
  };
  const loadProjectMilestonesCallback = useCallback(() => {
    loadProjectMilestones({ projectId, limit: itemsToDisplay });
  }, [itemsToDisplay, projectId]);

  const showMore = () => {
    setItemsToDisplay((prevState: number) => prevState + 5);
  };
  const noItemsRender = () => {
    if (milestonesList?.items?.length === 0) {
      return <NoData title='Milestones' refresh={loadProjectMilestonesCallback} />;
    }
  };

  useEffect(() => {
    loadProjectMilestonesCallback();
  }, [itemsToDisplay, projectId]);

  return (
    milestonesList && (
      <>
        {canEdit && (
          <div className={styles.btnSection}>
            <AddButton onClick={handleAddMilestone} />
          </div>
        )}
        {noItemsRender()}
        <ProjectMilestones milestones={milestonesList?.items} projectId={projectId} canEdit={canEdit} />
        {milestonesList?.meta?.totalItems > itemsToDisplay && (
          <ShowMoreSectionButton onClick={showMore}>{t('Show more')}</ShowMoreSectionButton>
        )}
      </>
    )
  );
};

export default MilestonesTab;
