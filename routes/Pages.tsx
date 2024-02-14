import { lazy } from 'react';
import { Route, Switch } from 'react-router';
import { Routes } from 'constants/routes';

import NotFoundView from 'views/404/NotFoundView';
import UnknownErrorView from 'views/500/UnknownErrorView';
import UserMainLayoutView from 'views/common/layouts/main-layout/user/UserMainLayoutView';
import AdminMainLayoutView from 'views/common/layouts/main-layout/admin/AdminMainLayoutView';
import WalletVerificationView from 'views/wallet-verification/WalletVerificationView';
import WaitingForApproveView from 'views/waiting-for-approve/WaitingForApproveView';
import RegistrationLayoutView from 'views/common/layouts/registration-layout/RegistrationLayoutView';

import { RoutesWrapper } from 'components';

//ADMIN
const AdminPagesLazy = lazy(() => import('./AdminPages'));
//HOME
const HomePageLazy = lazy(() => import('views/home/HomeView'));
//PROFILE
const ProfilePageLazy = lazy(() => import('views/profile/ProfileView'));
const TransactionsPageLazy = lazy(() => import('views/transactions/TransactionsView'));
//BURNED
const BurnedPageLazy = lazy(() => import('views/burned/BurnedView'));
const CertificatePageLazy = lazy(() => import('views/burned/certificate/CertificateView'));

//MY PROJECT
const MyProjectPageLazy = lazy(() => import('views/my-project/MyProjectView'));
const EditMyProjectPageLazy = lazy(() => import('views/my-project/edit-my-project/EditMyProjectView'));
const AddProjectStatementPageLazy = lazy(() => import('views/my-project/add-statement/AddStatementView'));
const AddPublicationViewLazy = lazy(() => import('views/my-project/add-publication/AddPublicationView'));
const AddMilestoneViewLazy = lazy(() => import('views/my-project/add-milestone/AddMilestoneView'));
const AddEventsViewLazy = lazy(() => import('views/my-project/add-events/AddEventsView'));
//MY PROJECT
const MyCompanyPageLazy = lazy(() => import('views/my-company/MyCompanyView'));
//PROJECTS
const ProjectsPageLazy = lazy(() => import('views/projects/ProjectsView'));
const ProjectDetailsPageLazy = lazy(() => import('views/project-details/ProjectDetailsView'));
const FavoriteProjectsPageLazy = lazy(() => import('views/favorite-projects/FavoriteProjectsView'));
//PORTFOLIO
const PortfolioPageLazy = lazy(() => import('views/portfolio/PortfolioView'));
//SIGN IN
const SignInPageLazy = lazy(() => import('views/sign-in/SignInView'));
//SIGN UP
const SignUpPageLazy = lazy(() => import('views/sign-up/SignUpView'));
const SignUpCompanyPageLazy = lazy(() => import('views/sign-up/company/SignUpCompanyView'));
const SignUpProjectPageLazy = lazy(() => import('views/sign-up/project/SignUpProjectView'));
const SignUpSuccessPageLazy = lazy(() => import('views/sign-up/success/SignUpSuccessView'));
const SignUpActivatePageLazy = lazy(() => import('views/sign-up/activate/SignUpActivateView'));
const SignUpAdminPageLazy = lazy(() => import('views/sign-up/admin/SignUpAdminView'));
// RESET PASSWORD
const ForgotPasswordPageLazy = lazy(() => import('views/password/forgot/ForgotPasswordView'));
const ResetPasswordPageLazy = lazy(() => import('views/password/reset/ResetPasswordView'));
//AUCTION
const AuctionBidsInfoPageLazy = lazy(() => import('views/auction/AuctionBidsInfoView'));
const AuctionPageLazy = lazy(() => import('views/auction/details/AuctionDetailsView'));
const CreateAuctionLazyPage = lazy(() => import('views/auction/create-auction-view/CreateAuctionView'));
//POOLS
const PoolsLazyPage = lazy(() => import('views/pools/PoolsView'));
const PoolDetailsLazyPage = lazy(() => import('views/pools/pool-details/PoolDetailsView'));

export const MainRoutes = [
  {
    path: Routes.home,
    component: HomePageLazy,
  },
  {
    path: Routes.projects,
    component: ProjectsPageLazy,
  },
  {
    path: Routes.portfolio,
    component: PortfolioPageLazy,
  },
  {
    path: Routes.transactions,
    component: TransactionsPageLazy,
  },
  {
    path: Routes.burned,
    component: BurnedPageLazy,
  },
  {
    path: Routes.certificate,
    component: CertificatePageLazy,
  },
  {
    path: Routes.profile,
    component: ProfilePageLazy,
  },
  {
    path: Routes.myProject,
    component: MyProjectPageLazy,
  },
  {
    path: Routes.editMyProject,
    component: EditMyProjectPageLazy,
  },
  {
    path: Routes.addProjectStatement,
    component: AddProjectStatementPageLazy,
  },
  {
    path: Routes.addProjectPublication,
    component: AddPublicationViewLazy,
  },
  {
    path: Routes.addProjectMilestone,
    component: AddMilestoneViewLazy,
  },
  {
    path: Routes.addProjectEvents,
    component: AddEventsViewLazy,
  },
  {
    path: Routes.projectDetails,
    component: ProjectDetailsPageLazy,
  },
  {
    path: Routes.favoriteProjects,
    component: FavoriteProjectsPageLazy,
  },
  {
    path: Routes.myCompany,
    component: MyCompanyPageLazy,
  },
  { path: Routes.myAuctions, component: AuctionBidsInfoPageLazy },
  {
    path: Routes.auction,
    component: AuctionPageLazy,
  },
  {
    path: Routes.createAuction,
    component: CreateAuctionLazyPage,
  },
  {
    path: Routes.pools,
    component: PoolsLazyPage,
  },
  {
    path: Routes.poolDetails,
    component: PoolDetailsLazyPage,
  },
];

export const AdminRoutes = [
  {
    path: Routes.admin,
    component: AdminPagesLazy,
  },
];

export const RegistrationRoutes = [
  {
    path: Routes.signIn,
    component: SignInPageLazy,
  },
  {
    path: Routes.signUp,
    component: SignUpPageLazy,
  },
  {
    path: Routes.signUpCompany,
    component: SignUpCompanyPageLazy,
  },
  {
    path: Routes.signUpProject,
    component: SignUpProjectPageLazy,
  },
  {
    path: Routes.signUpSuccess,
    component: SignUpSuccessPageLazy,
  },
  {
    path: Routes.signUpActivate,
    component: SignUpActivatePageLazy,
  },
  {
    path: Routes.signUpAdmin,
    component: SignUpAdminPageLazy,
  },
  {
    path: Routes.walletVerification,
    component: WalletVerificationView,
  },
  {
    path: Routes.waitForApprove,
    component: WaitingForApproveView,
  },
  {
    path: Routes.forgotPassword,
    component: ForgotPasswordPageLazy,
  },
  {
    path: Routes.resetPassword,
    component: ResetPasswordPageLazy,
  },
];

const Pages = () => {
  return (
    <Switch>
      <Route
        exact
        path={Object.values(Routes)}
        render={() => (
          <>
            <RoutesWrapper WrapperComponent={UserMainLayoutView} routes={MainRoutes} />
            <RoutesWrapper WrapperComponent={AdminMainLayoutView} routes={AdminRoutes} />
            <RoutesWrapper WrapperComponent={RegistrationLayoutView} routes={RegistrationRoutes} />
            <Route exact path={Routes.unknownError} component={UnknownErrorView} />
          </>
        )}
      />
      <Route component={NotFoundView} />
    </Switch>
  );
};

export default Pages;
