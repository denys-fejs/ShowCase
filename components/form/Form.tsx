import { memo, useCallback } from 'react';
import { Form as FormikForm, Formik, FormikHelpers } from 'formik';
import { IFormProps } from 'types';

import { ErrorHandlerService } from '../error';

const Form = ({ validationSchema, onSubmit, initialValues = {}, children, formRef, submitOnEnter }: IFormProps) => {
  const handleSubmit = useCallback(
    async (values: any, formikHelpers: FormikHelpers<any>) => {
      try {
        return await onSubmit(values, formikHelpers);
      } catch (error) {
        ErrorHandlerService.handleError(error);
      }
    },
    [onSubmit],
  );

  return (
    <Formik
      enableReinitialize
      validateOnBlur={false}
      validateOnChange={false}
      innerRef={formRef}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
    >
      {(form) => (
        <FormikForm
          noValidate
          onKeyDown={(e) => {
            if (submitOnEnter && e.key === 'Enter') {
              form.handleSubmit();
            }
          }}
        >
          {typeof children === 'function' ? children(form) : children}
        </FormikForm>
      )}
    </Formik>
  );
};

export default memo(Form);
