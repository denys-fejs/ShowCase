import { IProjectMilestone } from 'types/api/project-milestones';
import styles from './ProjectMilestonesItem.module.scss';
import { formatDate } from 'utils/formatDate';

interface IProps {
  milestone: IProjectMilestone;
}

const ProjectMilestonesItem = ({ milestone }: IProps) => {
  const { date, description, title, url } = milestone;
  const dateString = formatDate(date, 'D MMM, yyyy');
  return (
    <a href={url} target='_blank' rel='noreferrer'>
      <div className={styles.hoverContainer}>
        <div className={styles.milestoneItemContainer}>
          <span className={styles.title}>{title}</span>
          <span className={styles.dateString}>{dateString}</span>
          <div className={styles.description}>{description}</div>
        </div>
      </div>
    </a>
  );
};

export default ProjectMilestonesItem;
