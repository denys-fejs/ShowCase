import Col from 'components/grid/Col';
import styles from './DocumentsSection.module.scss';
import { DocumentType, IDocumentResponseBody } from 'types/api/document';
import { useTranslation } from 'react-i18next';
import DataRow from 'components/typography/data-row';
import { formatDateDay } from 'utils';

interface IProps {
  documentType: DocumentType;
  documents: Array<IDocumentResponseBody>;
}

const DocumentsSection = ({ documentType, documents }: IProps) => {
  const { t } = useTranslation('views/project');
  return (
    <>
      {documents.findIndex((doc) => doc.documentType === documentType) > -1 && (
        <>
          <Col>
            <h5 className={styles.documentSectionTitle}>{t(`projectDocuments.types.${documentType}`)}</h5>
          </Col>
          {documents
            .filter((doc) => doc.documentType === documentType)
            .map((doc) => {
              const { fileName, url } = doc;
              return (
                <Col key={doc.id}>
                  <DataRow
                    data={`Date updated: ${formatDateDay(doc.createdAt)}`}
                    icon='document'
                    label={fileName}
                    downloadUrl={url}
                    className={styles.date}
                  />
                </Col>
              );
            })}
        </>
      )}
    </>
  );
};

export default DocumentsSection;
