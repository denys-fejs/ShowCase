import { useCallback } from 'react';
import Flags from 'country-flag-icons/react/3x2';
import { useTranslation } from 'react-i18next';
import isEmpty from 'lodash.isempty';

import { DetailsSection, Map, Notification, ProjectContacts, ProjectDocuments, TokenNamePrice } from 'components';
import { formatAddress } from 'utils/formating';
import { DocumentType } from 'types/api/document';

//styles
import styles from './OverviewTab.module.scss';
import { useStoreActions } from 'easy-peasy';
import { IStoreModel } from 'types';
import { NotificationTypes } from 'constants/index';

interface IPropsTypes {
  projectInfo: any;
  documentTypes?: Array<DocumentType>;
}

const OverviewTab = ({ projectInfo, documentTypes }: IPropsTypes) => {
  const { t } = useTranslation('views/project');
  const {
    streetAddress,
    postCode,
    description,
    country,
    province,
    city,
    documents,
    tokenName,
    tokenTicker,
    tokenAddr,
    price,
    lat,
    lon,
  } = projectInfo;
  const address = formatAddress({ streetAddress, postCode, country, province, city });
  const Flag = Flags[country];

  const addNewToken = useStoreActions<IStoreModel>((store) => store.blockchain.wallet.addNewToken);
  const addNewTokenHanler = useCallback(async () => {
    if (isEmpty(tokenAddr) && isEmpty(tokenTicker)) {
      Notification({
        notificationType: NotificationTypes.Error,
        message: t('common:common.error'),
        description: t('addToken.invalid'),
      });
      return;
    }

    await addNewToken({ address: tokenAddr, symbol: tokenTicker });
  }, [tokenAddr, tokenTicker]);

  return (
    <div className={styles.container}>
      {tokenAddr && (
        <TokenNamePrice
          tokenName={tokenName}
          tokenPrice={price}
          tokenTicker={tokenTicker}
          tokenAddr={tokenAddr}
          addNewTokenHanler={addNewTokenHanler}
        />
      )}
      <DetailsSection title={t('projectDetails.location')}>
        {lat && lon && <Map lat={lat} lon={lon} />}
        <div className={styles.adressWrapper}>
          {Flag && <Flag className={styles.locationFlag} />}
          <span className={styles.locationTitle}>{address}</span>
        </div>
      </DetailsSection>
      <DetailsSection title={t('projectDetails.description')}>
        <p className={styles.descriptionText}>{description}</p>
      </DetailsSection>
      <DetailsSection title={t('projectDetails.contacts')}>
        <ProjectContacts
          company={projectInfo.companyName}
          address={projectInfo.country}
          phone={projectInfo.phone}
          website={projectInfo.website}
        />
      </DetailsSection>
      <DetailsSection title={t('projectDetails.documents')} placeholder={t('projectDetails.documentsPlaceholder')}>
        {!!documents?.length && <ProjectDocuments documents={documents} documentTypes={documentTypes} />}
      </DetailsSection>
    </div>
  );
};

export default OverviewTab;
