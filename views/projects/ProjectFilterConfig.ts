import { IFilterOptionsConfig, ProjectTypes } from 'types';
import { COUNTRIES } from 'constants/countries';
import { ProjectAuditStatusPublic, ProjectStandards } from 'constants/project';

export const projectTypesOptions = Object.values(ProjectTypes).map((value) => ({ value }));
export const countiesOptions = Object.values(COUNTRIES).map(({ name, code }) => ({ value: code, content: name }));
export const projectStandardOptions = Object.values(ProjectStandards).map((value) => ({ value }));

export const filterConfig: IFilterOptionsConfig[] = [
  {
    filterName: 'country',
    icon: 'mapPoint',
    options: countiesOptions,
    placeholder: 'filters.location',
    selectMode: 'multiple',
    mapValueToLabel: true,
  },
  {
    filterName: 'type',
    icon: 'document',
    options: projectTypesOptions,
    placeholder: 'filters.projectType',
    selectMode: 'multiple',
  },
  {
    filterName: 'standard',
    icon: 'agency',
    options: projectStandardOptions,
    placeholder: 'filters.standard',
    selectMode: 'multiple',
  },
  {
    filterName: 'auditStatus',
    icon: 'status',
    options: ProjectAuditStatusPublic,
    placeholder: 'filters.auditStatus',
    selectMode: 'multiple',
    mapValueToLabel: true,
  },
];
