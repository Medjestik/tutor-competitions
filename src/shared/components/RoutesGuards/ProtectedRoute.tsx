import type { FC, ReactNode } from 'react';

import { Navigate } from 'react-router-dom';

import { EROUTES } from '../../utils/ERoutes';

interface IProtectedRouteProps {
  children: ReactNode;
  isAllowed: boolean;
  redirectPath?: string;
}

export const ProtectedRoute: FC<IProtectedRouteProps> = ({ children, isAllowed, redirectPath = EROUTES.LANDING }) => {
  return isAllowed ? <>{children}</> : <Navigate to={redirectPath} replace />;
};
