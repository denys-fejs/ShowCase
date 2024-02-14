import { Col, Form, FormField, FormSubmitButton, IconSvg, Row } from 'components';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { IForgotPasswordForm, RowSpace } from 'types';
import { EmailSchema } from 'validators/auth';

import styles from './PasswordFormView.module.scss';

interface IProps {
  onSubmit: (email: string) => void;
  isLoading: boolean;
}

const ForgotPasswordFromView = ({ onSubmit, isLoading }: IProps) => {
  const { t } = useTranslation('views/forgot-password');

  const handleSubmit = useCallback((values: IForgotPasswordForm) => onSubmit(values.email), [onSubmit]);

  return (
    <Form onSubmit={handleSubmit} validationSchema={EmailSchema} submitOnEnter>
      <Row verticalSpace={RowSpace.Small} className={styles.forgotPasswordForm}>
        <Col>
          <FormField
            name='email'
            prefix={<IconSvg icon='mail' />}
            placeholder={t('form.email')}
            fieldlabel={t('form.email')}
          />
        </Col>
        <Col>
          <FormSubmitButton isLoading={isLoading}>{t('form.submit')}</FormSubmitButton>
        </Col>
      </Row>
    </Form>
  );
};

export default ForgotPasswordFromView;
