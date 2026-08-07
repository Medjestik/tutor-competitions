import type { FC, ReactElement } from 'react';
import { Navigate } from 'react-router-dom';

import { useSelector } from '../../../store/store';

import Preloader from '../Preloader/ui/Preloader';

import { getIsAuthChecked, getUser } from '../../../store/user/reducer';

interface IProtectedProps {
	onlyUnAuth?: boolean;
	component: ReactElement;
}

const Protected: FC<IProtectedProps> = ({ onlyUnAuth = false, component }) => {
	const isAuthChecked = useSelector(getIsAuthChecked);
	const user = useSelector(getUser);

	if (!isAuthChecked) return <Preloader />;

	if (!user && !onlyUnAuth) {
		return <Navigate to='/login' replace />;
	}

	if (onlyUnAuth && user) {
		return <Navigate to='/person' replace />;
	}

	return component;
};

export const OnlyAuth = Protected;
export const OnlyUnAuth = ({ component }: { component: ReactElement }) => (
	<Protected onlyUnAuth component={component} />
);
