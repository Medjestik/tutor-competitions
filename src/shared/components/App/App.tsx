import './App.css';

import type { ILoginData } from '../../../features/login/interface/interface';
import type { IFormError } from '../Form/interface/interface';
import type { ICurrentTeam } from './interface';

import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

import Landing from '../../../pages/Landing/Landing';
import History from '../../../pages/History/History';
import Preloader from '../Preloader/ui/Preloader';
import { EROUTES } from '../../utils/ERoutes';
import { initialTeam, CurrentTeamContext } from '../../context/team';
import LoginPopup from '../../../features/login/ui/LoginPopup';

import * as api from '../../../shared/utils/api';

function App() {

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [currentTeam, setCurrentTeam] = useState<ICurrentTeam>(initialTeam);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  const [isLoadingPage, setIsLoadingPage] = useState<boolean>(false);

  const [isLoadingRequest, setIsLoadingRequest] = useState<boolean>(false);
  const [isShowLoginError, setIsShowLoginError] = useState<IFormError>({ text: '', isShow: false });

  const [isOpenLoginPopup, setIsOpenLoginPopup] = useState<boolean>(false);

  const openLoginPopup = () => {
    setIsOpenLoginPopup(true);
  };

  const closePopup = () => {
    setIsOpenLoginPopup(false);
  };

  const tokenCheck = () => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoadingPage(true);
      api.getTeam(token)
      .then((res) => {
        setCurrentTeam(res);
        setLoggedIn(true);
        navigate('/person-test');
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

  /*
  const handleChangeStage = (stageId: number) => {
    setCurrentTeam({ ...currentTeam, current_stage: stageId });
  };
  */

  const handleLogin = (data: ILoginData) => {
    setIsLoadingRequest(true);
    setIsShowLoginError({ text: '', isShow: false });
    api.login(data)
    .then((res) => {
      localStorage.setItem('token', res.key);
      tokenCheck();
      closePopup();
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

  /*
  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
    navigate(EROUTES.LANDING);
  };
  */

  useEffect(() => {
    // tokenCheck();
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
    <CurrentTeamContext.Provider value={currentTeam}>
      <div className='page'>
        {
          isLoadingPage
          ?
          <Preloader />
          :
          <Routes>
            <Route path={EROUTES.LANDING} element={<Landing onLogin={openLoginPopup} windowWidth={windowWidth} />} />
            <Route path={EROUTES.HISTORY} element={<History windowWidth={windowWidth} />} />
            {
              loggedIn &&
              <Route path={EROUTES.PERSON} element={<div />} />
            }
          </Routes>
        }
        {
        isOpenLoginPopup &&
        <LoginPopup 
          isOpen={isOpenLoginPopup}
          onClose={closePopup}
          onSubmit={handleLogin}
          loginError={isShowLoginError}
          isLoadingRequest={isLoadingRequest}
        />
      }
      </div>
    </CurrentTeamContext.Provider>
  );
}

export default App;
