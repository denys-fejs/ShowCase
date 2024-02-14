import { useEffect, useState, useCallback } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';

import { EventCard, NoData, ShowMoreSectionButton } from 'components';
import AddButton from 'components/buttons/add-button/AddButton';
import ActionsList from 'components/actions-list/ActionsList';
import { Routes } from 'constants/routes';
import { IStoreModel } from 'types/store/store';
import { IProjectEventResponse } from 'types/api/project-events';
import ActionModal from 'components/modal/action-modal/index';
import useModal from 'hooks/useModal';

//styles
import styles from './EventsTab.module.scss';
import { TABS_ITEMS_PER_PAGE } from 'constants/index';

interface IPropsTypes {
  projectId?: number;
  canEdit?: boolean;
}

const EventsTab = ({ projectId, canEdit }: IPropsTypes) => {
  const history = useHistory();
  const { t } = useTranslation('common');
  const { isOpen, open, close, loading, setLoading } = useModal();
  const [itemsToDisplay, setItemsToDisplay] = useState(TABS_ITEMS_PER_PAGE);

  const [title, setTitle] = useState('');
  const [eventId, setEventId] = useState(null);

  const eventsList = useStoreState<IStoreModel, any | null>((store) => store.project.projectEvents);

  const loadProjectEvents = useStoreActions<IStoreModel>((actions) => actions.project.loadProjectEvents);
  const deleteProjectEvent = useStoreActions<IStoreModel>((actions) => actions.project.deleteProjectEvent);

  const handleAddEvents = () => {
    history.push(Routes.addProjectEvents);
  };

  const editHandler = (event: Omit<IProjectEventResponse, 'id'>) => {
    history.push({
      pathname: Routes.addProjectEvents,
      state: { projectId, event },
    });
  };

  const deleteHandler = (item: any) => {
    setTitle(item.title);
    setEventId(item.id);
    open();
  };

  const closeHandle = () => {
    setLoading(true);
    setTitle('');
    setEventId(null);
    close();
  };

  const handleConfirm = async () => {
    await deleteProjectEvent({ projectId, eventId });
  };
  const loadProjectEventsCallback = useCallback(() => {
    loadProjectEvents({ projectId, limit: itemsToDisplay });
  }, [itemsToDisplay, projectId]);

  const showMore = () => {
    setItemsToDisplay((prevState: number) => prevState + 5);
  };
  const noItemsRender = () => {
    if (eventsList?.items?.length === 0) {
      return <NoData title='Events' refresh={loadProjectEventsCallback} />;
    }
  };

  useEffect(() => {
    loadProjectEventsCallback();
  }, [itemsToDisplay, projectId]);

  return (
    <>
      {canEdit && (
        <div className={styles.btnSection}>
          <AddButton onClick={handleAddEvents} />
        </div>
      )}
      {noItemsRender()}
      {eventsList?.items.map((item: IProjectEventResponse) => {
        return (
          <ActionsList
            key={item.id}
            item={item}
            editHandler={editHandler}
            deleteHandler={deleteHandler}
            canEdit={canEdit}
          >
            <EventCard data={item} />
          </ActionsList>
        );
      })}
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
      {eventsList?.meta?.totalItems > itemsToDisplay && (
        <ShowMoreSectionButton onClick={showMore}>{t('Show more')}</ShowMoreSectionButton>
      )}
    </>
  );
};

export default EventsTab;
