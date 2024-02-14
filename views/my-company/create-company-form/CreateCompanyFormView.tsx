import { Ref, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FormikProps } from 'formik';

import { CompanyStatus, DOCUMENT_ACCEPT } from 'constants/index';
import { CreateCompanySchema } from 'validators/company';
import { DocumentType, ICompanyDetailsResponseBody, ICompanyForm, RowSpace } from 'types';
import { buildInitialValues, buildUploadFilesByDocumentType } from 'utils';
import { Col, DocumentUploadInput, Form, FormField, Row } from 'components';

import styles from './CreateCompanyFormView.module.scss';

interface ICreateCompanyFormViewProps {
  handleUpdate: (values: ICompanyForm) => Promise<void>;
  company?: Partial<ICompanyDetailsResponseBody>;
  formRef?: Ref<FormikProps<ICompanyForm>>;
  disabled?: boolean;
}

const CreateCompanyFormView = ({ handleUpdate, formRef, company = {}, disabled }: ICreateCompanyFormViewProps) => {
  const { t } = useTranslation(['views/company', 'common']);
  const initialValues = useMemo(() => {
    return {
      ...buildInitialValues<any>(CreateCompanySchema, company, { assert: false }),
      companyLegalDocuments: buildUploadFilesByDocumentType(company.documents, DocumentType.CompanyLegal),
      founderLegalDocuments: buildUploadFilesByDocumentType(company.documents, DocumentType.FounderLegal),
    };
  }, [company]);
  const rejectionReason = company.reviewComment ? company.reviewComment : '';

  return (
    <div>
      <Form
        formRef={formRef}
        onSubmit={handleUpdate}
        validationSchema={CreateCompanySchema}
        initialValues={initialValues}
      >
        <Row verticalSpace={RowSpace.ExtraSmall} horizontalSpace={RowSpace.Small}>
          {rejectionReason && company.status === CompanyStatus.Rejected && (
            <Col>
              <div className={styles.rejectedContainer}>
                <span className={styles.rejectionTitle}>{t('commentsTitle')}</span>
                <p className={styles.rejectionContent}>{rejectionReason}</p>
              </div>
            </Col>
          )}
          <Col>
            <FormField
              name='name'
              placeholder={t('form.name')}
              fieldlabel={t('form.name')}
              required
              disabled={disabled}
            />
          </Col>
          <Col>
            <FormField
              name='userPosition'
              placeholder={t('form.position')}
              fieldlabel={t('form.position')}
              required
              disabled={disabled}
            />
          </Col>
          <Col>
            <FormField
              name='companyLegalDocuments'
              inputComponent={DocumentUploadInput}
              label={t('form.companyLegalDocuments')}
              placeholder={t('common:input.documentPlaceholder')}
              accept={DOCUMENT_ACCEPT}
              requried
              disabled={disabled}
            />
          </Col>
          <Col>
            <FormField
              name='founderLegalDocuments'
              inputComponent={DocumentUploadInput}
              label={t('form.founderLegalDocuments')}
              placeholder={t('common:input.documentPlaceholder')}
              accept={DOCUMENT_ACCEPT}
              requried
              disabled={disabled}
            />
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default CreateCompanyFormView;
