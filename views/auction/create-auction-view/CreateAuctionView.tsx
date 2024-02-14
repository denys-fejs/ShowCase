import React, { useEffect, useMemo } from 'react';
import { useStoreActions, useStoreState } from 'easy-peasy';

import { IProjectDetailsResponseBody, IStoreModel } from 'types';
import BasicSearchHeader from 'views/common/headers/basic-search-header/BasicSearchHeader';
import SocketView from 'views/common/socket/SocketView';

import CreateAuctionForm from './create-auction-form/CreateAuctionForm';

//styles
import styles from './CreateAuctionView.module.scss';

const CreateAuctionView = () => {
  const userProject = useStoreState<IStoreModel, IProjectDetailsResponseBody | null>((store) => store.project.project);
  const loadProject = useStoreActions<IStoreModel>((actions) => actions.project.loadProject);

  useEffect(loadProject, []);

  const channels = useMemo(() => {
    if (userProject?.publicProjectId) {
      return [`project-${userProject.publicProjectId}`];
    }
  }, [userProject]);

  return (
    <SocketView channels={channels}>
      <BasicSearchHeader onSearch={() => undefined} />
      <div className={styles.formWrapper}>
        <CreateAuctionForm />
      </div>
    </SocketView>
  );
};

export default CreateAuctionView;
