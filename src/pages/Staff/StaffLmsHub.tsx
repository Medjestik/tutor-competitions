import type { FC } from 'react';

import { Link } from 'react-router-dom';

import MainLayout from '../../shared/components/Layout/ui/MainLayout';
import StaffBackButton from './components/StaffBackButton';
import { EROUTES } from '../../shared/utils/ERoutes';

import './staff-lms.css';

const StaffLmsHub: FC = () => {
  return (
    <MainLayout
      mainContainer={false}
      transparentMain
    >
      <div className='staff-lms'>
        <div className='staff-lms__card'>
          <StaffBackButton fallbackTo={EROUTES.PERSON} />
          <h1 className='staff-lms__title'>Конструктор Mini-LMS</h1>
          <p className='staff-lms__subtitle'>
            Создание и редактирование курсов, тестов и заданий.
          </p>
          <div className='staff-lms__nav' style={{ marginTop: 24 }}>
            <Link className='staff-lms__nav-link' to={EROUTES.STAFF_LMS_COURSES}>
              Курсы
            </Link>
            <Link className='staff-lms__nav-link' to={EROUTES.STAFF_LMS_TESTS}>
              Тесты
            </Link>
            <Link className='staff-lms__nav-link' to={EROUTES.STAFF_LMS_TASKS}>
              Задания
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default StaffLmsHub;
