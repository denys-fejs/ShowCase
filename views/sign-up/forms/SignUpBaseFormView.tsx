import { useStoreState } from 'easy-peasy';
import { ReactNode } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { Row, Col, Form, FormField, FormSubmitButton, CheckboxInput, IconSvg, Divider } from 'components';
import { Routes } from 'constants/routes';
import { IFormProps, IStoreModel, IWalletState, RowSpace } from 'types';

import styles from './SignUpForm.module.scss';

interface IProps extends IFormProps {
  children?: ReactNode;
}

const SignUpBaseFormView = ({ children, ...rest }: IProps) => {
  const { t } = useTranslation('views/sign-up');
  const wallet = useStoreState<IStoreModel, IWalletState>((store) => store.blockchain.wallet);

  return (
    <Form {...rest}>
      <Row verticalSpace={RowSpace.ExtraSmall} horizontalSpace={RowSpace.Small} className={styles.signUpBaseForm}>
        <Col>
          <FormField
            name='accountAddress'
            placeholder={t('form.accountAddress')}
            fieldlabel={t('form.accountAddress')}
            prefix={<IconSvg icon='metamask' />}
            defaultValue={wallet?.walletAddress || undefined}
            className={styles.metamask}
            required
          />
        </Col>
        <Divider color='white' className={styles.dividerMargin} />
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
        <Col>
          <FormField
            name='email'
            placeholder={t('form.email')}
            fieldlabel={t('form.email')}
            prefix={<IconSvg icon='mail' />}
            required
          />
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
            name='companyName'
            placeholder={t('form.companyName')}
            fieldlabel={t('form.companyName')}
            prefix={<IconSvg icon='company' />}
            required
          />
        </Col>
        <Col>
          <FormField
            name='userPosition'
            placeholder={t('form.userPosition')}
            fieldlabel={t('form.userPosition')}
            required
          />
        </Col>
        <Col span={12}>
          <FormField name='name' placeholder={t('form.name')} fieldlabel={t('form.name')} required />
        </Col>
        <Col span={12}>
          <FormField name='surname' placeholder={t('form.surname')} fieldlabel={t('form.surname')} required />
        </Col>
        {children}
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

export default SignUpBaseFormView;
