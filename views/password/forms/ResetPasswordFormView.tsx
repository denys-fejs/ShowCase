import { Col, Form, FormField, FormSubmitButton, IconSvg, Row } from 'components';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { IResetPasswordForm, RowSpace } from 'types';
import { PasswordSchema } from 'validators/auth';
import styles from './PasswordFormView.module.scss';

interface IProps {
  onSubmit: (password: string) => void;
  isLoading: boolean;
}

const ResetPasswordFromView = ({ onSubmit, isLoading }: IProps) => {
  const { t } = useTranslation('views/reset-password');

  const handleSubmit = useCallback((values: IResetPasswordForm) => onSubmit(values.password), [onSubmit]);

  return (
    <Form onSubmit={handleSubmit} validationSchema={PasswordSchema} submitOnEnter>
      <Row verticalSpace={RowSpace.Small} className={styles.forgotPasswordForm}>
        <Col>
          <FormField
            name='password'
            prefix={<IconSvg icon='key' />}
            type='password'
            placeholder={t('form.password')}
            fieldlabel={t('form.password')}
          />
        </Col>
        <Col>
          <FormSubmitButton isLoading={isLoading}>{t('form.submit')}</FormSubmitButton>
        </Col>
      </Row>
    </Form>
  );
};

export default ResetPasswordFromView;
