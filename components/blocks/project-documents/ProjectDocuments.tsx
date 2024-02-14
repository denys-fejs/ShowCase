import { Row } from 'components';
import { DocumentType, IDocumentResponseBody } from 'types/api/document';
import { RowSpace } from 'types/components/grid';

import DocumentsSection from './documents-section';

interface IProps {
  documents: Array<IDocumentResponseBody>;
  documentTypes?: Array<DocumentType>;
}

const ProjectDocuments = ({
  documents,
  documentTypes = [
    DocumentType.VcsPipeline,
    DocumentType.VcsRegistration,
    DocumentType.VcsIssuance,
    DocumentType.VcsOther,
  ],
}: IProps) => {
  return (
    <>
      <Row verticalSpace={RowSpace.ExtraSmall} horizontalSpace={RowSpace.Small}>
        {documentTypes?.map((documentType, index) => (
          <DocumentsSection key={`${documentType}-${index}`} documentType={documentType} documents={documents} />
        ))}
      </Row>
    </>
  );
};

export default ProjectDocuments;
