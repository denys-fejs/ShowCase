import { memo, ReactNode, useEffect, useState } from 'react';
import cn from 'classnames';
import { SelectInput } from 'components';

import styles from './LocationSearchSelect.module.scss';
import { Icons, ISearchSelectLocationData, ISelectOptionWithData } from 'types';
import { useDebounce } from 'hooks';
import projectLocationsAPI from 'api/project/projectLocationAPI';
import { formatLocation } from 'utils';

interface ILocationOptionsConfig {
  className?: string;
  options?: Array<ISelectOptionWithData<ISearchSelectLocationData>>;
  icon?: Icons;
  placeholder: string;
  disabled?: boolean;
  mapValueToLabel?: boolean;
  emptyContent?: ReactNode;
  isProjectsFilter?: boolean;
  showSearch?: boolean;
  setAddressValues: (_: ISearchSelectLocationData) => void;
  country: string;
  fieldlabel?: string;
}

const LocationSearchSelect = ({
  icon,
  placeholder,
  emptyContent,
  className = '',
  showSearch = false,
  setAddressValues,
  fieldlabel = '',
}: ILocationOptionsConfig) => {
  const [option, setOption] = useState<any>('');
  const [selectedOption, setSelectedOption] = useState<any>('');
  const [options, setOptions] = useState<Array<ISelectOptionWithData<ISearchSelectLocationData>>>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const debouncedValue = useDebounce(option);

  useEffect(() => {
    debouncedValue &&
      projectLocationsAPI.getLocationOptions({ address: ` ${debouncedValue}` }).then((data) => {
        const array: Array<ISelectOptionWithData<ISearchSelectLocationData>> = [];
        data.places.map((item) => {
          array.push({
            value: formatLocation(item),
            content: formatLocation(item),
            data: item,
          });
        });
        setOptions(array);
      });
  }, [debouncedValue]);

  const handleSearch = (evt: any) => {
    setOption(evt);
  };

  const handleSelect = (evt: any) => {
    setSelectedOption(evt);
    const optionData = options.find((item) => item.value === evt);
    optionData && optionData.data !== undefined && setAddressValues(optionData.data);
  };

  return (
    <div>
      <SelectInput
        className={cn({ [styles.hasIcon]: !!icon }, className)}
        options={options}
        showArrow
        icon={icon}
        placeholder={placeholder}
        value={selectedOption}
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        emptyContent={emptyContent}
        showSearch={showSearch}
        onSearch={handleSearch}
        onSelect={handleSelect}
        filterOption={() => true}
        fieldlabel={fieldlabel}
      />
    </div>
  );
};

export default memo(LocationSearchSelect);
