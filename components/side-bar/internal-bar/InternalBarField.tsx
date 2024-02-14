import { Checkbox } from 'antd';
import { CheckboxOptionType } from 'antd/lib/checkbox/Group';

const CheckboxGroup = Checkbox.Group;

import styles from './InternalBar.module.scss';

interface IInternalBarFieldProps {
  options: Array<CheckboxOptionType>;
  selectedItems: string[];
  setSelectedItems: (selectedItems: any) => void;
}

const InternalBarField = ({ options, selectedItems, setSelectedItems }: IInternalBarFieldProps) => (
  <div className={styles.checkboxContainer}>
    <CheckboxGroup
      className={styles.checkboxGroup}
      options={options}
      value={selectedItems}
      onChange={setSelectedItems}
    />
  </div>
);

export default InternalBarField;
