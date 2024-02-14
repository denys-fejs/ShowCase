import React from 'react';
import { IPublicationResponseBody } from 'types/api/project-publications';
import ActionsList from 'components/actions-list/ActionsList';
import { PublicationCard } from 'components';
import { ShowMoreSectionButton } from 'components';

interface IPropsTypes {
  publications: Array<IPublicationResponseBody>;
  editHandler: (_: IPublicationResponseBody) => void;
  deleteHandler: (_: IPublicationResponseBody) => void;
  canEdit?: boolean;
  t: any;
  totalItems: number;
  setItemsToDisplay: (_: any) => void;
  itemsToDisplay: number;
}

const PublicationsTabContent = ({
  setItemsToDisplay,
  publications,
  editHandler,
  deleteHandler,
  canEdit,
  t,
  totalItems,
  itemsToDisplay,
}: IPropsTypes) => {
  const showMore = () => {
    setItemsToDisplay((prevState: number) => prevState + 5);
  };

  return (
    <>
      {publications.map((item: IPublicationResponseBody) => {
        return (
          <ActionsList
            key={item.id}
            deleteHandler={deleteHandler}
            editHandler={editHandler}
            item={item}
            canEdit={canEdit}
          >
            <PublicationCard item={item} />
          </ActionsList>
        );
      })}
      {totalItems > itemsToDisplay && (
        <ShowMoreSectionButton onClick={showMore}>{t('Show more')}</ShowMoreSectionButton>
      )}
    </>
  );
};

export default PublicationsTabContent;
