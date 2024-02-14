import { FC, useCallback, useMemo } from 'react';
import { Route } from 'react-router';

import { Routes } from 'constants/routes';

interface IRoute {
  path: Routes;
  exact?: boolean;
  component: FC;
}

interface IProps {
  WrapperComponent: FC;
  routes: Array<IRoute>;
}

const RoutesWrapper = ({ routes, WrapperComponent }: IProps) => {
  const paths = useMemo(() => {
    return routes.map(({ path }) => path);
  }, [routes]);

  const renderRoutes = useCallback(() => {
    return (
      <WrapperComponent>
        {routes.map(({ path, component, exact = true }) => (
          <Route key={`RoutesWrapper-${path}`} path={path} exact={exact} component={component} />
        ))}
      </WrapperComponent>
    );
  }, [routes]);

  return <Route path={paths} exact component={renderRoutes} />;
};

export default RoutesWrapper;
