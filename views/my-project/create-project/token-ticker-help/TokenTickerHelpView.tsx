import { useEffect, useState } from 'react';
import { useField } from 'formik';
import { useTranslation } from 'react-i18next';

import { useDebounce } from 'hooks';
import { getAbbreviation } from 'utils';
import { MAX_SUGGESTION_INDEX } from 'constants/index';
import projectAPI from 'api/project/projectAPI';

import styles from './TokenTickerHelpView.module.scss';
import { poolAPI } from 'api/pool/poolAPI';

interface IProps {
  poolRequest?: boolean;
}

const TokenTickerHelpView = ({ poolRequest = false }: IProps) => {
  const { t } = useTranslation('views/project');
  const [nameField] = useField('tokenName');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [tokenTickerField, tokenTickerMeta, tokenTickerHelpers] = useField('tokenTicker');
  const [tickerSuggestion, setTickerSuggestion] = useState('');
  const debouncedNameValue = useDebounce(nameField.value, 800);
  const showSuggestion = !!tickerSuggestion && tickerSuggestion !== tokenTickerField.value;

  const getTickerSuggestions = (projectName: string): string[] => {
    const suggestTicker1 = getAbbreviation(projectName);
    const suggestTicker2 = getAbbreviation(projectName, true);
    const suggestions = [suggestTicker1, suggestTicker2];

    for (let i = 0; i <= MAX_SUGGESTION_INDEX; i++) {
      suggestions.push(`${suggestTicker1}${i}`);
      suggestions.push(`${suggestTicker2}${i}`);
    }

    return suggestions;
  };

  const getTickerSuggestion = async (projectName: string): Promise<string> => {
    const suggestions = getTickerSuggestions(projectName);
    for (const suggestion of suggestions) {
      const { exists } = poolRequest ? await poolAPI.checkTicker(suggestion) : await projectAPI.checkTicker(suggestion);
      if (!exists) {
        return suggestion;
      }
    }
    return '';
  };

  const loadTickerSuggestion = async (projectName: string) => {
    const tickerSuggestion = await getTickerSuggestion(projectName);
    setTickerSuggestion(tickerSuggestion);
  };

  useEffect(() => {
    if (debouncedNameValue) {
      loadTickerSuggestion(debouncedNameValue);
    }
  }, [debouncedNameValue]);

  if (showSuggestion) {
    return (
      <div className={styles.tickerSuggestion}>
        {t('form.tokenTickerSuggestion')}
        <span className={styles.button} onClick={() => tokenTickerHelpers.setValue(tickerSuggestion)}>
          {tickerSuggestion}
        </span>
      </div>
    );
  }

  return <></>;
};

export default TokenTickerHelpView;
