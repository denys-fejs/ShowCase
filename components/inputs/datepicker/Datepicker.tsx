import { memo, useState } from 'react';
import moment, { Moment } from 'moment';
import { DatePicker, DatePickerProps, Form } from 'antd';
import cn from 'classnames';

import { IBasicInputProps } from 'types/components/inputs';

//styles
import styles from './Datepicker.module.scss';
import { FieldAttributes } from 'formik';

interface IProps extends IBasicInputProps<Moment | null>, Omit<DatePickerProps, 'name' | 'onChange' | 'onBlur'> {
  field?: FieldAttributes<any>;
  fieldlabel?: string;
  showTime?: boolean;
}

const DatePickerInput = ({
  error,
  onChange,
  className = '',
  showTime,
  value,
  fieldlabel = '',
  field = '',
  ...rest
}: IProps) => {
  const [pickedValue, setPickedValue] = useState(field?.value || null);
  const [focus, setFocus] = useState(false);
  const handleChange = (date: Moment | null) => {
    onChange && onChange(date);
    setPickedValue(date);
  };

  const DATE_FORMAT = showTime ? 'DD MMM, yyyy, HH:mm' : 'DD MMM, yyyy';

  return (
    <Form.Item help={error} validateStatus={error ? 'error' : ''}>
      {fieldlabel && (pickedValue || focus) && <div className={styles.fieldLabel}>{fieldlabel}</div>}
      <DatePicker
        {...rest}
        value={value ? moment(value, DATE_FORMAT) : undefined}
        defaultValue={value ? moment(value) : undefined}
        format={DATE_FORMAT}
        onChange={handleChange}
        showTime={showTime && { format: 'HH:mm' }}
        allowClear={false}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        className={cn(styles.datePicker, className, {
          [styles.borderVisible]: fieldlabel && (pickedValue || focus),
        })}
      />
    </Form.Item>
  );
};

export default memo(DatePickerInput);
