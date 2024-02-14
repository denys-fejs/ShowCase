import { useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { mapSortingParams, mapSortOrderParams, SortingOrder, SortingTypes } from 'types';
import { BasicDropdown } from 'components';
import styles from './SortingSelectView.module.scss';
import { IDropdownItem } from 'types/components/dropdowns';
import FilterContext from 'views/common/filter/FilterContext';

const SortingSelectView = () => {
  const { t } = useTranslation('views/common');
  const { setParams } = useContext(FilterContext);
  const [sorting, setSorting] = useState<SortingTypes | null>(null);
  const [sortOrder, setSortOrder] = useState<SortingOrder | null>(null);

  const handleSortingClick = (value: SortingTypes) => {
    setSorting(value);
  };
  const handleSortOrderClick = (value: SortingOrder) => {
    setSortOrder(value);
  };

  const items = useMemo<Array<IDropdownItem>>(() => {
    return Object.values(SortingTypes).map((value) => {
      return {
        content: t(value),
        onClick: () => handleSortingClick(value),
      };
    });
  }, [SortingTypes]);

  const orderItems = useMemo<Array<IDropdownItem>>(() => {
    return Object.values(SortingOrder).map((value) => {
      return {
        content: t(value),
        onClick: () => handleSortOrderClick(value),
      };
    });
  }, [SortingTypes]);

  useEffect(() => {
    sorting && setParams(mapSortingParams[sorting]);
    sortOrder && setParams(mapSortOrderParams[sortOrder]);
  }, [sorting, sortOrder]);

  return (
    <div className={styles.container}>
      <BasicDropdown name='SortBySelect' items={items} placement='bottomCenter' className={styles.dropdownSortBy}>
        {sorting ? t(`${sorting}`) : t(SortingTypes.Date)}
      </BasicDropdown>
      <BasicDropdown name='SortOrderSelect' items={orderItems} placement='bottomCenter'>
        {sortOrder ? t(`${sortOrder}`) : t(SortingOrder.DESC)}
      </BasicDropdown>
    </div>
  );
};

export default SortingSelectView;
