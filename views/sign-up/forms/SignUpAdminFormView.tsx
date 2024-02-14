import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { CheckboxInput, Col, Form, FormField, FormSubmitButton, Row, IconSvg } from 'components';
import { Routes } from 'constants/routes';
import { ISignUpAdminForm } from 'types/forms/auth';
import { SignUpAdminSchema } from 'validators/auth';
import { IFormProps } from 'types/components/form';
import { RowSpace } from 'types/components/grid';

interface IProps extends IFormProps {
  onSubmit: (values: ISignUpAdminForm) => Promise<unknown>;
}

const initialValues = { isAgreedToTerms: false };

const SignUpAdminFormView = ({ onSubmit }: IProps) => {
  const { t } = useTranslation('views/sign-up');

  return (
    <Form onSubmit={onSubmit} initialValues={initialValues} validationSchema={SignUpAdminSchema}>
      <Row verticalSpace={RowSpace.ExtraSmall} horizontalSpace={RowSpace.Small}>
        <Col>
          <FormField
            name='phoneNumber'
            type='number'
            placeholder={t('form.phoneNumber')}
            fieldlabel={t('form.phoneNumber')}
            prefix={<IconSvg icon='phone' />}
            required
          />
        </Col>
        <Col span={12}>
          <FormField name='name' placeholder={t('form.name')} fieldlabel={t('form.name')} required />
        </Col>
        <Col span={12}>
          <FormField name='surname' placeholder={t('form.surname')} fieldlabel={t('form.surname')} required />
        </Col>
        <Col>
          <FormField
            name='password'
            type='password'
            placeholder={t('form.password')}
            fieldlabel={t('form.password')}
            prefix={<IconSvg icon='key' />}
            required
          />
        </Col>
        <Col>
          <FormField
            name='passwordConfirm'
            type='password'
            placeholder={t('form.passwordConfirm')}
            fieldlabel={t('form.passwordConfirm')}
            prefix={<IconSvg icon='key' />}
            required
          />
        </Col>
        <Col>
          <FormField
            name='accountAddress'
            placeholder={t('form.accountAddress')}
            fieldlabel={t('form.accountAddress')}
            prefix={<IconSvg icon='metamask' />}
            required
          />
        </Col>
        <Col>
          <FormField
            name='isAgreedToTerms'
            inputComponent={CheckboxInput}
            label={
              <Trans
                t={t}
                i18nKey='form.terms'
                components={[<Link key='terms' to={Routes.terms} />, <Link key='privacy' to={Routes.privacy} />]}
              />
            }
          />
        </Col>
        <Col>
          <FormSubmitButton>{t('form.submit')}</FormSubmitButton>
        </Col>
      </Row>
    </Form>
  );
};

export default SignUpAdminFormView;
