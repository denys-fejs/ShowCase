import { ReactNode, Ref, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormikProps } from 'formik';

import { DOCUMENT_ACCEPT, IMAGE_ACCEPT } from 'constants/documents';
import { COUNTRIES, getCodeByCountry } from 'constants/countries';
import { ProjectStandards, ProjectStatus } from 'constants/project';
import { DocumentUploadType } from 'types/components/inputs';
import { RowSpace } from 'types/components/grid';
import { IProjectDetailsResponseBody, ProjectMethodologies, ProjectTypes } from 'types/api/project';
import { IProjectForm } from 'types/forms/project';
import { DocumentType } from 'types/api/document';
import { CreateProjectSchema } from 'validators/project';
import { buildInitialValues } from 'utils/buildInitialValues';
import { buildUploadFilesByDocumentType } from 'utils/file';
import { Col, Divider, DocumentUploadInput, Form, FormField, Row, SelectInput, TextAreaInput } from 'components';
import ProjectRollbackActionView from 'views/my-project/actions/rollback-action/ProjectRollbackActionView';

import styles from './CreateProjectFormView.module.scss';
import SearchMap from 'components/map/search-map/SearchMap';
import { LatLng } from 'leaflet';
import RequestTokensView from '../../actions/request-tokens/RequestTokensView';
import TokenTickerHelpView from '../token-ticker-help/TokenTickerHelpView';

interface ICreateProjectFormViewProps {
  handleUpdate: (values: IProjectForm) => Promise<void>;
  project?: Partial<IProjectDetailsResponseBody>;
  formRef?: Ref<FormikProps<IProjectForm>>;
  children?: ReactNode;
}

const projectTypesOptions = Object.values(ProjectTypes).map((value) => ({ value }));
const countiesOptions = Object.values(COUNTRIES).map(({ name, code }) => ({ value: code, content: name }));
const standardOptions = Object.values(ProjectStandards).map((value) => ({ value }));

const CreateProjectFormView = ({ handleUpdate, formRef, project = {}, children }: ICreateProjectFormViewProps) => {
  const { t } = useTranslation(['views/project', 'common']);
  const [country, setCountry] = useState<string>('');
  const [projectCoords, setProjectCoords] = useState<LatLng | null>(null);
  const initialValues = useMemo(() => {
    return {
      ...buildInitialValues<any>(CreateProjectSchema, project, { assert: false }),
      cover: buildUploadFilesByDocumentType(project.documents, DocumentType.CoverImage),
      pipelineDocuments: buildUploadFilesByDocumentType(project.documents, DocumentType.VcsPipeline),
      registrationDocuments: buildUploadFilesByDocumentType(project.documents, DocumentType.VcsRegistration),
      issuanceDocuments: buildUploadFilesByDocumentType(project.documents, DocumentType.VcsIssuance),
      otherDocuments: buildUploadFilesByDocumentType(project.documents, DocumentType.VcsOther),
      companyLegalDocuments: buildUploadFilesByDocumentType(project.documents, DocumentType.CompanyLegal),
      founderLegalDocuments: buildUploadFilesByDocumentType(project.documents, DocumentType.FounderLegal),
      auditLegalDocuments: buildUploadFilesByDocumentType(project.documents, DocumentType.AuditCompanyLegal),
    };
  }, [project]);
  const projectMethodologiesOptions = useMemo(
    () =>
      Object.values(ProjectMethodologies).map((value) => ({
        value,
        content: t([`common:project.methodologies.${value}`, value]),
      })),
    [t],
  );
  const rejectionReason = project.reviewComment ? project.reviewComment : '';
  return (
    <div>
      <Form
        formRef={formRef}
        onSubmit={handleUpdate}
        validationSchema={CreateProjectSchema}
        initialValues={initialValues}
      >
        <Row verticalSpace={RowSpace.ExtraSmall} horizontalSpace={RowSpace.Small}>
          {rejectionReason && project.status === ProjectStatus.Rejected && (
            <Col>
              <div className={styles.rejectedContainer}>
                <span className={styles.rejectionTitle}>{t('commentsTitle')}</span>
                <p className={styles.rejectionContent}>{rejectionReason}</p>
                {!!project?.publicProjectId && <ProjectRollbackActionView isPrimaryButton />}
              </div>
            </Col>
          )}
          <Col>
            <FormField
              name='cover'
              label={t('form.cover')}
              placeholder={t('common:input.imagePlaceholder')}
              inputComponent={DocumentUploadInput}
              accept={IMAGE_ACCEPT}
              documentType={DocumentUploadType.Image}
              className={styles.uploadLabel}
              labelIsBlack={true}
            />
          </Col>
          <Col>
            <FormField name='name' placeholder={t('projectInfo.name')} fieldlabel={t('projectInfo.name')} required />
          </Col>
          <Col>
            <FormField
              name='projectType'
              placeholder={t('projectInfo.projectType')}
              fieldlabel={t('projectInfo.projectType')}
              inputComponent={SelectInput}
              options={projectTypesOptions}
              showSearch
              required
            />
          </Col>
          <Col>
            {project?.publicProjectId ? (
              <RequestTokensView />
            ) : (
              <FormField
                name='emissionReductions'
                type='number'
                placeholder={t('projectInfo.emissionReductions')}
                suffix={t('projectInfo.emissionUnit')}
                fieldlabel={t('projectInfo.emissionReductions')}
                required
              />
            )}
          </Col>
          {/*<Col>*/}
          {/*  <FormField*/}
          {/*    name='price'*/}
          {/*    type='number'*/}
          {/*    placeholder={t('form.price')}*/}
          {/*    suffix={t('common:blockchain.unit')}*/}
          {/*    fieldlabel={t('form.price')}*/}
          {/*    required*/}
          {/*  />*/}
          {/*</Col>*/}
          <Col>
            <FormField
              name='tokenName'
              placeholder={t('projectInfo.tokenName')}
              fieldlabel={t('projectInfo.tokenName')}
              disabled={!!project?.publicProjectId}
              required
            />
          </Col>
          <Col>
            <FormField
              name='tokenTicker'
              placeholder={t('projectInfo.tokenTicker')}
              fieldlabel={t('projectInfo.tokenTicker')}
              disabled={!!project?.publicProjectId}
              help={<TokenTickerHelpView />}
              required
            />
          </Col>
          <Col>
            <SearchMap
              setProjectCoords={setProjectCoords}
              lat={project?.lat}
              lon={project?.lon}
              setCountry={setCountry}
            />
          </Col>
          <Col>
            <FormField
              name='country'
              placeholder={t('projectInfo.country')}
              fieldlabel={t('projectInfo.country')}
              inputComponent={SelectInput}
              options={countiesOptions}
              defaultValue={getCodeByCountry(country) || project?.country}
              showSearch
              required
            />
          </Col>
          <Col>
            <FormField name='city' placeholder={t('projectInfo.city')} fieldlabel={t('projectInfo.city')} />
          </Col>
          <Col>
            <FormField name='province' placeholder={t('projectInfo.province')} fieldlabel={t('projectInfo.province')} />
          </Col>
          <Col>
            <FormField
              name='streetAddress'
              placeholder={t('projectInfo.streetAddress')}
              fieldlabel={t('projectInfo.streetAddress')}
            />
          </Col>
          <Col>
            <FormField name='postCode' placeholder={t('projectInfo.postCode')} fieldlabel={t('projectInfo.postCode')} />
          </Col>
          <Col className={styles.hidden}>
            <FormField name='lat' defaultValue={projectCoords?.lat || project?.lat} type='hidden' />
          </Col>
          <Col className={styles.hidden}>
            <FormField name='lon' defaultValue={projectCoords?.lng || project?.lon} type='hidden' />
          </Col>
          <Col>
            <FormField name='phone' placeholder={t('projectInfo.phone')} fieldlabel={t('projectInfo.phone')} />
          </Col>
          <Col>
            <FormField name='website' placeholder={t('projectInfo.website')} fieldlabel={t('projectInfo.website')} />
          </Col>
          <Col>
            <FormField
              name='standard'
              placeholder={t('projectInfo.standard')}
              fieldlabel={t('projectInfo.standard')}
              inputComponent={SelectInput}
              options={standardOptions}
              showSearch
            />
          </Col>
          <Col>
            <FormField
              name='methodology'
              placeholder={t('projectInfo.methodology')}
              fieldlabel={t('projectInfo.methodology')}
              inputComponent={SelectInput}
              options={projectMethodologiesOptions}
              showSearch
              showTooltip
              required
            />
          </Col>
          <Col>
            <FormField
              name='description'
              type='text'
              placeholder={t('projectInfo.description')}
              inputComponent={TextAreaInput}
              fieldlabel={t('projectInfo.description')}
              autoSize={{ minRows: 1, maxRows: 10 }}
              required
            />
          </Col>
          <Col>
            <FormField
              name='pipelineDocuments'
              label={t('projectInfo.pipelineDocuments')}
              placeholder={t('common:input.documentPlaceholder')}
              inputComponent={DocumentUploadInput}
              accept={DOCUMENT_ACCEPT}
            />
          </Col>
          <Col>
            <FormField
              name='registrationDocuments'
              label={t('projectInfo.registrationDocuments')}
              placeholder={t('common:input.documentPlaceholder')}
              inputComponent={DocumentUploadInput}
              accept={DOCUMENT_ACCEPT}
            />
          </Col>
          <Col>
            <FormField
              name='issuanceDocuments'
              label={t('projectInfo.issuanceDocuments')}
              placeholder={t('common:input.documentPlaceholder')}
              inputComponent={DocumentUploadInput}
              accept={DOCUMENT_ACCEPT}
            />
          </Col>
          <Col>
            <FormField
              name='otherDocuments'
              label={t('projectInfo.otherDocuments')}
              placeholder={t('common:input.documentPlaceholder')}
              inputComponent={DocumentUploadInput}
              accept={DOCUMENT_ACCEPT}
            />
          </Col>
          <Col>
            <Divider className={styles.sectionDivider}>{t('form.kycDocuments')}</Divider>
          </Col>
          <Col>
            <FormField
              name='companyLegalDocuments'
              label={t('projectInfo.companyLegalDocuments')}
              placeholder={t('common:input.documentPlaceholder')}
              inputComponent={DocumentUploadInput}
              accept={DOCUMENT_ACCEPT}
            />
          </Col>
          <Col>
            <FormField
              name='founderLegalDocuments'
              label={t('projectInfo.founderLegalDocuments')}
              placeholder={t('common:input.documentPlaceholder')}
              inputComponent={DocumentUploadInput}
              accept={DOCUMENT_ACCEPT}
            />
          </Col>
          <Col>
            <FormField
              name='auditLegalDocuments'
              label={t('projectInfo.auditLegalDocuments')}
              placeholder={t('common:input.documentPlaceholder')}
              inputComponent={DocumentUploadInput}
              accept={DOCUMENT_ACCEPT}
            />
          </Col>
        </Row>
        {children}
      </Form>
    </div>
  );
};

export default CreateProjectFormView;
