import { Routes, Route } from 'react-router-dom';

import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../../store/store';

import Landing from '../../../pages/Landing/Landing';
import Login from '../../../pages/Login/ui/Login';
import Registration from '../../../pages/Registration/ui/Registration';
import Consent from '../../../pages/Consent/ui/Consent';
import Privacy from '../../../pages/Privacy/ui/Privacy';
import Expert from '../../../pages/Expert/ui/Expert';
import Person from '../../../pages/Person/ui/Person';
import StaffLearningApplications from '../../../pages/Staff/StaffLearningApplications';
import StaffLearningApplicationDetail from '../../../pages/Staff/StaffLearningApplicationDetail';

import { EROUTES } from '../../utils/ERoutes';
import { OnlyAuth, OnlyUnAuth, } from '../RoutesGuards/ProtectedRoute';
import { ToastProvider } from '../ToastProvider/ui/ToastProvider';
import { ScrollToTop } from '../../../features/ScrollToTop/ui/scroll-to-top';
import { checkUserAuth } from '../../../store/user/actions';

import styles from './app.module.scss';

export const App = () => {
	const dispatch = useDispatch();
	const { user } = useSelector((state) => state.user);

	useEffect(() => {
		dispatch(checkUserAuth());
	}, [dispatch]);

	return (
		<ToastProvider>
			<div className={styles.page}>
			<ScrollToTop />
			<Routes>
				<Route
						path={EROUTES.LANDING}
						element={<OnlyUnAuth component={<Landing />} />}
					/>
					<Route
						path={EROUTES.LOGIN}
						element={<OnlyUnAuth component={<Login />} />}
					/>
					<Route
						path={EROUTES.REGISTRATION}
						element={<OnlyUnAuth component={<Registration />} />}
					/>
					<Route path={EROUTES.CONSENT} element={<Consent />} />
					<Route path={EROUTES.PRIVACY} element={<Privacy />} />

					<Route
						path={EROUTES.STAFF_LEARNING_APPLICATIONS}
						element={<OnlyAuth component={<StaffLearningApplications />} />}
					/>
					<Route
						path={EROUTES.STAFF_LEARNING_APPLICATION}
						element={<OnlyAuth component={<StaffLearningApplicationDetail />} />}
					/>
					<Route
						path='/person/*'
						element={<OnlyAuth component={user?.role === 'test' ? <Expert /> : <Person />} />}
					/>

					</Routes>
					<div id='modal-root'></div>
					<div id='toast-root'></div>
			</div>
		</ToastProvider>
	);
};
