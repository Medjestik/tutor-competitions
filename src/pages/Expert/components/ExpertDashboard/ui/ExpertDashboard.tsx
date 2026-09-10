import type { FC } from 'react';
import type {
  IBarItem,
  ICourseDashboardStats,
  IDashboardStats,
  IParticipant,
} from '../interface/interface';

import { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import Preloader from '../../../../../shared/components/Preloader/ui/Preloader';
import Button from '../../../../../shared/components/Button/ui/Button';

import ExpertDashboardBarChart from './ExpertDashboardBarChart';
import ExpertDashboardCourseChart from './ExpertDashboardCourseChart';
import ExpertDashboardNominationBarChart from './ExpertDashboardNominationBarChart';
import ExpertDashboardPieCharts from './ExpertDashboardPieCharts';

import { buildBarData } from '../utils/buildBarData';
import { EMPTY_COURSE_STATS } from '../utils/buildCourseBarData';

import * as api from '../../../../../shared/utils/api';

import '../styles/style.css';

const btnExportStyle = {
  margin: '0',
  fontSize: '18px',
  height: '40px',
  borderRadius: '12px',
  lineHeight: '18px',
  padding: '8px 20px',
  width: '100%',
};

const EMPTY_STATS: IDashboardStats = {
  registrations: 0,
  uniqueUniversities: 0,
  listeners: 0,
  completedTraining: 0,
};

const STAT_CARDS: Array<{ key: keyof IDashboardStats; label: string }> = [
  { key: 'registrations', label: 'Количество регистраций' },
  { key: 'uniqueUniversities', label: 'Уникальное количество вузов' },
  { key: 'listeners', label: 'Заявок на обучение подано' },
  { key: 'completedTraining', label: 'Количество завершивших обучение' },
];

const ExpertDashboard: FC = () => {

  const chartsRef = useRef<HTMLDivElement>(null);

  const [data, setData] = useState<IParticipant[]>([]);
  const [barData, setBarData] = useState<IBarItem[]>([]);
  const [stats, setStats] = useState<IDashboardStats>(EMPTY_STATS);
  const [courseStats, setCourseStats] = useState<ICourseDashboardStats>(EMPTY_COURSE_STATS);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);
  const [isExportingReport, setIsExportingReport] = useState<boolean>(false);

  const getData = () => {
    setIsLoadingData(true);
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoadingData(false);
      return;
    }
    Promise.all([
      api.getDashboardData(token),
      api.getDashboardStats(token),
      api.getDashboardCourseStats(token),
    ])
      .then(([participants, dashboardStats, dashboardCourseStats]) => {
        setData(participants);
        setBarData(buildBarData(participants));
        setStats(dashboardStats);
        setCourseStats(dashboardCourseStats);
      })
      .catch(console.error)
      .finally(() => setIsLoadingData(false));
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

  const exportReport = async () => {
    const token = localStorage.getItem('token');
    if (!token || isExportingReport) return;

    setIsExportingReport(true);
    try {
      const blob = await api.exportDashboardParticipantsReport(token);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'dashboard_participants_report.xlsx';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => window.URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.error('Ошибка при экспорте отчёта:', error);
      window.alert('Не удалось скачать отчёт. Попробуйте ещё раз.');
    } finally {
      setIsExportingReport(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  if (isLoadingData) return <Preloader />;

  return (
    <div className='dashboard'>
      <div className='dashboard-header'>
        <div className='dashboard-header__stats'>
          {STAT_CARDS.map(({ key, label }) => (
            <div className='dashboard-stat-card' key={key}>
              <p className='dashboard-stat-card__value'>{stats[key]}</p>
              <p className='dashboard-stat-card__label'>{label}</p>
            </div>
          ))}
        </div>
        <div className='dashboard-header__export'>
          <Button
            style={btnExportStyle}
            text={isExportingReport ? 'Экспорт…' : 'Экспорт отчёта'}
            onClick={exportReport}
            disabled={isExportingReport}
          />
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
        <ExpertDashboardNominationBarChart data={data} />
        <ExpertDashboardCourseChart courseStats={courseStats} />
        <ExpertDashboardPieCharts data={data} />
      </div>
    </div>
  );
};

export default ExpertDashboard;
