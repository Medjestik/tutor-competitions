import type { IFormError } from '../Form/types/types';
import type { ICurrentUser } from './interface';
import type { ILoginData } from '../../../pages/Login/interface/interface';

import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

import { ToastProvider } from '../ToastProvider/ui/ToastProvider';
import Landing from '../../../pages/Landing/Landing';
import Login from '../../../pages/Login/ui/Login';
import ForgotPassword from '../../../pages/ForgotPassword/ui/ForgotPassword';
import ResetPassword from '../../../pages/ResetPassword/ui/ResetPassword';
import Registration from '../../../pages/Registration/ui/Registration';
import Consent from '../../../pages/Consent/ui/Consent';
import Privacy from '../../../pages/Privacy/ui/Privacy';
import Expert from '../../../pages/Expert/ui/Expert';
import Person from '../../../pages/Person/ui/Person';
import Records from '../../../pages/Records/ui/Records';
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
import Preloader from '../Preloader/ui/Preloader';
import { EROUTES } from '../../utils/ERoutes';
import { PublicRoute } from '../RoutesGuards/PublicRoute';
import { ProtectedRoute } from '../RoutesGuards/ProtectedRoute';
import { initialUser, CurrentUserContext } from '../../context/team';

import * as api from '../../../shared/utils/api';

import styles from './app.module.scss';

export const App = () => {
	const navigate = useNavigate();
	const { pathname } = useLocation();

	const [currentUser, setCurrentUser] = useState<ICurrentUser>(initialUser);
	const [loggedIn, setLoggedIn] = useState<boolean>(false);
	const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

	const [isLoadingPage, setIsLoadingPage] = useState<boolean>(
		() => Boolean(localStorage.getItem('token'))
	);

	const [isLoadingRequest, setIsLoadingRequest] = useState<boolean>(false);
	const [isShowLoginError, setIsShowLoginError] = useState<IFormError>({
		text: '',
		isShow: false,
	});

	const tokenCheck = () => {
		const token = localStorage.getItem('token');
		if (token) {
			setIsLoadingPage(true);
			api
				.getMe(token)
				.then((res) => {
					setCurrentUser(res);
					setLoggedIn(true);
				})
				.catch((err) => {
					setLoggedIn(false);
					console.error(err);
				})
				.finally(() => setIsLoadingPage(false));
		} else {
			if (pathname !== EROUTES.REGISTRATION) {
				// navigate(EROUTES.LANDING);
			}
			setIsLoadingPage(false);
		}
	};

	const handleChangeStage = (stageId: number) => {
		setCurrentUser({ ...currentUser, current_stage_id: stageId });
	};

	const handleLogin = (data: ILoginData) => {
		setIsLoadingRequest(true);
		setIsShowLoginError({ text: '', isShow: false });
		api
			.login(data)
			.then((res) => {
				localStorage.setItem('token', res.access);
				tokenCheck();
			})
			.catch((err) => {
				if (err.status === 400 || err.status === 401) {
					setIsShowLoginError({
						text: 'Неправильный логин или пароль!',
						isShow: true,
					});
				} else if (err.status === 403) {
					setIsShowLoginError({
						text: 'Вход в личный кабинет временно закрыт',
						isShow: true,
					});
				} else {
					setIsShowLoginError({
						text: 'К сожалению произошла ошибка! Обратитесь в техническую поддержку.',
						isShow: true,
					});
				}
				console.error(err);
			})
			.finally(() => setIsLoadingRequest(false));
	};

	const handleLogout = () => {
		localStorage.removeItem('token');
		setLoggedIn(false);
		setCurrentUser(initialUser);
		navigate(EROUTES.LANDING);
	};

	useEffect(() => {
		tokenCheck();
	}, []);

	useEffect(() => {
		function resizeWindow(evt: UIEvent) {
			const target = evt.target as Window;
			setWindowWidth(target.innerWidth);
		}
		window.addEventListener('resize', resizeWindow);
		return () => {
			window.removeEventListener('resize', resizeWindow);
		};
	}, []);

	return (
		<ToastProvider>
			<CurrentUserContext.Provider value={currentUser}>
				<div className={styles.page}>
					{isLoadingPage ? (
						<Preloader />
					) : (
						<Routes>
							<Route
								path={EROUTES.LANDING}
								element={
									<PublicRoute isRestricted={true} isLoggedIn={loggedIn}>
										<Landing />
									</PublicRoute>
								}
							/>

							<Route
								path={EROUTES.LOGIN}
								element={
									<PublicRoute isRestricted={true} isLoggedIn={loggedIn}>
										<Login
											onLogin={handleLogin}
											loginError={isShowLoginError}
											isLoadingRequest={isLoadingRequest}
										/>
									</PublicRoute>
								}
							/>

							<Route
								path={EROUTES.FORGOT_PASSWORD}
								element={
									<PublicRoute isRestricted={true} isLoggedIn={loggedIn}>
										<ForgotPassword />
									</PublicRoute>
								}
							/>

							<Route
								path={EROUTES.RESET_PASSWORD}
								element={
									<PublicRoute isRestricted={true} isLoggedIn={loggedIn}>
										<ResetPassword />
									</PublicRoute>
								}
							/>
							<Route
								path={`${EROUTES.RESET_PASSWORD}/`}
								element={
									<PublicRoute isRestricted={true} isLoggedIn={loggedIn}>
										<ResetPassword />
									</PublicRoute>
								}
							/>

							<Route
								path={EROUTES.REGISTRATION}
								element={
									<PublicRoute isRestricted={true} isLoggedIn={loggedIn}>
										<Registration />
									</PublicRoute>
								}
							/>

							<Route
								path={EROUTES.CONSENT}
								element={
									<PublicRoute isRestricted={true} isLoggedIn={loggedIn}>
										<Consent windowWidth={windowWidth} />
									</PublicRoute>
								}
							/>

							<Route
								path={EROUTES.PRIVACY}
								element={
									<PublicRoute isRestricted={true} isLoggedIn={loggedIn}>
										<Privacy windowWidth={windowWidth} />
									</PublicRoute>
								}
							/>

							{loggedIn && (
								<Route
									path="/records"
									element={
										<ProtectedRoute isAllowed={loggedIn}>
											<Records
												windowWidth={windowWidth}
												isLoggedIn={loggedIn}
											/>
										</ProtectedRoute>
									}
								/>
							)}

							<Route
								path={EROUTES.STAFF_LEARNING_APPLICATIONS}
								element={
									<ProtectedRoute
										isAllowed={loggedIn && Boolean(currentUser.is_staff)}
									>
										<StaffLearningApplications
											windowWidth={windowWidth}
											onLogout={handleLogout}
										/>
									</ProtectedRoute>
								}
							/>

							<Route
								path={EROUTES.STAFF_LEARNING_APPLICATION}
								element={
									<ProtectedRoute
										isAllowed={loggedIn && Boolean(currentUser.is_staff)}
									>
										<StaffLearningApplicationDetail
											windowWidth={windowWidth}
											onLogout={handleLogout}
										/>
									</ProtectedRoute>
								}
							/>

							<Route
								path={EROUTES.STAFF_LMS}
								element={
									<ProtectedRoute
										isAllowed={loggedIn && Boolean(currentUser.is_staff)}
									>
										<StaffLmsHub
											windowWidth={windowWidth}
											onLogout={handleLogout}
										/>
									</ProtectedRoute>
								}
							/>

							<Route
								path={EROUTES.STAFF_LMS_COURSES}
								element={
									<ProtectedRoute
										isAllowed={loggedIn && Boolean(currentUser.is_staff)}
									>
										<StaffLmsCourses
											windowWidth={windowWidth}
											onLogout={handleLogout}
										/>
									</ProtectedRoute>
								}
							/>

							<Route
								path={EROUTES.STAFF_LMS_COURSE}
								element={
									<ProtectedRoute
										isAllowed={loggedIn && Boolean(currentUser.is_staff)}
									>
										<StaffLmsCourseEditor
											windowWidth={windowWidth}
											onLogout={handleLogout}
										/>
									</ProtectedRoute>
								}
							/>

							<Route
								path={EROUTES.STAFF_LMS_TESTS}
								element={
									<ProtectedRoute
										isAllowed={loggedIn && Boolean(currentUser.is_staff)}
									>
										<StaffLmsTests
											windowWidth={windowWidth}
											onLogout={handleLogout}
										/>
									</ProtectedRoute>
								}
							/>

							<Route
								path={EROUTES.STAFF_LMS_TEST}
								element={
									<ProtectedRoute
										isAllowed={loggedIn && Boolean(currentUser.is_staff)}
									>
										<StaffLmsTestEditor
											windowWidth={windowWidth}
											onLogout={handleLogout}
										/>
									</ProtectedRoute>
								}
							/>

							<Route
								path={EROUTES.STAFF_LMS_TASKS}
								element={
									<ProtectedRoute
										isAllowed={loggedIn && Boolean(currentUser.is_staff)}
									>
										<StaffLmsTasks
											windowWidth={windowWidth}
											onLogout={handleLogout}
										/>
									</ProtectedRoute>
								}
							/>

							<Route
								path={EROUTES.STAFF_LMS_TASK}
								element={
									<ProtectedRoute
										isAllowed={loggedIn && Boolean(currentUser.is_staff)}
									>
										<StaffLmsTaskEditor
											windowWidth={windowWidth}
											onLogout={handleLogout}
										/>
									</ProtectedRoute>
								}
							/>

							<Route
								path={EROUTES.STAFF_SETTINGS}
								element={
									<ProtectedRoute
										isAllowed={loggedIn && Boolean(currentUser.is_staff)}
									>
										<StaffSettings
											windowWidth={windowWidth}
											onLogout={handleLogout}
										/>
									</ProtectedRoute>
								}
							/>

							<Route
								path={EROUTES.STAFF_SETTING}
								element={
									<ProtectedRoute
										isAllowed={loggedIn && Boolean(currentUser.is_staff)}
									>
										<StaffSettingEditor
											windowWidth={windowWidth}
											onLogout={handleLogout}
										/>
									</ProtectedRoute>
								}
							/>

							<Route
								path={EROUTES.STAFF_TASK_REVIEWS}
								element={
									<ProtectedRoute
										isAllowed={
											loggedIn
											&& (Boolean(currentUser.is_staff) || Boolean(currentUser.is_lms_tutor))
										}
									>
										<StaffTaskReviews
											windowWidth={windowWidth}
											onLogout={handleLogout}
										/>
									</ProtectedRoute>
								}
							/>

							{loggedIn && (
								<Route
									path="/person/*"
									element={
										<ProtectedRoute isAllowed={loggedIn}>
											{currentUser.role === 'expert' ? (
												<Expert
													windowWidth={windowWidth}
													onLogout={handleLogout}
												/>
											) : (
												<Person
													windowWidth={windowWidth}
													onLogout={handleLogout}
													onChangeStage={handleChangeStage}
												/>
											)}
										</ProtectedRoute>
									}
								/>
							)}
						</Routes>
					)}
				</div>
			</CurrentUserContext.Provider>
		</ToastProvider>
	);
};
