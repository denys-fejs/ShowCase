import { IPaginationResponse, IPurchasedProject, IStoreModel, sectionSizeMap, SectionTypes } from 'types';
import { useStoreState } from 'easy-peasy';
import FilterProvider from 'views/common/filter/FilterProvider';
import ProjectSectionView from 'views/projects/project-section-view/ProjectSectionView';
import { useFetchCallback } from 'hooks';
import purchasesAPI from 'api/explorer/purchasesAPI';

import styles from './PurchasesProjectCards.module.scss';

const PurchasesProjectCards = () => {
  const walletAddress = useStoreState<IStoreModel, string | null>((store) => store.blockchain.wallet.walletAddress);
  const { response, fetchCallback } = useFetchCallback<IPaginationResponse<IPurchasedProject>>(
    (params) => {
      return walletAddress
        ? purchasesAPI.getPurchasedProjects(walletAddress, {
            limit: params.limit || sectionSizeMap[SectionTypes.PurchasedProjects],
          })
        : null;
    },
    [walletAddress],
  );

  return (
    <FilterProvider fetchData={fetchCallback}>
      {!!response && (
        <ProjectSectionView
          projects={response}
          type={SectionTypes.PurchasedProjects}
          showMoreStyle={styles.showMoreMyPurchases}
        />
      )}
    </FilterProvider>
  );
};

export default PurchasesProjectCards;
