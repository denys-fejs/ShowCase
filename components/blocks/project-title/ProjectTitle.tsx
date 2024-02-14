import { ProjectBalance, SectionTitle } from 'components';
import { IProjectDetailsResponseBody } from 'types/api/project';
import Flags from 'country-flag-icons/react/3x2';
import { GlobalOutlined } from '@ant-design/icons';
import { COUNTRIES_MAP } from 'constants/countries';
import { useTranslation } from 'react-i18next';

import styles from './ProjectTitle.module.scss';

interface IProps {
  project: Partial<IProjectDetailsResponseBody>;
}

const ProjectTitle = ({ project }: IProps) => {
  const { t } = useTranslation('common');
  const Flag = project.country ? Flags[project.country] : GlobalOutlined;
  const subtitle = (
    <>
      {project.tokenAddr && <ProjectBalance tokenAddr={project.tokenAddr} tokenTicker={project.tokenTicker} />}
      <div className={styles.projectCountry}>
        <Flag className={styles.flag} />
        <span>{t([`common:country.${project.country}`, project?.country ? COUNTRIES_MAP[project.country] : ''])}</span>
      </div>
    </>
  );
  return (
    <>
      {project.coverImage && <img className={styles.roundCoverImg} src={project.coverImage} />}
      <SectionTitle subtitle={subtitle} className={styles.countrySubtitle}>
        {project.name}
      </SectionTitle>
    </>
  );
};

export default ProjectTitle;
