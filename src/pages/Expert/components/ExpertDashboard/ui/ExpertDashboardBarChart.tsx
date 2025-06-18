import { useState, type FC } from 'react';
import type { IBarItem, IParticipant, IBarDataWithLabels } from '../interface/interface';

import { ResponsiveBar } from '@nivo/bar';
import ParticipantInfoPopup from './ParticipantInfoPopup';

import { displayKeyLabels, keys } from '../utils/buildBarData';

interface IUniversityBarChartProps {
  barData: IBarItem[];
}

interface IParticipantMap {
  registered: IParticipant[],
  nominationSelected: IParticipant[],
  formSubmitted: IParticipant[],
}

const ExpertDashboardBarChart: FC<IUniversityBarChartProps> = ({ barData }) => {

  const [isShowParticipantInfo, setIsShowParticipantInfo] = useState<boolean>(false);
  const [currentParticipants, setCurrentParticipants] = useState<IParticipant[] | null>(null);
  const [currentUniversityName, setCurrentUniversityName] = useState<string>('');
  const [currentStatusLabel, setCurrentStatusLabel] = useState<string>('');

  const participantMap = new Map<string, IParticipantMap>();

  const transformedData = barData.map(item => {
    participantMap.set(item.shortName, {
      registered: item.registered,
      nominationSelected: item.nominationSelected,
      formSubmitted: item.formSubmitted,
    });

    return {
      shortName: item.shortName,
      originalName: item.name,
      [displayKeyLabels.registered]: item.registered.length,
      [displayKeyLabels.nominationSelected]: item.nominationSelected.length,
      [displayKeyLabels.formSubmitted]: item.formSubmitted.length,
    };
  });

  const handleOpenParticipantInfo = (participants: IParticipant[], universityName: string, statusLabel: string) => {
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
    <ResponsiveBar
      data={transformedData}
      keys={keys}
      indexBy='shortName'
      margin={{ top: 60, right: 45, bottom: 60, left: 45 }}
      padding={0.3}
      groupMode="stacked"
      enableLabel={false}
      axisBottom={{
        tickRotation: -45,
        legendPosition: 'middle',
        legendOffset: 50,
      }}
      colors={({ id }) => {
        const colorMap: Record<string, string> = {
          'Прошли регистрацию': '#D32F2F',
          'Выбрали номинацию': '#F57C00',
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
        ({ bars, yScale }) => (
          <g>
            {bars.map(bar => {
              const data = bar.data.data as IBarDataWithLabels;
              const total = keys.reduce((sum: number, key: string) => {
                const value = data[key];
                return sum + (typeof value === 'number' ? value : 0);
              }, 0);

              return (
                <text
                  key={bar.key + '-sum'}
                  x={bar.x + bar.width / 2}
                  y={yScale(total) - 6}
                  textAnchor="middle"
                  fill="#000"
                  fontSize={14}
                  fontWeight={400}
                >
                  {total}
                </text>
              );
            })}
          </g>
        ),
      ]}
      tooltip={({ id, value, data }) => (
        <div className='dashboard__tooltip'>
          <h6 className='dashboard__tooltip-name'>{data.originalName}</h6>
          <p className='dashboard__tooltip-text'>{id}: {value}</p>
        </div>
      )}
      onClick={({ id, indexValue, data }) => {
        const shortName = indexValue as string;
        const label = id as string;
        const originalName = data.originalName as string;
      
        const participantGroup = participantMap.get(shortName);
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
    {
      isShowParticipantInfo && currentParticipants !== null &&
      <ParticipantInfoPopup 
        isOpen={isShowParticipantInfo}
        onClose={closePopup}
        currentParticipants={currentParticipants}
        subtitleText={currentUniversityName}
        statusLabel={currentStatusLabel}
      />
    }
    </>
  );
};

export default ExpertDashboardBarChart;
