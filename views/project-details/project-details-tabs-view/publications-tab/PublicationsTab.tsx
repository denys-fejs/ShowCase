import { useCallback, useEffect, useState } from 'react';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ActionModal, NoData } from 'components';
import AddButton from 'components/buttons/add-button/AddButton';
import { Routes } from 'constants/routes';
import { IStoreModel } from 'types/store/store';
import useModal from 'hooks/useModal';
import { TABS_ITEMS_PER_PAGE } from 'constants/index';
import PublicationsTabContent from './PublicationsTabContent';
import { IPublicationResponseBody } from 'types/api/project-publications';

//styles
import styles from './PublicationsTab.module.scss';

interface IPropstTypes {
  projectId?: number;
  canEdit?: boolean;
}

const PublicationsTab = ({ projectId, canEdit }: IPropstTypes) => {
  const { t } = useTranslation(['common', 'views/common']);
  const { isOpen, open, close, loading, setLoading } = useModal();
  const [title, setTitle] = useState('');
  const [itemsToDisplay, setItemsToDisplay] = useState(TABS_ITEMS_PER_PAGE);
  const [publicationId, setPublicationId] = useState<number | null>(null);
  const history = useHistory();
  const loadProjectPublications = useStoreActions<IStoreModel>((actions) => actions.project.loadProjectPublications);
  const publications = useStoreState<IStoreModel, any | null>((store) => store.project.projectPublications);
  const deleteProjectPublication = useStoreActions<IStoreModel>((actions) => actions.project.deleteProjectPublication);

  const handleAddPublications = () => {
    history.push(Routes.addProjectPublication);
  };

  const editHandler = (publication: IPublicationResponseBody) => {
    history.push({
      pathname: Routes.addProjectPublication,
      state: { projectId, publication },
    });
  };

  const deleteHandler = (item: IPublicationResponseBody) => {
    setTitle(item.title);
    setPublicationId(item.id);
    open();
  };

  const closeHandle = () => {
    setLoading(true);
    setTitle('');
    setPublicationId(null);
    close();
  };

  const handleConfirm = async () => {
    await deleteProjectPublication({ projectId, publicationId });
  };

  const loadProjectPublicationsCallback = useCallback(() => {
    loadProjectPublications({ projectId, limit: itemsToDisplay });
  }, [itemsToDisplay, projectId]);

  useEffect(() => {
    loadProjectPublicationsCallback();
  }, [itemsToDisplay, projectId]);

  const noItemsRender = () => {
    if (publications?.items?.length === 0) {
      return <NoData title='Publications' refresh={loadProjectPublicationsCallback} />;
    }
  };

  return (
    <>
      {canEdit && (
        <div className={styles.btnSection}>
          <AddButton onClick={handleAddPublications} />
        </div>
      )}
      {noItemsRender()}
      {publications && (
        <PublicationsTabContent
          publications={publications?.items}
          editHandler={editHandler}
          deleteHandler={deleteHandler}
          canEdit={canEdit}
          t={t}
          totalItems={publications?.meta?.totalItems}
          setItemsToDisplay={setItemsToDisplay}
          itemsToDisplay={itemsToDisplay}
        />
      )}
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
    </>
  );
};
export default PublicationsTab;
