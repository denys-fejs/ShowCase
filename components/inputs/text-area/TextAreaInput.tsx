import { ChangeEvent, memo, useState } from 'react';
import { Form, Input } from 'antd';
import { TextAreaProps } from 'antd/es/input';
import cn from 'classnames';
import { IBasicInputProps } from 'types/components/inputs';
import { FieldAttributes } from 'formik';

import styles from './TextAreaInput.module.scss';

interface IProps extends IBasicInputProps<string>, Omit<TextAreaProps, 'name' | 'onChange' | 'onBlur'> {
  fieldlabel?: string;
  field?: FieldAttributes<any>;
}

const TextAreaInput = ({
  name,
  label,
  error,
  onChange,
  className = '',
  size = 'middle',
  fieldlabel = '',
  field = '',
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
      help={error}
      validateStatus={error ? 'error' : ''}
      className={styles.container}
    >
      {(value || focus) && <div className={styles.fieldLabel}>{fieldlabel}</div>}
      <Input.TextArea
        {...rest}
        size={size}
        className={cn(className, styles.textarea, styles[size], {
          [styles.borderVisible]: value || focus,
        })}
        onChange={handleChange}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
      />
    </Form.Item>
  );
};

export default memo(TextAreaInput);
