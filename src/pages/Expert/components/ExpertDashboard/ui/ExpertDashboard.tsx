import type { FC } from 'react';
import type { IBarItem, IParticipant } from '../interface/interface';

import { useState, useEffect } from 'react';

import Preloader from '../../../../../shared/components/Preloader/ui/Preloader';

import ExpertDashboardBarChart from './ExpertDashboardBarChart';
import ExpertDashboardPieCharts from './ExpertDashboardPieCharts';

import { buildBarData } from '../utils/buildBarData';

import * as api from '../../../../../shared/utils/api';

import '../styles/style.css';

const ExpertDashboard: FC = () => {
  const [data, setData] = useState<IParticipant[]>([]);
  const [barData, setBarData] = useState<IBarItem[]>([]);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);

  const getData = () => {
    setIsLoadingData(true);
    const token = localStorage.getItem('token');
    if (token) {
      api.getDashboardData(token)
        .then(res => {
          setData(res);
          setBarData(buildBarData(res));
        })
        .catch(console.error)
        .finally(() => setIsLoadingData(false));
    }
  };

  useEffect(() => {
    getData();
  }, []);

  if (isLoadingData) return <Preloader />;

  return (
    <div className='dashboard'>
      <section className='dashboard__section'>
        <h2 className='dashboard__section-title'>Статистика по университетам</h2>
        <div className='dashboard__graph'>
          <ExpertDashboardBarChart barData={barData} />
        </div>
      </section>
      <ExpertDashboardPieCharts data={data} />
    </div>
  );
};

export default ExpertDashboard;
