import { useState, type FC } from 'react';
import type { IParticipant } from '../interface/interface';

import { ResponsiveBar } from '@nivo/bar';
import ParticipantInfoPopup from './ParticipantInfoPopup';

import {
  buildNominationBarData,
  buildNominationChartRows,
  buildUniversityColorMap,
  type TNominationBarMode,
} from '../utils/buildNominationBarData';

interface IExpertDashboardNominationBarChartProps {
  data: IParticipant[];
}

const MODE_LABELS: Record<TNominationBarMode, string> = {
  submitted: 'Отправили анкету',
  inProgress: 'В процессе',
};

const ExpertDashboardNominationBarChart: FC<IExpertDashboardNominationBarChartProps> = ({
  data,
}) => {
  const [mode, setMode] = useState<TNominationBarMode>('submitted');
  const [isShowParticipantInfo, setIsShowParticipantInfo] = useState(false);
  const [currentParticipants, setCurrentParticipants] = useState<IParticipant[] | null>(null);
  const [popupSubtitle, setPopupSubtitle] = useState('');
  const [popupStatusLabel, setPopupStatusLabel] = useState('');

  const barItems = buildNominationBarData(data, mode);
  const { rows, keys, participantsByCell } = buildNominationChartRows(barItems);
  const colorMap = buildUniversityColorMap(keys);
  const chartColors = keys.map((key) => colorMap[key]);
  const chartHeight = Math.max(280, rows.length * 56 + 100);

  const closePopup = () => {
    setIsShowParticipantInfo(false);
  };

  return (
    <section className='dashboard__section'>
      <div className='dashboard-nomination-header'>
        <h2 className='dashboard__section-title dashboard-nomination-header__title'>
          Статистика по номинациям
        </h2>
        <div className='dashboard-nomination-toggle'>
          {(Object.keys(MODE_LABELS) as TNominationBarMode[]).map((item) => (
            <button
              key={item}
              type='button'
              className={`dashboard-nomination-toggle__btn${
                mode === item ? ' dashboard-nomination-toggle__btn_active' : ''
              }`}
              onClick={() => setMode(item)}
            >
              {MODE_LABELS[item]}
            </button>
          ))}
        </div>
      </div>

      <div className='dashboard__graph' style={{ height: chartHeight }}>
        <ResponsiveBar
          data={rows}
          keys={keys}
          indexBy='rowId'
          layout='horizontal'
          margin={{ top: 20, right: 60, bottom: 80, left: 180 }}
          padding={0.3}
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
              return row?.nominationName ?? String(rowId);
            },
          }}
          colors={chartColors}
          legends={[
            {
              dataFrom: 'keys',
              anchor: 'bottom',
              direction: 'row',
              translateY: 60,
              itemsSpacing: 12,
              itemWidth: 90,
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
              <h6 className='dashboard__tooltip-name'>{row.nominationName}</h6>
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
            setPopupSubtitle(String(id));
            setPopupStatusLabel(`${row.nominationName} · ${MODE_LABELS[mode]}`);
            setIsShowParticipantInfo(true);
          }}
        />
      </div>

      {isShowParticipantInfo && currentParticipants !== null && (
        <ParticipantInfoPopup
          isOpen={isShowParticipantInfo}
          onClose={closePopup}
          currentParticipants={currentParticipants}
          subtitleText={popupSubtitle}
          statusLabel={popupStatusLabel}
        />
      )}
    </section>
  );
};

export default ExpertDashboardNominationBarChart;
