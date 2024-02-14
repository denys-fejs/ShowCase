import { ActionModal, Col, ProjectCard, Row, ShowMoreSectionButton } from 'components';
import { useStoreActions } from 'easy-peasy';
import { useModal } from 'hooks';
import { ReactNode, useCallback, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { IPaginationResponse, IProjectsListResponseBody, IStoreModel, RowSpace } from 'types';
import FilterContext from 'views/common/filter/FilterContext';

import styles from './FavoriteProjectsSection.module.scss';
import { Routes } from 'constants/index';

interface IProps {
  projects: IPaginationResponse<IProjectsListResponseBody>;
  children?: ReactNode;
  cardsToDisplay: number;
}

const FavoriteProjectSection = ({ projects, cardsToDisplay }: IProps) => {
  const { t } = useTranslation(['common', 'views/favorite-projects']);
  const { limit, setParams } = useContext(FilterContext);
  const [title, setTitle] = useState('');
  const [projectId, setProjectId] = useState<number | null>(null);
  const { isOpen, open, close, loading, setLoading } = useModal();

  const removeFromFavorites = useStoreActions<IStoreModel>((actions) => actions.project.removeFromFavorites);

  const closeHandle = useCallback(() => {
    setLoading(false);
    close();
    setTitle('');
    setProjectId(null);
  }, [setTitle, setProjectId, close]);

  const handleConfirm = useCallback(async () => {
    setLoading(true);
    await removeFromFavorites(projectId);

    closeHandle();
    setParams({ timestamp: Date.now() });
  }, [setLoading, title, projectId, closeHandle, setParams]);

  const onFavoriteClick = useCallback(
    async (id: number, title: string): Promise<boolean> => {
      setProjectId(id);
      setTitle(title);
      open();
      return false;
    },
    [setProjectId, setTitle, open],
  );

  const showMore = () => {
    if (totalItems <= itemsToDisplay) {
      return;
    }

    setParams({ limit: itemsToDisplay + cardsToDisplay });
  };
  const {
    items: projectsList,
    meta: { totalItems: totalItems },
  } = projects;

  const itemsToDisplay = limit + cardsToDisplay;

  return (
    <>
      <div className={styles.projectSectionContainer}>
        <div className={styles.projectsList}>
          <Row verticalSpace={RowSpace.Middle} horizontalSpace={RowSpace.Middle}>
            {projectsList.length > 0 ? (
              projectsList.slice(0, itemsToDisplay).map((project) => (
                <Col key={project.id} xxl={4} xl={6} lg={8} md={12}>
                  <Link to={Routes.projectDetails.replace(':id', `${project.id}`)}>
                    <ProjectCard project={project} onFavoriteClick={onFavoriteClick} />
                  </Link>
                </Col>
              ))
            ) : (
              <div className={styles.noProjectsPlaceholder}>
                <h3>{t('views/favorite-projects:noProjectsFound')}</h3>
                <p>{t('views/favorite-projects:chooseAny')}</p>
              </div>
            )}
          </Row>
        </div>
      </div>
      {totalItems > itemsToDisplay && itemsToDisplay > 0 && (
        <ShowMoreSectionButton onClick={showMore}>{t('Show more')}</ShowMoreSectionButton>
      )}
      <ActionModal
        isOpen={isOpen}
        close={closeHandle}
        loading={loading}
        onOk={handleConfirm}
        okText={t('actions.delete.button')}
        title={t('actions.delete.title')}
        destroyOnClose
        maskClosable={false}
        keyboard={false}
      >
        <p>{t('actions.delete.message', { title })}</p>
      </ActionModal>
    </>
  );
};

export default FavoriteProjectSection;
