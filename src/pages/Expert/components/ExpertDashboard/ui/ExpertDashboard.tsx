import type { FC } from 'react';
import type { IBarItem, IParticipant } from '../interface/interface';

import { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import Preloader from '../../../../../shared/components/Preloader/ui/Preloader';
import Button from '../../../../../shared/components/Button/ui/Button';

import ExpertDashboardBarChart from './ExpertDashboardBarChart';
import ExpertDashboardPieCharts from './ExpertDashboardPieCharts';

import { buildBarData } from '../utils/buildBarData';

import * as api from '../../../../../shared/utils/api';

import '../styles/style.css';

const btnExportStyle = {
  margin: '0',
  fontSize: '18px',
  height: '40px',
  borderRadius: '12px',
  lineHeight: '18px',
  padding: '8px 20px',
};

const ExpertDashboard: FC = () => {

  const chartsRef = useRef<HTMLDivElement>(null);

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

  const exportAsPdf = async () => {
    if (!chartsRef.current) return;
    try {
      const canvas = await html2canvas(chartsRef.current);
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('charts.pdf');
    } catch (error) {
      console.error('Ошибка при экспорте PDF:', error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  if (isLoadingData) return <Preloader />;

  return (
    <div className='dashboard'>
      <div className='dashboard-header' style={{ display: 'flex', gap: 10 }}>
        <p className='dashboard-header__title'>Количество регистраций: {data.length}</p>
        <div className='dashboard-header__export'>
          <Button style={btnExportStyle} text='Экспорт графиков' onClick={exportAsPdf} />
        </div>
      </div>
      <div className='dashboard__container' style={{ display: 'flex', flexDirection: 'column', gap: 20 }} ref={chartsRef}>
        <section className='dashboard__section'>
          <h2 className='dashboard__section-title'>Статистика по университетам</h2>
          <div className='dashboard__graph'>
            <ExpertDashboardBarChart barData={barData} />
          </div>
        </section>
        <ExpertDashboardPieCharts data={data} />
      </div>
    </div>
  );
};

export default ExpertDashboard;
