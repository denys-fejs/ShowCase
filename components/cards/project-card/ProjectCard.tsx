import { useCallback, useState } from 'react';
import { Card, Tooltip } from 'antd';
import { cutLongProjectType } from 'utils';
import { GlobalOutlined } from '@ant-design/icons';
import Flags from 'country-flag-icons/react/3x2';
import { useTranslation } from 'react-i18next';
import hasIn from 'lodash.hasin';
import cn from 'classnames';
import { IProjectsListResponseBody } from 'types';
import { COUNTRIES_MAP } from 'constants/countries';
import { Badge, CountdownComponent, FavoriteButton, IconSvg } from 'components';

import styles from './ProjectCard.module.scss';
import { projectTypeMap } from 'constants/index';
import defaultCoverImg from 'resources/images/bg/projectCardBg.jpeg';

export interface ProjectCardType extends Partial<IProjectsListResponseBody> {
  priceUsd?: string;
}

interface IProps {
  project: ProjectCardType;
  coverPlaceholder?: string;
  onFavoriteClick?: (id: number, name: string, isFavorite?: boolean) => Promise<boolean>;
  className?: string;
  wide?: boolean;
  extraWide?: boolean;
}

const ProjectCard = ({
  project,
  coverPlaceholder,
  onFavoriteClick,
  className = '',
  wide = false,
  extraWide = false,
}: IProps) => {
  const { t } = useTranslation(['views/project', 'common']);
  const { id, emissionReductions, name, country, projectType, coverImage, auditStatus, standard } = project;
  const [isFavorite, setFavorite] = useState(project.isFavorite);
  const coverBg = coverImage || (!coverPlaceholder ? defaultCoverImg : undefined);
  const Flag = country ? Flags[country] : GlobalOutlined;

  const handleFavoriteClick = useCallback(
    async (event) => {
      event.preventDefault();
      if (onFavoriteClick && id && name) {
        const updated = await onFavoriteClick(id, name, isFavorite);
        updated && setFavorite(!isFavorite);
      }
    },
    [id, name, isFavorite, onFavoriteClick],
  );

  const renderExtraContent = (wide: boolean, extraWide: boolean) => {
    if (!wide && !extraWide) {
      return (
        <div className={styles.extraContent}>
          {!!projectType && (
            <div className={styles.typeBox}>
              <IconSvg icon={projectTypeMap[projectType]} />
              {cutLongProjectType(t(`projectDetails.type.${projectType}`))}
            </div>
          )}
        </div>
      );
    }
    if (wide) {
      return (
        <div className={styles.extraContent}>
          {!!projectType && (
            <div className={styles.typeBox}>
              <IconSvg icon={projectTypeMap[projectType]} />
              {t(`projectDetails.type.${projectType}`)}
            </div>
          )}
          {!!standard && <div>{t(`projectDetails.projectStandard.${standard}`)}</div>}
          {!!auditStatus && <div>{t(`projectDetails.projectStatus.${auditStatus}`)}</div>}
        </div>
      );
    }
    if (extraWide) {
      return (
        <div className={styles.extraContent}>
          {!!projectType && (
            <div className={styles.typeBox}>
              <IconSvg icon={projectTypeMap[projectType]} />
              <div className={styles.textBox}>
                <span className={styles.title}>{t('projectInfo.projectType')}</span>
                <span>{t(`projectDetails.type.${projectType}`)}</span>
              </div>
            </div>
          )}
          {!!standard && (
            <div className={styles.textBox}>
              <span className={styles.title}>{t('projectInfo.standard')}</span>
              <span>{t(`projectDetails.projectStandard.${standard}`)}</span>
            </div>
          )}
          {!!auditStatus && (
            <div className={styles.textBox}>
              <span className={styles.title}>{t('projectInfo.status')}</span>
              <span>{t(`projectDetails.projectStatus.${auditStatus}`)}</span>
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <Card
      title={<Badge>{emissionReductions} t CO2</Badge>}
      style={{ backgroundImage: `url("${coverBg}")` }}
      extra={
        <>
          {hasIn(project, 'isFavorite') && <FavoriteButton isActive={isFavorite} onClick={handleFavoriteClick} />}
          {!!coverPlaceholder && !project.coverImage && <div className={styles.comment}>{coverPlaceholder}</div>}
        </>
      }
      className={cn(className, styles.projectCard, { [styles.wide]: wide, [styles.extraWide]: extraWide })}
    >
      <div className={styles.cardBg} />
      {project?.auction && (
        <div className={styles.auctionLabel}>
          <div className={styles.auctionInfo}>
            <CountdownComponent endTime={project?.auction?.endTime * 1000}></CountdownComponent>
          </div>
        </div>
      )}
      <div className={styles.details}>
        <Tooltip title={name} overlayClassName={styles.titleTooltip} mouseEnterDelay={0.5} placement='topLeft'>
          <span className={styles.projectTitle}>{name}</span>
        </Tooltip>
        <div className={styles.projectCountry}>
          {!!country && (
            <>
              <Flag className={styles.flag} />
              <span>{t([`common:country.${country}`, COUNTRIES_MAP[country]])}</span>
            </>
          )}
        </div>
        {/*<span className={styles.costPerTon}>{`${price} ${t('projectDetails.tonsCO2PerCC')}`}</span>*/}
        {/* <span className={styles.costInUsd}>{priceUsd || '≈0.00$'}</span> */}
      </div>
      {renderExtraContent(wide, extraWide)}
    </Card>
  );
};

export default ProjectCard;
