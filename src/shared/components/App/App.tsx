import './App.css';

import type { IFormError } from '../Form/interface/interface';
import type { ICurrentUser } from './interface';
import type { ILoginData } from '../../../pages/Login/interface/interface';

import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

import Landing from '../../../pages/Landing/Landing';
import Login from '../../../pages/Login/ui/Login';
import Registration from '../../../pages/Registration/ui/Registration';
import Expert from '../../../pages/Expert/ui/Expert';
import Person from '../../../pages/Person/ui/Person';
import ExpertFormPage from '../../../pages/Expert/components/ExpertFormPage/ui/ExpertFormPage';
import Preloader from '../Preloader/ui/Preloader';
import { EROUTES } from '../../utils/ERoutes';
import { PublicRoute } from '../RoutesGuards/PublicRoute';
import { ProtectedRoute } from '../RoutesGuards/ProtectedRoute';
import { initialUser, CurrentUserContext } from '../../context/team';

import * as api from '../../../shared/utils/api';

function App() {

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [currentUser, setCurrentUser] = useState<ICurrentUser>(initialUser);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  const [isLoadingPage, setIsLoadingPage] = useState<boolean>(false);

  const [isLoadingRequest, setIsLoadingRequest] = useState<boolean>(false);
  const [isShowLoginError, setIsShowLoginError] = useState<IFormError>({ text: '', isShow: false });

  const tokenCheck = () => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoadingPage(true);
      api.getMe(token)
      .then((res) => {
        setCurrentUser(res);
        setLoggedIn(true);
        navigate('/');
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
    api.login(data)
    .then((res) => {
      localStorage.setItem('token', res.access);
      tokenCheck();
    })
    .catch((err) => {
      if (err.status === 400) {
        setIsShowLoginError({ text: 'Неправильный логин или пароль!', isShow: true });
      } else {
        setIsShowLoginError({ text: 'К сожалению произошла ошибка! Обратитесь в техническую поддержку.', isShow: true });
      }
      console.error(err);
    })
    .finally(() => setIsLoadingRequest(false));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
    navigate(EROUTES.LANDING);
  };

  useEffect(() => {
    tokenCheck();
  }, []);

  useEffect(() => {
    function resizeWindow (evt: UIEvent) {
      const target = evt.target as Window;
      setWindowWidth(target.innerWidth);
    }
    window.addEventListener('resize', resizeWindow);
    return () => {
      window.removeEventListener('resize', resizeWindow);
    };
  }, []);
  
  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className='page'>
        {
          isLoadingPage
          ?
          <Preloader />
          :
          <Routes>
            <Route path={EROUTES.LANDING} element={
              <PublicRoute isRestricted={true} isLoggedIn={loggedIn}>
                <Landing windowWidth={windowWidth} />
              </PublicRoute>
            } />
            
            <Route path={EROUTES.LOGIN} element={
              <PublicRoute isRestricted={true} isLoggedIn={loggedIn}>
                <Login windowWidth={windowWidth} onLogin={handleLogin} loginError={isShowLoginError} isLoadingRequest={isLoadingRequest} />
              </PublicRoute>
            } />

            <Route path={EROUTES.REGISTRATION} element={
              <PublicRoute isRestricted={true} isLoggedIn={loggedIn}>
                <Registration windowWidth={windowWidth} />
              </PublicRoute>
            } />

            <Route path='/person/*' element={
              <ProtectedRoute isAllowed={loggedIn}>
                {
                  currentUser.role === 'expert'
                  ?
                  <Expert windowWidth={windowWidth} onLogout={handleLogout} />
                  :
                  <Person windowWidth={windowWidth} onLogout={handleLogout} onChangeStage={handleChangeStage} />
                }
              </ProtectedRoute>
            } />

            {
              currentUser.role === 'expert' &&
              <Route path='/form/:formId/*' element={
                <ProtectedRoute isAllowed={loggedIn}>
                  <ExpertFormPage windowWidth={windowWidth} onLogout={handleLogout} />
                </ProtectedRoute>
              } />
            }
          </Routes>
        }
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
