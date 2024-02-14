import { useTranslation } from 'react-i18next';

import { DocumentType } from 'types/api/document';
import { ICompanyResponseBody } from 'types/api/admin/companies';
import { RowSpace } from 'types/components/grid';
import { Col, DetailsSection, ProjectDocuments, Row, CompanyHeader, DataRow } from 'components';

import styles from './CompanyDetailsView.module.scss';

interface IProps {
  company: ICompanyResponseBody;
  documentTypes?: Array<DocumentType>;
}

const CompanyDetailsView = ({ company, documentTypes }: IProps) => {
  const { t } = useTranslation('views/company');
  return (
    <div className={styles.companyContainer}>
      <CompanyHeader companyName={company.name} accountAddress={company.user?.accountAddress} />
      <DetailsSection title={t('companyDetails.details')}>
        <Row verticalSpace={RowSpace.ExtraSmall} horizontalSpace={RowSpace.Small}>
          {company.user.phoneNumber && (
            <Col>
              <DataRow data={company.user.phoneNumber} icon='phone' label={t('companyDetails.phone')} />
            </Col>
          )}
          {company.user.email && (
            <Col>
              <DataRow data={company.user.email} icon='mail' label={t('companyDetails.email')} />
            </Col>
          )}
          {company.userPosition && (
            <Col>
              <DataRow data={company.userPosition} icon='company' label={t('companyDetails.position')} />
            </Col>
          )}
          {company.user && (
            <Col>
              <DataRow
                data={`${company.user.name} ${company.user.surname}`}
                icon='profile'
                label={t('companyDetails.name')}
              />
            </Col>
          )}
        </Row>
      </DetailsSection>
      <DetailsSection title={t('companyDetails.documents')} placeholder={t('companyDetails.documentsPlaceholder')}>
        {!!company.documents?.length && (
          <ProjectDocuments documents={company.documents} documentTypes={documentTypes} />
        )}
      </DetailsSection>
    </div>
  );
};

export default CompanyDetailsView;
