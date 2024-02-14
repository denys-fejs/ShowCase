import { ISignUpProjectForm } from 'types';
import SignUpBaseFormView from './SignUpBaseFormView';
import { SignUpBaseSchema } from 'validators/auth';

interface IProps {
  onSubmit: (values: ISignUpProjectForm) => Promise<unknown>;
}

const initialValues = { isAgreedToTerms: false };

const SignUpProjectFormView = ({ onSubmit }: IProps) => {
  return <SignUpBaseFormView onSubmit={onSubmit} initialValues={initialValues} validationSchema={SignUpBaseSchema} />;
};

export default SignUpProjectFormView;
