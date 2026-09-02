import { Routes, Route } from 'react-router-dom';

import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../../store/store';

import Landing from '../../../pages/Landing/Landing';
import Login from '../../../pages/Login/ui/Login';
import ForgotPassword from '../../../pages/ForgotPassword/ui/ForgotPassword';
import ResetPassword from '../../../pages/ResetPassword/ui/ResetPassword';
import Registration from '../../../pages/Registration/ui/Registration';
import Consent from '../../../pages/Consent/ui/Consent';
import Privacy from '../../../pages/Privacy/ui/Privacy';
import Expert from '../../../pages/Expert/ui/Expert';
import Person from '../../../pages/Person/ui/Person';
import StaffLearningApplications from '../../../pages/Staff/StaffLearningApplications';
import StaffLearningApplicationDetail from '../../../pages/Staff/StaffLearningApplicationDetail';
import StaffLmsHub from '../../../pages/Staff/StaffLmsHub';
import StaffLmsCourses from '../../../pages/Staff/StaffLmsCourses';
import StaffLmsCourseEditor from '../../../pages/Staff/StaffLmsCourseEditor';
import StaffLmsTests from '../../../pages/Staff/StaffLmsTests';
import StaffLmsTestEditor from '../../../pages/Staff/StaffLmsTestEditor';
import StaffLmsTasks from '../../../pages/Staff/StaffLmsTasks';
import StaffLmsTaskEditor from '../../../pages/Staff/StaffLmsTaskEditor';
import StaffSettings from '../../../pages/Staff/StaffSettings';
import StaffSettingEditor from '../../../pages/Staff/StaffSettingEditor';
import StaffTaskReviews from '../../../pages/Staff/StaffTaskReviews';

import { EROUTES } from '../../utils/ERoutes';
import {
	OnlyAuth,
	OnlyUnAuth,
	OnlyStaffAuth,
	OnlyStaffOrTutorAuth,
} from '../RoutesGuards/ProtectedRoute';
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
						path={EROUTES.FORGOT_PASSWORD}
						element={<OnlyUnAuth component={<ForgotPassword />} />}
					/>
					<Route
						path={EROUTES.RESET_PASSWORD}
						element={<OnlyUnAuth component={<ResetPassword />} />}
					/>
					<Route
						path={EROUTES.REGISTRATION}
						element={<OnlyUnAuth component={<Registration />} />}
					/>
					<Route path={EROUTES.CONSENT} element={<Consent />} />
					<Route path={EROUTES.PRIVACY} element={<Privacy />} />

					<Route
						path={EROUTES.STAFF_LEARNING_APPLICATIONS}
						element={<OnlyStaffAuth component={<StaffLearningApplications />} />}
					/>
					<Route
						path={EROUTES.STAFF_LEARNING_APPLICATION}
						element={<OnlyStaffAuth component={<StaffLearningApplicationDetail />} />}
					/>
					<Route
						path={EROUTES.STAFF_LMS}
						element={<OnlyStaffAuth component={<StaffLmsHub />} />}
					/>
					<Route
						path={EROUTES.STAFF_LMS_COURSES}
						element={<OnlyStaffAuth component={<StaffLmsCourses />} />}
					/>
					<Route
						path={EROUTES.STAFF_LMS_COURSE}
						element={<OnlyStaffAuth component={<StaffLmsCourseEditor />} />}
					/>
					<Route
						path={EROUTES.STAFF_LMS_TESTS}
						element={<OnlyStaffAuth component={<StaffLmsTests />} />}
					/>
					<Route
						path={EROUTES.STAFF_LMS_TEST}
						element={<OnlyStaffAuth component={<StaffLmsTestEditor />} />}
					/>
					<Route
						path={EROUTES.STAFF_LMS_TASKS}
						element={<OnlyStaffAuth component={<StaffLmsTasks />} />}
					/>
					<Route
						path={EROUTES.STAFF_LMS_TASK}
						element={<OnlyStaffAuth component={<StaffLmsTaskEditor />} />}
					/>
					<Route
						path={EROUTES.STAFF_SETTINGS}
						element={<OnlyStaffAuth component={<StaffSettings />} />}
					/>
					<Route
						path={EROUTES.STAFF_SETTING}
						element={<OnlyStaffAuth component={<StaffSettingEditor />} />}
					/>
					<Route
						path={EROUTES.STAFF_TASK_REVIEWS}
						element={<OnlyStaffOrTutorAuth component={<StaffTaskReviews />} />}
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
