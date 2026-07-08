import { Routes, Route } from 'react-router-dom';

import { ToastProvider } from '../ToastProvider/ui/ToastProvider';
import { EROUTES } from '../../utils/ERoutes';
import Landing from '../../../pages/Landing/Landing';
import Login from '../../../pages/Login/ui/Login';
import Registration from '../../../pages/Registration/ui/Registration';

import styles from './app.module.scss';

export const App = () => {

  return (
    <ToastProvider>
      <div className={styles.page}>
        <Routes>
          <Route path={EROUTES.LANDING} element={<Landing />} />
          <Route path={EROUTES.LOGIN} element={<Login />} />
          <Route path={EROUTES.REGISTRATION} element={<Registration />} />
        </Routes>
      </div>
    </ToastProvider>
  );
};
