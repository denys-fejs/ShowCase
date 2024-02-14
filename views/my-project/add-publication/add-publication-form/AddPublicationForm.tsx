import { useContext, useEffect, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { FormikProps } from 'formik';

import { buildInitialValues } from 'utils/buildInitialValues';
import { RowSpace } from 'types/components/grid';
import { Routes } from 'constants/routes';

import { IPublicationsRequestBody } from 'types/api/project-publications';
import { PublicationSchema } from 'validators/publication';
import { IMAGE_ACCEPT } from 'constants/documents';
import DocumentUploadInput from 'components/inputs/document-upload/index';
import { DocumentUploadType } from 'types/components/inputs';
import { IProjectForm } from 'types/forms/project';
import BasicMainLayoutContext from 'views/common/layouts/main-layout/basic/BasicMainLayoutContext';

import { Row, Col, Form, FormField, SecondaryButton, PrimaryButton, TextAreaInput, IconSvg } from 'components';

import styles from './AddPublicationForm.module.scss';

interface IStatementFormProps {
  handleSubmit: (values: Omit<IPublicationsRequestBody, 'id'>) => Promise<void>;
  publication?: IPublicationsRequestBody | any;
}

const AddPublicationForm = ({ handleSubmit, publication = {} }: IStatementFormProps) => {
  const history = useHistory();
  const { t } = useTranslation('views/project');
  const { setSubFooter } = useContext(BasicMainLayoutContext);
  const formRef = useRef<FormikProps<IProjectForm>>(null);
  const goBack = () => {
    history.push(`${Routes.myProject}?tab=publications`);
  };

  const onSubmit = () => {
    if (formRef.current) {
      formRef.current.handleSubmit();
    }
  };

  const submitBtnText = publication.id ? t('form.save') : t('form.publish');

  useEffect(() => {
    setSubFooter &&
      setSubFooter(
        <div className={styles.buttonsContainer}>
          <SecondaryButton className={styles.actionButtonCancel} onClick={goBack} size='large'>
            {t('form.cancel')}
          </SecondaryButton>
          <PrimaryButton onClick={onSubmit} className={styles.actionButton}>
            {submitBtnText}
          </PrimaryButton>
        </div>,
      );

    return () => {
      setSubFooter && setSubFooter(null);
    };
  }, [setSubFooter, t]);

  const initialValues = useMemo(() => {
    return buildInitialValues<any>(PublicationSchema, {
      ...publication,
      coverImage: publication.coverImage ? [{ url: publication.coverImage }] : undefined,
    });
  }, [publication]);

  return (
    <div>
      <Form
        initialValues={initialValues}
        validationSchema={PublicationSchema}
        onSubmit={handleSubmit}
        formRef={formRef}
      >
        <div className={styles.formContainer}>
          <Row verticalSpace={RowSpace.ExtraSmall} horizontalSpace={RowSpace.Small}>
            <Col>
              <FormField
                name='coverImage'
                placeholder={t('projectPublication.coverImage')}
                inputComponent={DocumentUploadInput}
                accept={IMAGE_ACCEPT}
                documentType={DocumentUploadType.Image}
                required
              />
            </Col>
            <Col>
              <FormField
                name='title'
                placeholder={t('projectPublication.title')}
                fieldlabel={t('projectPublication.title')}
                required
              />
            </Col>
            <Col>
              <FormField
                name='description'
                placeholder={t('projectPublication.description')}
                fieldlabel={t('projectPublication.description')}
                inputComponent={TextAreaInput}
                autoSize={{ minRows: 1, maxRows: 10 }}
                required
              />
            </Col>
            <Col>
              <FormField
                name='sourceUrl'
                placeholder={t('projectPublication.publicationLink')}
                fieldlabel={t('projectPublication.publicationLink')}
                required
                prefix={<IconSvg icon='link' />}
              />
            </Col>
          </Row>
        </div>
      </Form>
    </div>
  );
};

export default AddPublicationForm;
