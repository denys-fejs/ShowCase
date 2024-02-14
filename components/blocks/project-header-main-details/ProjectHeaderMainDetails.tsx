import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { TokenContract } from 'blockchain';
import useFetch from 'hooks/useFetch';
import { IProjectDetailsResponseBody } from 'types';
import { projectTypeMap } from 'constants/index';
import { DetailsItem, IconSvg } from 'components';
import EmissionPlan from './emission-plan';

import styles from './ProjectHeaderMainDetails.module.scss';

interface IProps {
  project: Partial<IProjectDetailsResponseBody>;
  showButtons?: boolean;
}

const ProjectHeaderMainDetails = ({ project }: IProps) => {
  const { t } = useTranslation(['views/project', 'common']);
  const { projectType, methodology, emissionReductions, auditStatus, standard } = project;

  const contract = useMemo(
    () => (project.tokenAddr ? new TokenContract(project.tokenAddr) : null),
    [project.tokenAddr],
  );
  const { response: totalSupply } = useFetch(async () => contract?.getTotalSupply(), [contract]);
  const { response: totalBurned } = useFetch(async () => contract?.getTotalBurned(), [contract]);

  return (
    <div>
      <ul className={styles.mainDetails}>
        <li className={styles.mainDetailsItem}>
          <div className={styles.typeContainer}>
            <div className={styles.iconBox}>{projectType && <IconSvg icon={projectTypeMap[projectType]} />}</div>
            <div>
              <DetailsItem
                title={t('projectInfo.projectType')}
                value={t<string>(`projectDetails.type.${projectType}`)}
              />
            </div>
          </div>
        </li>
        <li className={styles.mainDetailsItem}>
          <DetailsItem title={t('projectInfo.standard')} value={standard || '-'} />
        </li>
        <li className={styles.mainDetailsItem}>
          {methodology && <DetailsItem title={t('projectInfo.methodology')} value={methodology} />}
        </li>
        <li className={styles.mainDetailsItem}>
          <DetailsItem
            title={t('projectInfo.emissionReductions')}
            value={`${emissionReductions} ${t('projectInfo.emissionUnit')} ${t('projectInfo.perYear')}`}
          />
        </li>
        <li className={styles.mainDetailsItem}>
          <DetailsItem title={t('projectInfo.status')} value={String(t(`common:project.status.${auditStatus}`))} />
        </li>
      </ul>
      <EmissionPlan
        available={totalSupply ? +totalSupply : 0}
        burned={totalBurned ? +totalBurned : 0}
        planed={project.emissionReductions}
      />
    </div>
  );
};

export default ProjectHeaderMainDetails;
