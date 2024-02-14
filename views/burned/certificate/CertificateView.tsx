import { useMemo } from 'react';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { PDFDownloadLink } from '@react-pdf/renderer';

import { useFetch } from 'hooks';
import { IBurnedTokensResponseBody } from 'types';
import burnAPI from 'api/burn/burnAPI';
import { formatDateDay, formatDateDayLocale, getCertificateFileName } from 'utils';
import { Routes } from 'constants/index';
import { Provider } from 'blockchain';
import { BasicCard, BlockLoader, IconSvg, PrimaryButton } from 'components';
import BasicSearchHeader from 'views/common/headers/basic-search-header/BasicSearchHeader';

import CertificatePDF from './CertificatePDF';

import styles from './CertificateView.module.scss';

const CertificateView = () => {
  const { t } = useTranslation(['views/burned', 'common']);
  const { id } = useParams<{ id: string }>();

  const { response } = useFetch<IBurnedTokensResponseBody>(() => {
    return burnAPI.getBurnCertificateById(id);
  }, [id]);
  const { response: transaction } = useFetch(async () => {
    return response ? Provider.getTransaction(response.txHash) : null;
  }, [response]);

  const { fileName, creationDate } = useMemo(() => {
    if (response) {
      return {
        fileName: getCertificateFileName(response),
        creationDate: new Date(),
      };
    }

    return {};
  }, [response]);

  return (
    <>
      <BasicSearchHeader />
      <div className={styles.container}>
        <div className={styles.innerContainer}>
          {response && transaction ? (
            <>
              <BasicCard className={styles.card}>
                <div className={styles.tokenName}>{response.project.tokenName}</div>
                <div className={styles.infoBlock}>
                  <div>{t('certificate.burnTokens')}</div>
                  <div className={styles.highlighted}>{response.amount}</div>
                </div>
                <div className={styles.infoBlock}>
                  <div>{t('certificate.burnDate')}</div>
                  <div className={styles.highlighted}>{formatDateDayLocale(response.burnDate)}</div>
                </div>
                <div className={styles.projectName}>{response.project.name}</div>
                <div className={styles.projectDescription}>{response.project.description}</div>
                <Link
                  to={Routes.projectDetails.replace(':id', String(response.project.id))}
                  className={styles.projectLink}
                >
                  <PrimaryButton className={styles.projectButton} size='middle'>
                    <IconSvg icon='link' />
                    {t('certificate.projectLink')}
                  </PrimaryButton>
                </Link>
              </BasicCard>
              <BasicCard className={styles.card}>
                <div className={styles.documentContainer}>
                  <div className={styles.document}>
                    <div className={styles.documentData}>
                      <div>
                        <IconSvg icon='document' />
                      </div>
                      <div className={styles.documentInfo}>
                        <div>{fileName}</div>
                        <div className={styles.documentDate}>
                          {t('certificate.creationDate')} {formatDateDay(String(creationDate))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <PDFDownloadLink
                      fileName={fileName}
                      document={
                        <CertificatePDF burnedTokens={response} creationDate={creationDate} transaction={transaction} />
                      }
                    >
                      <PrimaryButton className={styles.downloadButton} size='middle'>
                        <IconSvg icon='download' />
                        {t('common:common.download')}
                      </PrimaryButton>
                    </PDFDownloadLink>
                  </div>
                </div>
              </BasicCard>
            </>
          ) : (
            <BasicCard className={styles.loadingCard}>
              <BlockLoader isLoading size='default' />
              <div>{t('certificate.loading')}</div>
            </BasicCard>
          )}
        </div>
      </div>
    </>
  );
};

export default CertificateView;
