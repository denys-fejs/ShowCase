import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useStoreState } from 'easy-peasy';

import { IStoreModel, IUpdateProfileForm, IUserProfileResponseBody, RowSpace } from 'types';
import { UpdateProfileSchema } from 'validators/user';
import { Col, Form, FormField, FormSubmitButton, IconSvg, Row } from 'components';

import styles from './UpdateUserFormView.module.scss';

interface IProps {
  onSubmit: (values: IUpdateProfileForm) => Promise<unknown>;
}

const UpdateUserFormView = ({ onSubmit }: IProps) => {
  const { t } = useTranslation('views/profile');
  const userProfile = useStoreState<IStoreModel, IUserProfileResponseBody | null>((store) => store.user.profile);

  const initialValues = useMemo(() => {
    return {
      name: userProfile?.name,
      surname: userProfile?.surname,
      phoneNumber: userProfile?.phoneNumber,
    };
  }, [userProfile]);

  return (
    <Form initialValues={initialValues} onSubmit={onSubmit} validationSchema={UpdateProfileSchema}>
      <Row verticalSpace={RowSpace.ExtraSmall} horizontalSpace={RowSpace.Small}>
        <Col span={12}>
          <FormField name='name' placeholder={t('form.name')} fieldlabel={t('form.name')} required />
        </Col>
        <Col span={12}>
          <FormField name='surname' placeholder={t('form.surname')} fieldlabel={t('form.surname')} required />
        </Col>
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
          <FormSubmitButton className={styles.button}>{t('form.submit')}</FormSubmitButton>
        </Col>
      </Row>
    </Form>
  );
};

export default UpdateUserFormView;
