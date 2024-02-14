import { ComponentType, memo, ReactNode, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Field, FieldAttributes, useField, useFormikContext } from 'formik';

import { TextInput } from 'components/inputs';
import { IBasicInputProps } from 'types/components/inputs';
import IconSvg from 'components/icons/index';
import { Icons } from 'types/components/icons';

//styles
import styles from './FormField.module.scss';

interface IProps extends FieldAttributes<any> {
  name: string;
  label?: ReactNode;
  placeholder?: string;
  inputComponent?: ComponentType<IBasicInputProps<any> & any>;
  disabled?: boolean;
  required?: boolean;
  fieldlabel?: string;
  icon?: Icons;
  defaultValue?: string | number | boolean;
}

const FormField = ({
  name,
  inputComponent: InputComponent = TextInput,
  disabled = false,
  required = false,
  label,
  placeholder,
  icon,
  fieldlabel,
  defaultValue,
  ...rest
}: IProps) => {
  const { t } = useTranslation();
  const { isSubmitting, setFieldTouched } = useFormikContext();
  const [field, meta, helpers] = useField(name);
  const error = typeof meta.error === 'string' ? t(meta.error) : meta.error;

  useEffect(() => {
    if (defaultValue) {
      helpers.setValue(defaultValue);
    }
  }, [defaultValue]);

  const handleChange = useCallback(
    (value: unknown) => {
      helpers.setValue(value);
      setFieldTouched(field.name);
    },
    [helpers.setValue],
  );

  const handleBlur = useCallback(() => {
    helpers.setTouched(true);
  }, [helpers.setTouched]);

  return (
    <div className={styles.formFieldWrapper}>
      {icon && (
        <div className={styles.icon}>
          <IconSvg icon={icon} />
        </div>
      )}
      <Field
        component={InputComponent}
        name={name}
        error={error}
        icon={icon}
        label={typeof label === 'string' && required ? `${label}*` : label}
        placeholder={placeholder && required ? `${placeholder}*` : placeholder}
        disabled={isSubmitting || disabled}
        onChange={handleChange}
        onBlur={handleBlur}
        fieldlabel={fieldlabel}
        value={field.value}
        {...rest}
      />
    </div>
  );
};

export default memo(FormField);
