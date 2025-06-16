import type { FC } from 'react';
import type { IExpertProps } from '../interface/interface';

import { Navigate, Routes, Route, useLocation } from 'react-router-dom';

import MainLayout from '../../../shared/components/Layout/ui/MainLayout';
import PersonContainer from '../../Person/components/PersonContainer/ui/PersonContainer';
import ExpertNominations from '../components/ExpertNominations/ui/ExpertNominations';
import ExpertForms from '../components/ExpertForms/ui/ExpertForms';
import ExpertDashboard from '../components/ExpertDashboard/ui/ExpertDashboard';
import Tabs from '../../../shared/components/Tabs/ui/Tabs';

import '../styles/style.css';

const tabs = [
  {
    name: 'Оценка анкет',
    location: 'nominations',
    id: 'nominations'
  },
  {
    name: 'Дашборд',
    location: 'dashboard',
    id: 'dashboard'
  },
];

const Expert: FC<IExpertProps> = ({ windowWidth, onLogout }) => {

  const location = useLocation();
  const showTabs = location.pathname.includes('/menu');

  return (
    <MainLayout mainContainer={false} windowWidth={windowWidth} onLogout={onLogout}> 
      <div className='person'>
        <PersonContainer>
          <div className='expert'>
            {showTabs && <Tabs rootPath='/person/menu' tabs={tabs} />}
            <Routes>

              <Route path='menu/nominations' element={<ExpertNominations />} />
              <Route path='menu/dashboard' element={<ExpertDashboard />} />

              <Route path='nomination/:nominationId' element={<ExpertForms />} />

              <Route path='*' element={<Navigate to='/person/menu' replace />} />
            </Routes>
          </div>
        </PersonContainer>
      </div>
    </MainLayout>
  );
};

export default Expert;
