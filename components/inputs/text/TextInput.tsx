import { ChangeEvent, memo, useState } from 'react';
import cn from 'classnames';
import { Form, Input, InputProps } from 'antd';
import { IBasicInputProps } from 'types';

import { FieldAttributes } from 'formik';

import styles from './TextInput.module.scss';

interface IProps extends IBasicInputProps<string>, Omit<InputProps, 'name' | 'onChange' | 'onBlur'> {
  help?: string;
  field?: FieldAttributes<any>;
  fieldlabel?: string;
}

const TextInput = ({
  name,
  label,
  error,
  onChange,
  icon,
  fieldlabel,
  field,
  className = '',
  size = 'middle',
  help,
  ...rest
}: IProps) => {
  const [value, setValue] = useState(field?.value || null);
  const [focus, setFocus] = useState(false);
  const handleChange = ({ target }: ChangeEvent<{ value: string }>) => {
    onChange && onChange(target.value);
    setValue(target.value);
  };

  return (
    <Form.Item
      name={name}
      label={label}
      help={error || help}
      validateStatus={error ? 'error' : ''}
      className={styles.container}
    >
      {fieldlabel && (value || focus) && <div className={styles.fieldLabel}>{fieldlabel}</div>}
      <Input
        {...rest}
        size={size}
        className={cn(
          styles.input,
          styles[size],
          className,
          {
            [styles.icon]: icon,
          },
          {
            [styles.focusedField]: (value || focus) && fieldlabel,
          },
        )}
        onChange={handleChange}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
      />
    </Form.Item>
  );
};

export default memo(TextInput);
