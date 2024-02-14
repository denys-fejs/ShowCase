import { useCallback, useEffect } from 'react';
import { useHistory, useLocation, useRouteMatch } from 'react-router';
import isEmpty from 'lodash.isempty';
import isEqual from 'lodash.isequal';
import omit from 'lodash.omit';
import useQueryParams from 'hooks/useQueryParams';
import { parseQueryParams, stringifyQueryParams } from 'utils/query';
import { FilterParams } from 'types/components/filter';
import FilterContext from './FilterContext';

const FilterProvider = ({ fetchData, onFilter, children, dependencies = [] }: any) => {
  const [queryParams, setQueryParams] = useQueryParams();
  const location = useLocation();
  const history = useHistory();
  const match = useRouteMatch();

  const {
    type = null,
    standard = null,
    search = '',
    country = null,
    name = '',
    status = null,
    createdAt = null,
    burnDate = null,
    date = null,
    auditStatus = null,
    methodology = null,
    amount = null,
    limit = queryParams.limit || 0,
    page = queryParams.page || 0,
    timestamp = null,
    sortBy = queryParams.sortBy || '',
    sortOrder = queryParams.sortOrder || '',
    certId = null,
  } = queryParams;
  const setParams = useCallback(
    (newParams: FilterParams | any) => {
      let params = {};
      Object.keys(newParams).forEach((name) => {
        const value = newParams[name];
        if (isEqual(queryParams[name], value)) {
          return;
        }
        params = { ...queryParams, [name]: value };
      });
      if (!isEmpty(params)) {
        setQueryParams(params);
      }
      onFilter && onFilter();
    },
    [queryParams, setQueryParams, location.search, onFilter],
  );

  const updateParams = (newParams: FilterParams | any) => {
    setQueryParams(newParams);
  };

  useEffect(() => {
    if (stringifyQueryParams(queryParams) !== location.search.replace(/\?/, '')) {
      setQueryParams(parseQueryParams(location.search));
    }
  }, [location.search]);

  useEffect(() => {
    Object.keys(queryParams).forEach((paramKey) => {
      if (!queryParams[paramKey]) delete queryParams[paramKey];
    });

    const cleanedQS = omit(queryParams, ['timestamp']);

    history.push({
      pathname: match.path,
      search: stringifyQueryParams(cleanedQS),
    });
    fetchData(cleanedQS);
  }, [
    type,
    standard,
    search,
    country,
    auditStatus,
    methodology,
    limit,
    name,
    status,
    date,
    createdAt,
    burnDate,
    amount,
    page,
    timestamp,
    sortBy,
    sortOrder,
    certId,
    ...dependencies,
  ]);

  const clearQueryParams = () => {
    setQueryParams({});
  };

  const context = {
    search,
    limit: +limit,
    page: +page,
    sortBy,
    sortOrder,
    queryParams,
    setParams,
    updateParams,
    clearQueryParams,
    timestamp,
  };

  return <FilterContext.Provider value={context}>{children}</FilterContext.Provider>;
};

export default FilterProvider;
