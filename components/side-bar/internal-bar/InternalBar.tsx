import { useEffect, useState } from 'react';
import { Drawer } from 'antd';
import { useTranslation } from 'react-i18next';
import { IconSvg, PrimaryButton, SecondaryButton } from 'components';
import { ProjectMethodologies, ProjectTypes } from 'types/api/project';
import { ProjectAuditStatusPublic, ProjectStandards } from 'constants/project';
import { filterKeyToQueryParamMap, FilterTypes } from 'types/components/filters';
import { COUNTRIES } from 'constants/countries';
import InternalBarField from './InternalBarField';
import styles from './InternalBar.module.scss';

interface IPropsTypes {
  setIsInternalBarVisible: (_: boolean) => void;
  isInternalBarVisible: boolean;
  currentFilter: string;
  setSelectedFilters: (filterName: string, selectedOptions: any) => void;
  selectedFilters: any;
}

const projectMethodologiesOptions = Object.values(ProjectMethodologies).map((value) => value);
const projectTypeOptions = Object.values(ProjectTypes).map((value) => value);
const projectAuditStatusOptions = ProjectAuditStatusPublic.map(({ content, value }) => ({ label: content, value }));
const countiesOptions = COUNTRIES.map(({ name, code }) => ({ label: name, value: code }));
const standardOptions = Object.values(ProjectStandards).map((value) => value);

const internalBarFieldsOptionsMap: Record<string, string[]> | any = {
  [FilterTypes.Location]: countiesOptions,
  [FilterTypes.ProjectType]: projectTypeOptions,
  [FilterTypes.Status]: projectAuditStatusOptions,
  [FilterTypes.Methodology]: projectMethodologiesOptions,
  [FilterTypes.Standard]: standardOptions,
};

const InternalBar = ({
  setIsInternalBarVisible,
  isInternalBarVisible,
  currentFilter,
  setSelectedFilters,
  selectedFilters,
}: IPropsTypes) => {
  const { t } = useTranslation('views/projects');

  const enumKey = currentFilter as FilterTypes;
  const queryParam = filterKeyToQueryParamMap[enumKey];

  const applyFilter = (filterName: string) => {
    const queryParam = filterKeyToQueryParamMap[filterName];
    setSelectedFilters(queryParam, selectedItems);
  };

  useEffect(() => {
    setSelectedItems(selectedFilters[queryParam]);
  }, [selectedFilters, currentFilter]);

  const [selectedItems, setSelectedItems] = useState<any>(selectedFilters[queryParam] || []);

  const footer = (
    <>
      <SecondaryButton
        className={styles.reset}
        onClick={() => {
          setSelectedItems([]);
          setIsInternalBarVisible(false);
        }}
      >
        {t('common.reset')}
      </SecondaryButton>
      <PrimaryButton
        onClick={() => {
          applyFilter(enumKey);
          setIsInternalBarVisible(false);
        }}
      >
        {t('common.apply')}
      </PrimaryButton>
    </>
  );

  const internalBarFieldOptions = internalBarFieldsOptionsMap[enumKey];

  return (
    <Drawer
      title={currentFilter}
      className={styles.internalDrawer}
      width={320}
      onClose={() => setIsInternalBarVisible(false)}
      closeIcon={<IconSvg icon='arrowLeft' />}
      visible={isInternalBarVisible}
      footer={footer}
    >
      {currentFilter && (
        <InternalBarField
          options={internalBarFieldOptions}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
        />
      )}
    </Drawer>
  );
};

export default InternalBar;
