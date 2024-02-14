import React from 'react';
import { Link } from 'react-router-dom';

import { IProjectsListResponseBody } from 'types';
import { Routes } from 'constants/index';
import { BasicCard, ProjectCard, Row, Col } from 'components';

import styles from './TopProjectsSectionView.module.scss';

interface IProps {
  projects: Array<IProjectsListResponseBody>;
}

const TopProjectsSectionView = ({ projects }: IProps) => {
  return (
    <div className={styles.projectList}>
      <Row>
        <Col lg={12} md={24}>
          {projects[0] ? (
            <Link to={Routes.projectDetails.replace(':id', `${projects[0].id}`)}>
              <ProjectCard project={projects[0]} extraWide={true} />
            </Link>
          ) : (
            <BasicCard>
              <div className={styles.empty}>Here can be your project</div>
            </BasicCard>
          )}
        </Col>
        <Col lg={12} md={24}>
          <Row>
            <Col>
              {projects[1] ? (
                <Link to={Routes.projectDetails.replace(':id', `${projects[1].id}`)}>
                  <ProjectCard project={projects[1]} wide={true} />
                </Link>
              ) : (
                <BasicCard>
                  <div className={styles.empty}>Here can be your project</div>
                </BasicCard>
              )}
            </Col>
            <Col>
              {projects[2] ? (
                <Link to={Routes.projectDetails.replace(':id', `${projects[2].id}`)}>
                  <ProjectCard project={projects[2]} wide={true} />
                </Link>
              ) : (
                <BasicCard>
                  <div className={styles.empty}>Here can be your project</div>
                </BasicCard>
              )}
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default TopProjectsSectionView;
