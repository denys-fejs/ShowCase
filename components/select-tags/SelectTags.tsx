import { useState, useEffect, memo, Fragment } from 'react';
import { Tag } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons/lib/icons';
import { useTranslation } from 'react-i18next';
import isEmpty from 'lodash.isempty';
import { COUNTRIES } from 'constants/countries';
import { FilterTypes, filterKeyToQueryParamMap } from 'types/components/filters';
import { getLocationByCode } from 'utils/locationMapper';

import styles from './SelectTags.module.scss';

const paramTypeToTranslationKey: Record<string, any> = {
  type: 'projectType',
  country: 'location',
  standard: 'standard',
  auditStatus: 'auditStatus',
  methodology: 'methodology',
};

const SelectTags = ({ selectedTags, setParams }: any) => {
  const [state, setState] = useState<Record<string, any>>({});
  const { t } = useTranslation('views/projects');

  useEffect(() => {
    setState(selectedTags);
  }, [selectedTags]);

  const handleClose = (paramKey: string, removedTag: string) => {
    let paramValue = state[paramKey];

    if (!Array.isArray(paramValue)) {
      paramValue = [paramValue];
    }

    if (paramKey === filterKeyToQueryParamMap[FilterTypes.Location]) {
      removedTag = COUNTRIES.find((country) => country.name === removedTag)?.code || '';
    }

    const newParams = paramValue.filter((tag: string) => tag !== removedTag);
    setParams({ [paramKey]: !isEmpty(newParams) ? newParams : null });
  };

  const renderTags = (paramKey: string) => {
    let paramValue = state[paramKey];

    if (!paramValue || isEmpty(paramValue)) return null;

    if (paramKey === filterKeyToQueryParamMap[FilterTypes.Location]) {
      paramValue = getLocationByCode(paramValue);
    }

    if (!Array.isArray(paramValue)) {
      paramValue = [paramValue];
    }

    return (
      <Fragment key={paramKey}>
        <span className={styles.tagsHeader}>{t(`filters.${paramTypeToTranslationKey[paramKey]}`)}:</span>
        {paramValue.map((paramValue: string, index: number) => {
          return (
            <Tag
              className={styles.tag}
              key={paramKey + index}
              closable={true}
              onClose={() => handleClose(paramKey, paramValue)}
              closeIcon={<CloseCircleOutlined />}
            >
              <span>{paramValue}</span>
            </Tag>
          );
        })}
      </Fragment>
    );
  };

  return (
    <div className={styles.tagsContainer}>
      {Object.keys(state).map((paramKey) => {
        return renderTags(paramKey);
      })}
    </div>
  );
};
export default memo(SelectTags);
