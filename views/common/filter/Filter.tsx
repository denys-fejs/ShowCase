import { memo, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import isEmpty from 'lodash.isempty';
import omit from 'lodash.omit';
import { IFilterOptionsConfig } from 'types/components/filter';
import projectsBanner from 'resources/images/bg/projectsBanner.png';
import { IconSvg, SideBar } from 'components';
import SelectedFilters from 'views/projects/selected-filters/SelectedFilters';
import FilterSearchSelect from './filter-search-select/FilterSearchSelect';
import FilterContext from './FilterContext';

//styles
import styles from './Filter.module.scss';

interface IFilterProps {
  filterConfig: Array<IFilterOptionsConfig>;
  withSideBar?: boolean;
}

const Filter = ({ filterConfig, withSideBar = false }: IFilterProps) => {
  const { t } = useTranslation('views/projects');

  const [sideBarVisible, setSideBarVisibility] = useState<boolean>(false);
  const { queryParams } = useContext(FilterContext);
  const selectedParams = omit(queryParams, ['search', 'limit', 'sortBy', 'sortOrder']);

  const toggleSideBar = () => setSideBarVisibility(!sideBarVisible);

  return (
    <div className={styles.container} style={!isEmpty(selectedParams) ? { height: '445px' } : {}}>
      <div className={styles.banner} style={{ backgroundImage: `url(${projectsBanner})` }}>
        <div className={styles.title}>{t(`main.title`)}</div>

        <div className={styles.filterWrapper}>
          <div className={styles.filtersAndSelected}>
            <div className={styles.ddWrapper}>
              {filterConfig.map((filterOption: IFilterOptionsConfig) => (
                <div className={styles.dropDown} key={filterOption.filterName}>
                  <FilterSearchSelect
                    filterName={filterOption.filterName}
                    icon={filterOption.icon}
                    options={filterOption.options}
                    placeholder={t(`${filterOption.placeholder}`)}
                    selectMode={filterOption.selectMode}
                    disabled={filterOption.disabled}
                    mapValueToLabel={filterOption.mapValueToLabel}
                    allowClear={filterOption.filterName === 'standard'}
                  />
                </div>
              ))}
            </div>
            {withSideBar && (
              <button className={styles.filterBtn} onClick={toggleSideBar}>
                <IconSvg icon='filter' />
              </button>
            )}
          </div>
          {Object.values(selectedParams).some((item: any) => item && item.length > 0) && (
            <div className={styles.selectedFilters}>
              <SelectedFilters selectedFilters={selectedParams} />
            </div>
          )}
        </div>
      </div>
      {withSideBar && <SideBar toggleSideBar={toggleSideBar} isVisible={sideBarVisible} />}
    </div>
  );
};

export default memo(Filter);
