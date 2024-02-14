import { memo } from 'react';
import cn from 'classnames';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { Checkbox, CheckboxProps, Form } from 'antd';

import { IBasicInputProps } from 'types/components/inputs';
import styles from './CheckboxInput.module.scss';
import { omit } from 'lodash';

interface IProps extends IBasicInputProps<boolean>, Omit<CheckboxProps, 'name' | 'onChange' | 'onBlur'> {
  itemClassName?: string;
}

const CheckboxInput = ({
  name,
  label,
  error,
  onChange,
  itemClassName,
  className = '',
  value = '',
  ...rest
}: IProps) => {
  const handleChange = ({ target }: CheckboxChangeEvent) => {
    onChange && onChange(target.checked);
  };

  return (
    <Form.Item
      name={name}
      help={error}
      validateStatus={error ? 'error' : ''}
      className={cn(styles.container, itemClassName)}
    >
      <Checkbox
        {...omit(rest, 'value')}
        className={cn(styles.checkbox, className)}
        onChange={handleChange}
        checked={!!value}
      >
        {label}
      </Checkbox>
    </Form.Item>
  );
};

export default memo(CheckboxInput);
