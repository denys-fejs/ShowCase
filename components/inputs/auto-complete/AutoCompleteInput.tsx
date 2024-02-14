import { useState } from 'react';
import { AutoComplete } from 'antd';
import IconSvg from 'components/icons';
import { Icons } from 'types/components/icons';
import { IBasicInputProps } from 'types/components/inputs';

//styles
import styles from './AutoCompleteInput.module.scss';
interface IPropsTypes extends IBasicInputProps<string> {
  options: Array<any>;
  icon?: Icons;
}

const AutoCompleteInput = ({ icon, options = [], placeholder }: IPropsTypes) => {
  const [value, setValue] = useState('');
  const onSearch = (searchText: string) => {
    console.log('search', searchText);
  };
  const onSelect = (data: string) => {
    console.log('onSelect', data);
  };
  const onChange = (data: string) => {
    setValue(data);
  };
  return (
    <div className={styles.container}>
      <div className={styles.iconWrapper}>{icon && <IconSvg icon={icon} />}</div>
      <AutoComplete
        value={value}
        options={options}
        className={styles.autoComplete}
        onSelect={onSelect}
        onSearch={onSearch}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
};

export default AutoCompleteInput;
