import { useContext, useEffect, useRef } from 'react';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { useTranslation } from 'react-i18next';
import { FormikProps } from 'formik';

import useAuthRole from 'hooks/useAuthRole';
import { UserRole } from 'constants/user';
import { CompanyStatus, NotificationTypes } from 'constants/index';
import { ICompanyDetailsResponseBody, ICompanyForm, IStoreModel } from 'types';
import { MainLoader, Notification, PrimaryButton, SecondaryButton } from 'components';

import BasicSearchHeader from 'views/common/headers/basic-search-header/BasicSearchHeader';
import MainLayoutContext from 'views/common/layouts/main-layout/basic/BasicMainLayoutContext';

import CreateCompanyFormView from './create-company-form/CreateCompanyFormView';

import styles from './MyCompanyView.module.scss';
import bgImage from 'resources/images/bg/tristan-create-project-layout.png';
import SectionHeader from '../common/headers/section-header/SectionHeader';
import CompanyStatusView from './company-status/CompanyStatusView';

const MyCompanyView = () => {
  useAuthRole({ isAuthRequired: true, rolesRequired: [UserRole.Company] });

  const { t } = useTranslation(['views/company', 'common']);
  const formRef = useRef<FormikProps<ICompanyForm>>(null);
  const { setSubFooter } = useContext(MainLayoutContext);

  const userCompany = useStoreState<IStoreModel, ICompanyDetailsResponseBody | null>((store) => store.company.company);
  const isCompanyLoading = useStoreState<IStoreModel, boolean>((store) => store.company.isCompanyLoading);

  const loadCompany = useStoreActions<IStoreModel>((actions) => actions.company.loadCompany);
  const updateCompany = useStoreActions<IStoreModel>((actions) => actions.company.updateCompany);
  const submitCompany = useStoreActions<IStoreModel>((actions) => actions.company.submitCompany);

  const isEditable = !!userCompany && ![CompanyStatus.Pending, CompanyStatus.InReview].includes(userCompany.status);

  useEffect(loadCompany, []);

  useEffect(() => {
    if (setSubFooter && isEditable) {
      setSubFooter(
        <div className={styles.buttonsContainer}>
          <SecondaryButton
            className={styles.actionButton}
            onClick={() => formRef?.current?.handleSubmit()}
            size='large'
          >
            {t('common:common.save')}
          </SecondaryButton>
          <PrimaryButton className={styles.actionButton} onClick={handleSubmit}>
            {t('common:common.submit')}
          </PrimaryButton>
        </div>,
      );
    }

    return () => {
      setSubFooter && setSubFooter(null);
    };
  }, [setSubFooter, isEditable, t]);

  const handleUpdate = async (values: ICompanyForm): Promise<void> => {
    await updateCompany(values);
    Notification({
      key: 'myCompanyUpdated',
      notificationType: NotificationTypes.Success,
      message: t('common:common.success'),
      description: t('companyUpdated'),
    });
  };

  const handleSubmit = async (): Promise<void> => {
    const errors = await formRef?.current?.validateForm();

    if (formRef?.current?.values && (!errors || Object.values(errors).length === 0)) {
      await updateCompany(formRef.current.values);
      await submitCompany();
      Notification({
        key: 'myCompanySubmitted',
        notificationType: NotificationTypes.Success,
        message: 'Success',
        description: t('companySubmitted'),
      });
      loadCompany();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.backgroundImage} style={{ backgroundImage: `url("${bgImage}")` }} />
      <div className={styles.header}>
        <BasicSearchHeader />
      </div>
      <div className={styles.content}>
        <SectionHeader>{t('myCompany')}</SectionHeader>
        <div className={styles.formContainer}>
          <MainLoader isLoading={isCompanyLoading}>
            {userCompany && (
              <>
                <CompanyStatusView company={userCompany} />
                <CreateCompanyFormView
                  formRef={formRef}
                  company={userCompany}
                  handleUpdate={handleUpdate}
                  disabled={!isEditable}
                />
              </>
            )}
          </MainLoader>
        </div>
      </div>
    </div>
  );
};

export default MyCompanyView;
