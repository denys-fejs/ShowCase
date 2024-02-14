import { memo, ReactNode, useCallback } from 'react';
import cn from 'classnames';
import Flags from 'country-flag-icons/react/3x2';
import { Form, Select, SelectProps, Tooltip } from 'antd';
import { CaretDownOutlined, CloseCircleOutlined } from '@ant-design/icons';

import { Icons } from 'types/components/icons';
import { IBasicInputProps, ISelectInputOption } from 'types/components/inputs';
import IconSvg from 'components/icons';

import styles from './SelectInput.module.scss';
import { FieldAttributes } from 'formik';

interface IProps
  extends IBasicInputProps<string>,
    Omit<SelectProps<string>, 'name' | 'onChange' | 'onBlur' | 'placeholder'> {
  icon?: Icons;
  options: Array<ISelectInputOption>;
  showTooltip?: boolean;
  setIsOpen?: (_: boolean) => void;
  isOpen?: boolean;
  emptyContent?: ReactNode;
  fieldlabel?: string;
  field?: FieldAttributes<any>;
  isProjectsFilter?: boolean;
  allowClear?: boolean;
}

const SelectInput = ({
  name,
  label,
  options,
  error,
  onChange,
  className = '',
  size = 'middle',
  showTooltip = false,
  value,
  icon,
  setIsOpen,
  isOpen,
  emptyContent,
  isProjectsFilter = false,
  filterOption,
  fieldlabel,
  allowClear = false,
  ...rest
}: IProps) => {
  const handleChange = (value: string) => {
    onChange && onChange(value);
  };

  const handleFilter = useCallback((input, option) => {
    return (
      option.props.content?.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
      option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
    );
  }, []);

  const renderOptions = () => {
    return options.map(({ value, content = value }, index) => {
      const Flag = Flags[value] ? Flags[value] : null;
      return (
        <Select.Option key={`${name}-option-${index}`} value={value} content={content}>
          {Flag && <Flag className={styles.flag} />}
          {showTooltip ? (
            <Tooltip
              title={content}
              overlayStyle={{ maxWidth: 520 }}
              mouseEnterDelay={1}
              placement='topLeft'
              overlayClassName={styles.tooltip}
            >
              {content || emptyContent}
            </Tooltip>
          ) : (
            content || emptyContent
          )}
        </Select.Option>
      );
    });
  };

  return (
    <Form.Item
      name={name}
      label={label}
      help={error}
      validateStatus={error ? 'error' : ''}
      className={cn(styles.container, className, {
        [styles.borderVisible]: value && fieldlabel,
        [styles.standardField]: !isProjectsFilter,
      })}
    >
      <>
        {value && <div className={styles.fieldLabel}>{fieldlabel}</div>}
        {icon && (
          <div className={styles.icon}>
            <IconSvg icon={icon} />
          </div>
        )}
        <Select
          {...rest}
          value={value || undefined}
          onChange={handleChange}
          className={cn(className, styles.select, styles[size])}
          size={size}
          onDropdownVisibleChange={() => setIsOpen && setIsOpen(!isOpen)}
          bordered={false}
          clearIcon={<CloseCircleOutlined />}
          suffixIcon={<CaretDownOutlined className={styles.arrow} />}
          filterOption={filterOption || handleFilter}
          allowClear={allowClear}
        >
          {renderOptions()}
        </Select>
      </>
    </Form.Item>
  );
};

export default memo(SelectInput);
