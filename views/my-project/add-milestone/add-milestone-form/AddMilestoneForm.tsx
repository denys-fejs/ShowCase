import { useContext, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { FormikProps } from 'formik';

import { MilestoneSchema } from 'validators/milestone';
import { buildInitialValues } from 'utils/buildInitialValues';
import { RowSpace } from 'types/components/grid';
import { IProjectMilestone } from 'types/api/project-milestones';
import { IProjectForm } from 'types/forms/project';
import { Routes } from 'constants/routes';
import BasicMainLayoutContext from 'views/common/layouts/main-layout/basic/BasicMainLayoutContext';
import {
  Row,
  Col,
  Form,
  FormField,
  SecondaryButton,
  TextAreaInput,
  DatePickerInput,
  PrimaryButton,
  IconSvg,
} from 'components';

import styles from './AddMilestoneForm.module.scss';

interface IMilestoneFormProps {
  handleSubmit: (values: Omit<IProjectMilestone, 'id'>) => Promise<void>;
  milestone?: IProjectMilestone | any;
}

const AddMilestoneForm = ({ milestone, handleSubmit }: IMilestoneFormProps) => {
  const history = useHistory();
  const { t } = useTranslation('views/project');
  const { setSubFooter } = useContext(BasicMainLayoutContext);
  const formRef = useRef<FormikProps<IProjectForm>>(null);
  const goBack = () => {
    history.push(`${Routes.myProject}?tab=milestones`);
  };

  const onSubmit = () => {
    if (formRef.current) {
      formRef.current.handleSubmit();
    }
  };

  const submitBtnText = milestone?.id ? t('form.save') : t('form.publish');

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
        initialValues={buildInitialValues<any>(MilestoneSchema, milestone)}
        validationSchema={MilestoneSchema}
        onSubmit={handleSubmit}
        formRef={formRef}
      >
        <div className={styles.formContainer}>
          <Row verticalSpace={RowSpace.ExtraSmall} horizontalSpace={RowSpace.Small}>
            <Col>
              <FormField
                name='title'
                placeholder={t('projectMilestone.title')}
                fieldlabel={t('projectMilestone.title')}
                required
              />
            </Col>
            <Col>
              <FormField
                name='description'
                type='text'
                placeholder={t('projectMilestone.description')}
                fieldlabel={t('projectMilestone.description')}
                inputComponent={TextAreaInput}
                autoSize={{ minRows: 1, maxRows: 10 }}
                required
              />
            </Col>
            <Col>
              <FormField
                name='url'
                placeholder={t('projectMilestone.url')}
                fieldlabel={t('projectMilestone.url')}
                required
                prefix={<IconSvg icon='link' />}
              />
            </Col>
            <Col>
              <FormField
                name='date'
                fieldlabel={t('projectMilestone.date')}
                placeholder={t('projectMilestone.date')}
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

export default AddMilestoneForm;
