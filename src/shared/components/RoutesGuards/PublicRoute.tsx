import type { FC, ReactNode } from 'react';

import { Navigate } from 'react-router-dom';

import { EROUTES } from '../../utils/ERoutes';

interface IPublicRouteProps {
  children: ReactNode;
  isRestricted: boolean;
  isLoggedIn: boolean;
  redirectPath?: string;
}

export const PublicRoute: FC<IPublicRouteProps> = ({ children, isRestricted, isLoggedIn, redirectPath = EROUTES.PERSON }) => {
  if (isLoggedIn && isRestricted) {
    return <Navigate to={redirectPath} replace />;
  }
  return <>{children}</>;
};
