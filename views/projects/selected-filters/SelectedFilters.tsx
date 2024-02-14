import { useContext } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { SelectTags, Divider } from 'components';
import FilterContext from 'views/common/filter/FilterContext';

import styles from './SelectedFilters.module.scss';

const SelectedFilters = ({ selectedFilters }: any) => {
  const { t } = useTranslation('views/projects');
  const { clearQueryParams, setParams } = useContext(FilterContext);

  return (
    <div className={styles.selectedFiltersContainer}>
      <div className={styles.leftSide}>
        <button className={styles.clearBtn} onClick={clearQueryParams}>
          <CloseOutlined />
          {t(`common.clearAll`)}
        </button>
      </div>
      <div className={styles.rightSide}>
        <Divider type='vertical' className={styles.divider} />
        <SelectTags selectedTags={selectedFilters} setParams={setParams} />
      </div>
    </div>
  );
};

export default SelectedFilters;
