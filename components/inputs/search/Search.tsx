import { useState, useEffect, memo } from 'react';
import { AutoComplete } from 'antd';
import { SizeType } from 'antd/lib/config-provider/SizeContext';
import cn from 'classnames';

import { useDebounce } from 'hooks';
import IconSvg from 'components/icons';
import { Icons } from 'types/components/icons';
import { IBasicInputProps } from 'types/components/inputs';

import styles from './Search.module.scss';

interface IPropsTypes extends IBasicInputProps<string> {
  options: Array<any>;
  icon?: Icons;
  onSearch: (value: string) => void;
  selectedValue?: string;
  size?: SizeType;
  className?: string;
}

const Search = ({
  icon,
  options = [],
  placeholder,
  onSearch,
  selectedValue = '',
  size = 'middle',
  className = '',
}: IPropsTypes) => {
  const [value, setValue] = useState(selectedValue);

  const debouncedSearchValue = useDebounce(value);

  useEffect(() => {
    setValue(selectedValue);
  }, [selectedValue]);

  useEffect(() => {
    if (debouncedSearchValue !== undefined) {
      onSearch(value);
    }
  }, [debouncedSearchValue]);

  const onSelect = (data: string) => {
    console.log('onSelect', data);
  };
  const onChange = (data: string) => {
    setValue(data);
  };
  return (
    <div className={cn(styles.search, styles[size], className)}>
      <div className={styles.iconWrapper}>{icon && <IconSvg icon={icon} />}</div>
      <AutoComplete
        value={value}
        options={options}
        onSelect={onSelect}
        onSearch={setValue}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
};

export default memo(Search);
