import { useTranslation } from 'react-i18next';

import { ISignInForm, RowSpace } from 'types';
import { SignInSchema } from 'validators/auth';
import { Col, Form, FormField, FormSubmitButton, IconSvg, Row } from 'components';

import styles from './SignInFormView.module.scss';

interface IProps {
  onSubmit: (values: ISignInForm) => unknown;
}

const SignInFormView = ({ onSubmit }: IProps) => {
  const { t } = useTranslation('views/sign-in');

  const handleSubmit = async (values: ISignInForm) => {
    await onSubmit(values);
  };

  return (
    <Form onSubmit={handleSubmit} validationSchema={SignInSchema} submitOnEnter>
      <Row verticalSpace={RowSpace.Small} className={styles.signInForm}>
        <Col>
          <FormField
            name='email'
            prefix={<IconSvg icon='mail' />}
            fieldlabel={t('form.email')}
            placeholder={t('form.email')}
          />
        </Col>
        <Col>
          <FormField
            name='password'
            prefix={<IconSvg icon='key' />}
            type='password'
            fieldlabel={t('form.password')}
            placeholder={t('form.password')}
          />
        </Col>
        <FormSubmitButton className={styles.signInFormSubmit}>{t('form.submit')}</FormSubmitButton>
      </Row>
    </Form>
  );
};

export default SignInFormView;
