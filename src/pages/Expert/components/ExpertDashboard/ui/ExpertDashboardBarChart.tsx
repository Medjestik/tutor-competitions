import { useState, type FC } from 'react';
import type { IBarItem, IParticipant, IBarDataWithLabels } from '../interface/interface';

import { ResponsiveBar } from '@nivo/bar';
import ParticipantInfoPopup from './ParticipantInfoPopup';

import { displayKeyLabels, keys, universityTotal } from '../utils/buildBarData';

interface IUniversityBarChartProps {
  barData: IBarItem[];
}

interface IParticipantMap {
  registered: IParticipant[];
  nominationSelected: IParticipant[];
  formSubmitted: IParticipant[];
}

interface IChartRow extends IBarDataWithLabels {
  rowId: string;
}

const rowTotal = (item: IBarItem): number => universityTotal(item);

const ExpertDashboardBarChart: FC<IUniversityBarChartProps> = ({ barData }) => {
  const [isShowParticipantInfo, setIsShowParticipantInfo] = useState<boolean>(false);
  const [currentParticipants, setCurrentParticipants] = useState<IParticipant[] | null>(null);
  const [currentUniversityName, setCurrentUniversityName] = useState<string>('');
  const [currentStatusLabel, setCurrentStatusLabel] = useState<string>('');

  // Nivo horizontal: первый элемент снизу → сортируем по возрастанию, чтобы большее было сверху
  const sorted = [...barData].sort(
    (a, b) => rowTotal(a) - rowTotal(b) || a.name.localeCompare(b.name, 'ru'),
  );
  const participantMap = new Map<string, IParticipantMap>();
  const transformedData: IChartRow[] = sorted.map((item) => {
    const rowId = String(item.id);
    participantMap.set(rowId, {
      registered: item.registered,
      nominationSelected: item.nominationSelected,
      formSubmitted: item.formSubmitted,
    });

    return {
      rowId,
      shortName: item.shortName,
      originalName: item.name,
      [displayKeyLabels.registered]: item.registered.length,
      [displayKeyLabels.nominationSelected]: item.nominationSelected.length,
      [displayKeyLabels.formSubmitted]: item.formSubmitted.length,
    };
  });
  const chartHeight = Math.max(420, sorted.length * 40);

  const handleOpenParticipantInfo = (
    participants: IParticipant[],
    universityName: string,
    statusLabel: string,
  ) => {
    setCurrentParticipants(participants);
    setCurrentUniversityName(universityName);
    setCurrentStatusLabel(statusLabel);
    setIsShowParticipantInfo(true);
  };

  const closePopup = () => {
    setIsShowParticipantInfo(false);
  };

  return (
    <>
      <div style={{ height: chartHeight, width: '100%' }}>
        <ResponsiveBar
          data={transformedData}
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
            legendPosition: 'middle',
            legendOffset: 36,
          }}
          axisLeft={{
            tickSize: 0,
            tickPadding: 8,
            format: (rowId) => {
              const row = transformedData.find((item) => item.rowId === String(rowId));
              return row?.shortName ?? String(rowId);
            },
          }}
          colors={({ id }) => {
            const colorMap: Record<string, string> = {
              'Только регистрация': '#D32F2F',
              'В процессе': '#F57C00',
              'Отправили анкету': '#4CAF50',
            };
            return colorMap[id as string] || '#ccc';
          }}
          legends={[
            {
              dataFrom: 'keys',
              anchor: 'top',
              direction: 'row',
              translateY: -50,
              itemsSpacing: 20,
              itemWidth: 150,
              itemHeight: 20,
              itemDirection: 'left-to-right',
              symbolSize: 12,
              effects: [
                {
                  on: 'hover',
                  style: { itemOpacity: 1 },
                },
              ],
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
                const data = bar.data.data as IChartRow;
                const indexValue = String(bar.data.indexValue);
                const total = keys.reduce((sum: number, key: string) => {
                  const value = data[key];
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
                      fontWeight={400}
                    >
                      {info.total}
                    </text>
                  ))}
                </g>
              );
            },
          ]}
          tooltip={({ id, value, data }) => (
            <div className='dashboard__tooltip'>
              <h6 className='dashboard__tooltip-name'>{data.originalName}</h6>
              <p className='dashboard__tooltip-text'>
                {id}: {value}
              </p>
            </div>
          )}
          onClick={({ id, indexValue, data }) => {
            const rowId = String(indexValue);
            const label = id as string;
            const originalName = data.originalName as string;

            const participantGroup = participantMap.get(rowId);
            if (!participantGroup) return;

            let selectedArray: IParticipant[] = [];

            if (label === displayKeyLabels.registered) {
              selectedArray = participantGroup.registered;
            } else if (label === displayKeyLabels.nominationSelected) {
              selectedArray = participantGroup.nominationSelected;
            } else if (label === displayKeyLabels.formSubmitted) {
              selectedArray = participantGroup.formSubmitted;
            }

            handleOpenParticipantInfo(selectedArray, originalName, label);
          }}
        />
      </div>
      {isShowParticipantInfo && currentParticipants !== null && (
        <ParticipantInfoPopup
          isOpen={isShowParticipantInfo}
          onClose={closePopup}
          currentParticipants={currentParticipants}
          subtitleText={currentUniversityName}
          statusLabel={currentStatusLabel}
        />
      )}
    </>
  );
};

export default ExpertDashboardBarChart;
