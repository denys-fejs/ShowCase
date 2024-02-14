import { ReactNode } from 'react';

import { IMainLayoutMenuLink } from 'types';
import { Routes } from 'constants/routes';
import { UserRole } from 'constants/user';

import BasicMainLayoutView from '../basic/BasicMainLayoutView';
import InviteAdminView from './invite-admin/InviteAdminView';

interface IProps {
  children?: ReactNode;
}

const menuLinks: Array<IMainLayoutMenuLink> = [
  {
    key: '1',
    icon: 'dashboard',
    name: 'dashboard',
    path: Routes.adminDashboard,
    roles: [UserRole.Admin],
  },
  {
    key: '2',
    icon: 'projects',
    name: 'projects',
    path: Routes.adminProjects,
    roles: [UserRole.Admin],
  },
  {
    key: '3',
    icon: 'company',
    name: 'companies',
    path: Routes.adminCompanies,
    roles: [UserRole.Admin],
  },
  {
    key: '4',
    icon: 'avatar',
    name: 'admins',
    path: Routes.adminUsers,
    roles: [UserRole.Admin],
  },
  {
    key: '5',
    icon: 'requests',
    name: 'requests',
    path: Routes.adminTokensRequests,
    roles: [UserRole.Admin],
  },
  {
    key: '6',
    icon: 'link',
    name: 'pools',
    path: Routes.adminPools,
    roles: [UserRole.Admin],
  },
];

const AdminMainLayoutView = ({ children }: IProps) => {
  return (
    <BasicMainLayoutView menuLinks={menuLinks} sidebarActions={<InviteAdminView />}>
      {children}
    </BasicMainLayoutView>
  );
};

export default AdminMainLayoutView;
