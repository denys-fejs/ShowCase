import { useContext, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { FormikProps } from 'formik';

import { EventSchema } from 'validators/event';
import { buildInitialValues } from 'utils/buildInitialValues';
import { RowSpace } from 'types/components/grid';
import { Routes } from 'constants/routes';

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
import { IProjectForm } from 'types/forms/project';
import { IProjectEvent, IProjectEventResponse } from 'types/api/project-events';
import { COUNTRIES } from 'constants/countries';
import SelectInput from 'components/inputs/select/index';
import BasicMainLayoutContext from 'views/common/layouts/main-layout/basic/BasicMainLayoutContext';

//styles
import styles from './AddEventsForm.module.scss';

interface IEventFormProps {
  handleSubmit: (values: Omit<IProjectEventResponse, 'id'>) => Promise<void>;
  event?: IProjectEvent | any;
}

const AddEventsForm = ({ event, handleSubmit }: IEventFormProps) => {
  const history = useHistory();
  const { t } = useTranslation('views/project');
  const { setSubFooter } = useContext(BasicMainLayoutContext);
  const formRef = useRef<FormikProps<IProjectForm>>(null);
  const countriesOptions = Object.values(COUNTRIES).map(({ name, code }) => ({ value: code, content: name }));

  const goBack = () => {
    history.push(`${Routes.myProject}?tab=events`);
  };

  const onSubmit = () => {
    if (formRef.current) {
      formRef.current.handleSubmit();
    }
  };

  const submitBtnText = event?.id ? t('form.save') : t('form.publish');

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
        initialValues={buildInitialValues<any>(EventSchema, event)}
        validationSchema={EventSchema}
        onSubmit={handleSubmit}
        formRef={formRef}
      >
        <div className={styles.formContainer}>
          <Row verticalSpace={RowSpace.ExtraSmall} horizontalSpace={RowSpace.Small}>
            <Col>
              <FormField
                name='title'
                placeholder={t('projectEvent.title')}
                fieldlabel={t('projectEvent.title')}
                required
              />
            </Col>
            <Col>
              <FormField
                name='description'
                type='text'
                placeholder={t('projectEvent.description')}
                fieldlabel={t('projectEvent.description')}
                inputComponent={TextAreaInput}
                autoSize={{ minRows: 1, maxRows: 10 }}
                required
              />
            </Col>
            <Col>
              <FormField
                name='url'
                placeholder={t('projectEvent.eventLink')}
                fieldlabel={t('projectEvent.eventLink')}
                required
                prefix={<IconSvg icon='link' />}
              />
            </Col>
            <div style={{ display: 'flex', width: '100%' }}>
              <Col span={12}>
                <FormField
                  name='startDate'
                  fieldlabel={t('projectEvent.startDate')}
                  placeholder={t('projectEvent.startDate')}
                  inputComponent={DatePickerInput}
                  required
                />
              </Col>
              <Col span={12}>
                <FormField
                  name='endDate'
                  fieldlabel={t('projectEvent.endDate')}
                  placeholder={t('projectEvent.endDate')}
                  inputComponent={DatePickerInput}
                  required
                />
              </Col>
            </div>
            <Col>
              <FormField
                name='country'
                placeholder={t('projectEvent.country')}
                fieldlabel={t('projectEvent.country')}
                inputComponent={SelectInput}
                options={countriesOptions}
                showSearch
                required
              />
            </Col>
            <Col>
              <FormField
                name='city'
                placeholder={t('projectEvent.city')}
                fieldlabel={t('projectEvent.city')}
                // inputComponent={SelectInput}
                // options={[]}
                // showSearch
                required
              />
            </Col>
            <Col>
              <FormField
                name='province'
                placeholder={t('projectEvent.state/province')}
                fieldlabel={t('projectEvent.state/province')}
                // inputComponent={SelectInput}
                // options={[]}
                // showSearch
                required
              />
            </Col>
            <Col>
              <FormField
                name='streetAddress'
                placeholder={t('projectEvent.streetAddress')}
                fieldlabel={t('projectEvent.streetAddress')}
                required
              />
            </Col>
            <Col>
              <FormField
                name='postCode'
                placeholder={t('projectEvent.zip/postCode')}
                fieldlabel={t('projectEvent.zip/postCode')}
                required
              />
            </Col>
          </Row>
        </div>
      </Form>
    </div>
  );
};

export default AddEventsForm;
