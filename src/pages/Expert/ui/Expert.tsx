import type { FC } from 'react';

import { Navigate, Routes, Route, useLocation } from 'react-router-dom';

import MainLayout from '../../../shared/components/Layout/ui/MainLayout';
import PersonContainer from '../../Person/components/PersonContainer/ui/PersonContainer';
import ExpertNominations from '../components/ExpertNominations/ui/ExpertNominations';
import ExpertForms from '../components/ExpertForms/ui/ExpertForms';
import ExpertDashboard from '../components/ExpertDashboard/ui/ExpertDashboard';
import ExpertFormPage from '../components/ExpertFormPage/ui/ExpertFormPage';
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

const Expert: FC = () => {

  const location = useLocation();
  const showTabs = location.pathname.includes('/menu');

  return (
    <MainLayout mainContainer={false}> 
      <div className='person'>
        <PersonContainer>
          <div className='expert'>
            {showTabs && <Tabs rootPath='/person/menu' tabs={tabs} />}
            <Routes>

              <Route path='menu' element={<Navigate to='/person/menu/nominations' replace />} />
              <Route path='menu/nominations' element={<ExpertNominations />} />
              <Route path='menu/dashboard' element={<ExpertDashboard />} />

              <Route path='nomination/:nominationId' element={<ExpertForms />} />

              <Route path='nomination/:nominationId/form/:formId/*' element={<ExpertFormPage />} />

              <Route path='*' element={<Navigate to='/person/menu/nominations' replace />} />
            </Routes>
          </div>
        </PersonContainer>
      </div>
    </MainLayout>
  );
};

export default Expert;
