import { useContext, useEffect, useState } from 'react';
import { Drawer } from 'antd';
import { useTranslation } from 'react-i18next';
import isEmpty from 'lodash.isempty';
import omit from 'lodash.omit';
import SideBarButton from './side-bar-btn';
import InternalBar from './internal-bar';
import { getLocationByCode } from 'utils/locationMapper';
import FilterContext from 'views/common/filter/FilterContext';
import { IconSvg, PrimaryButton, SecondaryButton } from 'components';
import projectAPI from 'api/project/projectAPI';

import styles from './SideBar.module.scss';

interface IPropsTypes {
  toggleSideBar: () => void;
  isVisible: boolean;
}

const SideBar = ({ toggleSideBar, isVisible }: IPropsTypes) => {
  const { t } = useTranslation('views/projects');

  const [isInternalBarVisible, setIsInternalBarVisible] = useState<boolean>(false);
  const [currentFilter, setCurrentFilter] = useState<string>('');
  const [selectedFilters, setFilters] = useState<any>({});
  const [counter, setCounter] = useState<any>('all');
  const { clearQueryParams, queryParams, updateParams } = useContext(FilterContext);
  useEffect(() => {
    setFilters(omit(queryParams, ['limit', 'search', 'sortOrder', 'sortBy']));
  }, [queryParams]);

  useEffect(() => {
    isVisible && projectAPI.getProjectsCount(selectedFilters).then((data) => data.total >= 0 && setCounter(data.total));
  }, [selectedFilters, isVisible]);

  const setSelectedFilters = (filterName: string, selectedOptions: any) => {
    setFilters((prevSelectedFilters: any) => ({ ...prevSelectedFilters, [filterName]: selectedOptions }));
  };

  const footer = (
    <>
      <SecondaryButton
        className={styles.clear}
        onClick={() => {
          clearQueryParams();
          setFilters({});
          toggleSideBar();
        }}
      >
        {t('common.clearAll')}
      </SecondaryButton>
      <PrimaryButton
        onClick={() => {
          updateParams(selectedFilters);
          toggleSideBar();
        }}
      >
        {t('common.counter', { value: counter })}
      </PrimaryButton>
    </>
  );

  const subTitle = (type: string) => {
    let queryParam = queryParams[type];
    if (isEmpty(queryParam)) {
      return '';
    }

    if (type === 'country') {
      queryParam = getLocationByCode(queryParam);
    }

    const moreLabel = queryParam.length > 1 ? `, ${queryParam.length - 1} more` : '';

    return `${queryParam[0]} ${moreLabel}`;
  };

  return (
    <Drawer
      className={styles.drawer}
      title={t('common.allFilters')}
      placement='right'
      closeIcon={<IconSvg icon='arrowLeft' />}
      onClose={toggleSideBar}
      visible={isVisible}
      footer={footer}
      push={false}
    >
      <SideBarButton
        onClick={() => setIsInternalBarVisible(true)}
        filterBy={t('filters.location')}
        subTitle={subTitle('country')}
        setCurrentFilter={setCurrentFilter}
      />
      <SideBarButton
        onClick={() => setIsInternalBarVisible(true)}
        filterBy={t('filters.projectType')}
        subTitle={subTitle('type')}
        setCurrentFilter={setCurrentFilter}
      />
      <SideBarButton
        onClick={() => setIsInternalBarVisible(true)}
        filterBy={t('filters.standard')}
        subTitle={subTitle('standard')}
        setCurrentFilter={setCurrentFilter}
      />
      <SideBarButton
        onClick={() => setIsInternalBarVisible(true)}
        filterBy={t('filters.status')}
        subTitle={subTitle('status')}
        setCurrentFilter={setCurrentFilter}
      />
      <SideBarButton
        onClick={() => setIsInternalBarVisible(true)}
        filterBy={t('filters.methodology')}
        subTitle={subTitle('methodology')}
        setCurrentFilter={setCurrentFilter}
      />

      <InternalBar
        setIsInternalBarVisible={setIsInternalBarVisible}
        isInternalBarVisible={isInternalBarVisible}
        currentFilter={currentFilter}
        selectedFilters={selectedFilters}
        setSelectedFilters={setSelectedFilters}
      />
    </Drawer>
  );
};
export default SideBar;
