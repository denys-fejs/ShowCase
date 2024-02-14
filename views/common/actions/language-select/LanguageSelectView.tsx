import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { supportedLngs } from 'i18n';
import { IDropdownItem } from 'types';
import { BasicDropdown } from 'components';

import styles from './LanguageSelectView.module.scss';

const LanguageSelectView = () => {
  const { t, i18n } = useTranslation('views/common');
  const items = useMemo<Array<IDropdownItem>>(() => {
    return supportedLngs.map((lang) => {
      return {
        content: t(`header.languages.${lang}`),
        onClick: () => i18n.changeLanguage(lang),
      };
    });
  }, [t, i18n]);

  return (
    <div className={styles.container}>
      <BasicDropdown name='LanguageSelect' items={items} placement='bottomCenter' isCaretOutside={true}>
        {t(`header.languages.${i18n.language}`)}
      </BasicDropdown>
    </div>
  );
};

export default LanguageSelectView;
