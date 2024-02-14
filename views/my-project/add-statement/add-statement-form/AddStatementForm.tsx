import { useEffect, useContext, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { FormikProps } from 'formik';
import { StatementSchema } from 'validators/statement';
import { buildInitialValues } from 'utils/buildInitialValues';
import { RowSpace } from 'types/components/grid';
import { IProjectForm } from 'types/forms/project';
import { IProjectStatement } from 'types/api/project-statement';
import { Routes } from 'constants/routes';
import BasicMainLayoutContext from 'views/common/layouts/main-layout/basic/BasicMainLayoutContext';
import { Row, Col, Form, FormField, SecondaryButton, DatePickerInput, PrimaryButton, IconSvg } from 'components';

import styles from './AddStatementForm.module.scss';

interface IStatementFormProps {
  handleSubmit: (values: Omit<IProjectStatement, 'id'>) => Promise<void>;
  statement?: IProjectStatement | any;
}

const AddStatementForm = ({ handleSubmit, statement = {} }: IStatementFormProps) => {
  const history = useHistory();
  const { t } = useTranslation('views/project');
  const { setSubFooter } = useContext(BasicMainLayoutContext);
  const formRef = useRef<FormikProps<IProjectForm>>(null);

  const goBack = () => {
    history.push(`${Routes.myProject}?tab=statements`);
  };

  const onSubmit = () => {
    if (formRef.current) {
      formRef.current.handleSubmit();
    }
  };

  const submitBtnText = statement?.id ? t('form.save') : t('form.publish');

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

  return (
    <div className={styles.formWrapper}>
      <Form
        initialValues={buildInitialValues<any>(StatementSchema, statement)}
        validationSchema={StatementSchema}
        onSubmit={handleSubmit}
        formRef={formRef}
      >
        <div className={styles.formContainer}>
          <Row verticalSpace={RowSpace.ExtraSmall} horizontalSpace={RowSpace.Small}>
            <Col>
              <FormField
                name='title'
                placeholder={t('projectStatement.title')}
                fieldlabel={t('projectStatement.title')}
                required
              />
            </Col>
            <Col>
              <FormField
                name='category'
                placeholder={t('projectStatement.category')}
                fieldlabel={t('projectStatement.category')}
                required
              />
            </Col>
            <Col>
              <FormField
                name='url'
                placeholder={t('projectStatement.url')}
                fieldlabel={t('projectStatement.url')}
                required
                prefix={<IconSvg icon='link' />}
              />
            </Col>
            <Col>
              <FormField
                name='date'
                fieldlabel={t('projectStatement.date')}
                placeholder={t('projectStatement.date')}
                inputComponent={DatePickerInput}
                required
              />
            </Col>
          </Row>
        </div>
      </Form>
    </div>
  );
};

export default AddStatementForm;
