import { Route, Switch } from 'react-router';
import { Redirect } from 'react-router-dom';

import useAuthRole from 'hooks/useAuthRole';
import { Routes, UserRole } from 'constants/index';
import AdminDashboardView from 'views/admin/dashboard/AdminDashboardView';
import AdminProjectDetailsView from 'views/admin/project-details/AdminProjectDetailsView';
import AdminCompanyDetailsView from 'views/admin/company-details/AdminCompanyDetailsView';
import AdminProjectsView from 'views/admin/projects/AdminProjectsView';
import AdminCompaniesView from 'views/admin/companies/AdminCompaniesView';
import AdminTokenRequestsView from 'views/admin/tokens-requests/AdminTokensRequestsView';
import AdminTokenRequestView from 'views/admin/tokens-requests/token-request-view/AdminTokenRequestView';
import AdminUsersView from 'views/admin/users/AdminUsersView';
import AdminUserDetailsView from 'views/admin/user-details/AdminUserDetailsView';
import AdminPoolsView from 'views/admin/pools/AdminPoolsView';
import CreatePoolView from 'views/admin/pools/create-pool/CreatePoolView';
import AdminPoolDetailsView from 'views/admin/pools/admin-pool-details/AdminPoolDetailsView';
import UpdatePoolView from 'views/admin/pools/update-pool/UpdatePoolView';

const AdminPages = () => {
  useAuthRole({ isAuthRequired: true, rolesRequired: [UserRole.Admin] });
  return (
    <Switch>
      <Route path={Routes.adminDashboard} exact component={AdminDashboardView} />
      <Route path={Routes.adminProjects} exact component={AdminProjectsView} />
      <Route path={Routes.adminProject} exact component={AdminProjectDetailsView} />
      <Route path={Routes.adminCompanies} exact component={AdminCompaniesView} />
      <Route path={Routes.adminUsers} exact component={AdminUsersView} />
      <Route path={Routes.adminUser} exact component={AdminUserDetailsView} />
      <Route path={Routes.adminTokensRequests} exact component={AdminTokenRequestsView} />
      <Route path={Routes.adminTokensRequest} exact component={AdminTokenRequestView} />
      <Route path={Routes.adminCompany} exact component={AdminCompanyDetailsView} />
      <Route path={Routes.adminPools} exact component={AdminPoolsView} />
      <Route path={Routes.adminCreatePool} exact component={CreatePoolView} />
      <Route path={Routes.adminPoolDetails} exact component={AdminPoolDetailsView} />
      <Route path={Routes.adminUpdatePool} exact component={UpdatePoolView} />
      <Route>
        <Redirect to={Routes.adminDashboard} />
      </Route>
    </Switch>
  );
};

export default AdminPages;
