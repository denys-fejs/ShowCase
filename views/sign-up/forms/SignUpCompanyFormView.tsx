import { useTranslation } from 'react-i18next';

import { ISignUpCompanyForm } from 'types';
import { SignUpCompanySchema } from 'validators/auth';
import SignUpBaseFormView from './SignUpBaseFormView';
import { Col, FormField, DocumentUploadInput, Divider } from 'components';
import { DOCUMENT_ACCEPT } from 'constants/documents';

interface IProps {
  onSubmit: (values: ISignUpCompanyForm) => unknown;
}

const initialValues = { isAgreedToTerms: false };

const SignUpCompanyFormView = ({ onSubmit }: IProps) => {
  const { t } = useTranslation('views/sign-up');

  const handleSubmit = async (values: ISignUpCompanyForm) => {
    await onSubmit(values);
  };

  return (
    <SignUpBaseFormView onSubmit={handleSubmit} validationSchema={SignUpCompanySchema} initialValues={initialValues}>
      <Col>
        <Divider>{t('form.kycDocuments')}</Divider>
      </Col>
      <Col>
        <FormField
          name='companyLegalDocuments'
          inputComponent={DocumentUploadInput}
          label={t('form.companyLegalDocuments')}
          placeholder={t('form.documentPlaceholder')}
          accept={DOCUMENT_ACCEPT}
          requried
        />
      </Col>
      <Col>
        <FormField
          name='founderLegalDocuments'
          inputComponent={DocumentUploadInput}
          label={t('form.founderLegalDocuments')}
          placeholder={t('form.documentPlaceholder')}
          accept={DOCUMENT_ACCEPT}
          requried
        />
      </Col>
    </SignUpBaseFormView>
  );
};

export default SignUpCompanyFormView;
