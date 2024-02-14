import React, { useContext, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FormikProps } from 'formik';
import { IPoolForm, IPoolUpdateRequestBody, RowSpace } from 'types';
import MainLayoutContext from 'views/common/layouts/main-layout/basic/BasicMainLayoutContext';
import styles from './CreatePoolForm.module.scss';
import { Col, Form, FormField, PrimaryButton, Row, SecondaryButton, SelectInput, TextAreaInput } from 'components';
import { Routes } from 'constants/index';
import { useHistory } from 'react-router';
import { PoolSchema } from 'validators/pool';
import { countiesOptions, projectStandardOptions, projectTypesOptions } from 'views/projects/ProjectFilterConfig';
import TokenTickerHelpView from 'views/my-project/create-project/token-ticker-help/TokenTickerHelpView';
import { buildInitialValues } from 'utils';

interface IProps {
  handleSubmit: (values: IPoolUpdateRequestBody) => Promise<void>;
  poolDetails?: IPoolUpdateRequestBody | any;
}

const CreatePoolForm = ({ handleSubmit, poolDetails = {} }: IProps) => {
  const history = useHistory();
  const { t } = useTranslation('views/pools');
  const formRef = useRef<FormikProps<IPoolForm>>(null);
  const { setSubFooter } = useContext(MainLayoutContext);
  const onSubmit = () => {
    if (formRef.current) {
      formRef.current.handleSubmit();
    }
  };
  const goBack = () => {
    history.push(Routes.adminPools);
  };

  const initialValues = useMemo(() => {
    return poolDetails && buildInitialValues<any>(PoolSchema, poolDetails);
  }, [poolDetails]);

  useEffect(() => {
    setSubFooter &&
      setSubFooter(
        <div className={styles.buttonsContainer}>
          <SecondaryButton className={styles.actionButtonCancel} onClick={goBack} size='large'>
            {t('form.cancel')}
          </SecondaryButton>
          <PrimaryButton onClick={onSubmit} className={styles.actionButton}>
            {t('form.submit')}
          </PrimaryButton>
        </div>,
      );

    return () => {
      setSubFooter && setSubFooter(null);
    };
  }, [setSubFooter, t]);

  return (
    <div>
      <Form initialValues={initialValues} validationSchema={PoolSchema} onSubmit={handleSubmit} formRef={formRef}>
        <div className={styles.poolFormContainer}>
          <Row verticalSpace={RowSpace.ExtraSmall} horizontalSpace={RowSpace.Small}>
            <Col>
              <FormField name='name' placeholder={t('form.name')} fieldlabel={t('form.name')} required />
            </Col>
            <Col>
              <FormField
                name='country'
                placeholder={t('form.country')}
                fieldlabel={t('form.country')}
                inputComponent={SelectInput}
                options={countiesOptions}
                mode='multiple'
                showSearch
                required
              />
            </Col>
            <Col>
              <FormField
                name='standard'
                placeholder={t('form.standard')}
                fieldlabel={t('form.standard')}
                inputComponent={SelectInput}
                options={projectStandardOptions}
                mode='multiple'
                showSearch
                required
              />
            </Col>
            <Col>
              <FormField
                name='type'
                placeholder={t('form.type')}
                fieldlabel={t('form.type')}
                inputComponent={SelectInput}
                options={projectTypesOptions}
                mode='multiple'
                showSearch
                required
              />
            </Col>
            <Col>
              <FormField
                name='tokenName'
                placeholder={t('form.tokenName')}
                fieldlabel={t('form.tokenName')}
                required
                disabled={poolDetails?.tokenName}
              />
            </Col>
            <Col>
              <FormField
                name='tokenTicker'
                placeholder={t('form.tokenTicker')}
                fieldlabel={t('form.tokenTicker')}
                help={poolDetails?.tokenTicker ? null : <TokenTickerHelpView poolRequest={true} />}
                disabled={poolDetails?.tokenTicker}
                required
              />
            </Col>
            <Col>
              <FormField
                name='description'
                type='text'
                placeholder={t('form.description')}
                inputComponent={TextAreaInput}
                fieldlabel={t('form.description')}
                autoSize={{ minRows: 1, maxRows: 10 }}
                required
              />
            </Col>
          </Row>
        </div>
      </Form>
    </div>
  );
};

export default CreatePoolForm;
