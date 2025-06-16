import type { FC } from 'react';

import { ResponsivePie } from '@nivo/pie';
import { ResponsiveBar } from '@nivo/bar';

import { barData } from '../mock/mock';

import '../styles/style.css';

const data = [
  {
    id: 'Территория роста',
    label: 'Территория роста',
    value: 200,
  },
  {
    id: 'Технологии партнерства',
    label: 'Технологии партнерства',
    value: 160,
  },
  {
    id: 'Педагогический прием',
    label: 'Педагогический прием',
    value: 80,
  },
  {
    id: 'Технологии и инновации',
    label: 'Технологии и инновации',
    value: 175,
  },
  {
    id: 'Цифровой педагог',
    label: 'Цифровой педагог',
    value: 70,
  }
];

const customColors = [
  '#4CAF50',
  '#F57C00',
  '#D32F2F',
  '#073AE9',
  '#7B1FA2'
];

const displayKeyLabels: Record<string, string> = {
  registered: 'Прошли регистрацию',
  nominationSelected: 'Выбрали номинацию',
  formSubmitted: 'Отправили анкету',
};

const ExpertDashboard: FC = () => {

  const keys = Object.values(displayKeyLabels);

  const transformedData = barData.map(item => {
    const { registered, nominationSelected, formSubmitted, ...rest } = item;
    return {
      ...rest,
      [displayKeyLabels.registered]: registered,
      [displayKeyLabels.nominationSelected]: nominationSelected,
      [displayKeyLabels.formSubmitted]: formSubmitted,
      originalName: item.name,
    };
  });

  return (
    <div className='dashboard'>
      <section className='dashboard__section'>
        <h2 className='dashboard__section-title'>Статистика по университетам</h2>
        <div className='dashboard__graph'>
          <ResponsiveBar
            data={transformedData}
            keys={keys}
            indexBy="shortName"
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
                justify: false,
                translateY: -50,
                itemsSpacing: 20,
                itemWidth: 150,
                itemHeight: 20,
                itemDirection: 'left-to-right',
                symbolSize: 12,
                effects: [
                  {
                    on: 'hover',
                    style: {
                      itemOpacity: 1,
                    },
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
                    const data = bar.data.data as unknown as Record<string, number>;
                    const total = keys.reduce((sum, key) => sum + (data[key] || 0), 0);
            
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
          />
        </div>
      </section>
      <section className='dashboard__section'> 
        <h2 className='dashboard__section-title'>Статистика по номинациям</h2>
        <div className='dashboard__graph'>
          <ResponsivePie
            data={data}
            colors={customColors}
            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
            innerRadius={0.5}
            padAngle={2}
            cornerRadius={2}
            activeOuterRadiusOffset={8}
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsTextColor="#000000"
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{ from: 'color' }}
            arcLabelsSkipAngle={10}
             arcLabelsTextColor="#ffffff"
        />
        </div>
      </section>
    </div>

  );
};

export default ExpertDashboard;
