import { memo, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import cn from 'classnames';
import isEmpty from 'lodash.isempty';
import { SelectInput } from 'components';
import { IFilterOptionsConfig } from 'types/components/filter';
import { ISelectInputOption } from 'types/components/inputs';

import FilterContext from '../FilterContext';
import styles from './FilterSearchSelect.module.scss';

const FilterSearchSelect = ({
  filterName,
  options,
  icon,
  placeholder,
  selectMode,
  emptyContent,
  className = '',
  mapValueToLabel = false,
  disabled = false,
  isProjectsFilter = true,
  allowClear = false,
}: IFilterOptionsConfig) => {
  const { setParams, queryParams } = useContext(FilterContext);
  const [, setCurrentOptions] = useState<any>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  useEffect(() => {
    if (!isEmpty(queryParams[filterName])) {
      setCurrentOptions([...queryParams[filterName]]);
    } else {
      setCurrentOptions([]);
    }
  }, [queryParams[filterName]]);

  const tagRenderer = useCallback(() => {
    const filterParam = mapValueToLabel ? getLabelByValue(queryParams[filterName]) : queryParams[filterName];
    if (isEmpty(filterParam)) return <span></span>;
    const moreLabel = queryParams[filterName].length > 1 ? `, ${queryParams[filterName].length - 1} more` : '';
    return (
      <>
        {!isOpen && (
          <span className={styles.tagRender}>
            {filterParam[0]}
            {moreLabel}
          </span>
        )}
      </>
    );
  }, [queryParams[filterName], isOpen]);

  const getLabelByValue = (paramValue: string[]): ReactNode[] | null => {
    if (isEmpty(paramValue)) return null;
    const currentOption = options.find((option: ISelectInputOption) => option.value === paramValue[0]);
    return [currentOption?.content];
  };

  return (
    <div className={styles.selectInputWrapper}>
      <SelectInput
        className={cn(styles.filterInput, { [styles.hasIcon]: !!icon }, className)}
        options={options}
        showArrow
        icon={icon}
        mode={selectMode}
        disabled={disabled}
        tagRender={tagRenderer}
        placeholder={placeholder}
        onChange={(option) => setParams({ [filterName]: option })}
        value={queryParams[filterName]}
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        emptyContent={emptyContent}
        isProjectsFilter={isProjectsFilter}
        allowClear={allowClear}
      />
    </div>
  );
};

export default memo(FilterSearchSelect);
