import { useState, type FC } from 'react';
import type {
  ICourseDashboardStats,
  IParticipant,
  TCourseStatusKey,
} from '../interface/interface';

import { ResponsiveBar } from '@nivo/bar';
import ParticipantInfoPopup from './ParticipantInfoPopup';

import {
  COURSE_CARD_LABELS,
  COURSE_STATUS_COLORS,
  COURSE_STATUS_LABELS,
  buildCourseChartRows,
} from '../utils/buildCourseBarData';

interface IExpertDashboardCourseChartProps {
  courseStats: ICourseDashboardStats;
}

const ExpertDashboardCourseChart: FC<IExpertDashboardCourseChartProps> = ({
  courseStats,
}) => {
  const [isShowParticipantInfo, setIsShowParticipantInfo] = useState(false);
  const [currentParticipants, setCurrentParticipants] = useState<IParticipant[] | null>(
    null,
  );
  const [popupSubtitle, setPopupSubtitle] = useState('');
  const [popupStatusLabel, setPopupStatusLabel] = useState('');

  const { rows, keys, participantsByCell } = buildCourseChartRows(
    courseStats.byUniversity,
  );
  const chartHeight = Math.max(420, rows.length * 40);
  const chartColors = keys.map((label) => {
    const entry = Object.entries(COURSE_STATUS_LABELS).find(([, value]) => value === label);
    return entry
      ? COURSE_STATUS_COLORS[entry[0] as TCourseStatusKey]
      : '#9E9E9E';
  });

  const openStatusParticipants = (key: TCourseStatusKey) => {
    const participants = courseStats.byUniversity.flatMap((uni) => uni[key]);
    if (participants.length === 0) return;
    setCurrentParticipants(participants);
    setPopupSubtitle('Все вузы');
    setPopupStatusLabel(COURSE_STATUS_LABELS[key]);
    setIsShowParticipantInfo(true);
  };

  return (
    <section className='dashboard__section'>
      <h2 className='dashboard__section-title'>Статистика по курсу</h2>

      <div className='dashboard-course-cards'>
        {COURSE_CARD_LABELS.map(({ key, label }) => (
          <button
            type='button'
            className='dashboard-course-card'
            key={key}
            style={{ backgroundColor: COURSE_STATUS_COLORS[key] }}
            onClick={() => openStatusParticipants(key)}
          >
            <p className='dashboard-course-card__value'>{courseStats.cards[key]}</p>
            <p className='dashboard-course-card__label'>{label}</p>
          </button>
        ))}
      </div>

      <div className='dashboard__graph' style={{ height: chartHeight }}>
        <ResponsiveBar
          data={rows}
          keys={keys}
          indexBy='rowId'
          layout='horizontal'
          margin={{ top: 60, right: 60, bottom: 40, left: 100 }}
          padding={0.25}
          groupMode='stacked'
          enableLabel={false}
          valueScale={{ type: 'linear' }}
          indexScale={{ type: 'band', round: true }}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
          }}
          axisLeft={{
            tickSize: 0,
            tickPadding: 8,
            format: (rowId) => {
              const row = rows.find((item) => item.rowId === String(rowId));
              return row?.shortName ?? String(rowId);
            },
          }}
          colors={chartColors}
          legends={[
            {
              dataFrom: 'keys',
              anchor: 'top',
              direction: 'row',
              translateY: -50,
              itemsSpacing: 16,
              itemWidth: 140,
              itemHeight: 18,
              itemDirection: 'left-to-right',
              symbolSize: 12,
            },
          ]}
          layers={[
            'grid',
            'axes',
            'bars',
            'markers',
            'legends',
            ({ bars }) => {
              const totalsByIndex = new Map<
                string,
                { total: number; x: number; y: number; height: number }
              >();

              bars.forEach((bar) => {
                const indexValue = String(bar.data.indexValue);
                const row = bar.data.data;
                const total = keys.reduce((sum, key) => {
                  const value = row[key];
                  return sum + (typeof value === 'number' ? value : 0);
                }, 0);
                const existing = totalsByIndex.get(indexValue);
                if (!existing || bar.x + bar.width > existing.x) {
                  totalsByIndex.set(indexValue, {
                    total,
                    x: bar.x + bar.width,
                    y: bar.y,
                    height: bar.height,
                  });
                }
              });

              return (
                <g>
                  {Array.from(totalsByIndex.entries()).map(([indexValue, info]) => (
                    <text
                      key={`${indexValue}-sum`}
                      x={info.x + 8}
                      y={info.y + info.height / 2}
                      textAnchor='start'
                      dominantBaseline='central'
                      fill='#000'
                      fontSize={13}
                    >
                      {info.total}
                    </text>
                  ))}
                </g>
              );
            },
          ]}
          tooltip={({ id, value, data: row }) => (
            <div className='dashboard__tooltip'>
              <h6 className='dashboard__tooltip-name'>{row.originalName}</h6>
              <p className='dashboard__tooltip-text'>
                {id}: {value}
              </p>
            </div>
          )}
          onClick={({ id, indexValue, data: row }) => {
            const cellKey = `${String(indexValue)}::${String(id)}`;
            const participants = participantsByCell.get(cellKey) ?? [];
            if (participants.length === 0) return;

            setCurrentParticipants(participants);
            setPopupSubtitle(String(row.originalName));
            setPopupStatusLabel(String(id));
            setIsShowParticipantInfo(true);
          }}
        />
      </div>

      {isShowParticipantInfo && currentParticipants !== null && (
        <ParticipantInfoPopup
          isOpen={isShowParticipantInfo}
          onClose={() => setIsShowParticipantInfo(false)}
          currentParticipants={currentParticipants}
          subtitleText={popupSubtitle}
          statusLabel={popupStatusLabel}
        />
      )}
    </section>
  );
};

export default ExpertDashboardCourseChart;
