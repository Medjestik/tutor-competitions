import type { FC } from 'react';

import MainLayout from '../../shared/components/Layout/ui/MainLayout';
import StaffBackButton from './components/StaffBackButton';
import ExpertDashboard from '../Expert/components/ExpertDashboard/ui/ExpertDashboard';
import { EROUTES } from '../../shared/utils/ERoutes';

import './staff-learning-applications.css';

const StaffDashboard: FC = () => {
  return (
    <MainLayout>
      <div className='staff-applications'>
        <div className='staff-applications__card'>
          <StaffBackButton fallbackTo={EROUTES.PERSON} />
          <div className='staff-applications__header'>
            <h1 className='staff-applications__title'>Дашборд</h1>
          </div>
          <ExpertDashboard />
        </div>
      </div>
    </MainLayout>
  );
};

export default StaffDashboard;
