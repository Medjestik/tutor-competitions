import { type FC } from 'react';
import type { IPieChartDatum } from '../interface/interface';

import { ResponsivePie } from '@nivo/pie';
import { customColors } from '../mock/mock';

interface IPieChartProps {
  data: IPieChartDatum[];
  colors?: string[];
  onClickSector?: (id: string | null) => void;
  selectedId?: string | null;
}

const ExpertDashboardPieChart: FC<IPieChartProps> = ({ data, colors, onClickSector, selectedId }) => {
  const handleClick = (node: { id: string | number }) => {
    const id = String(node.id);
    const nextId = selectedId === id ? null : id;
    if (onClickSector) onClickSector(nextId);
  };

  return (
    <ResponsivePie
      data={data}
      colors={colors ? colors : customColors}
      margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
      innerRadius={0.5}
      padAngle={2}
      cornerRadius={2}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor="#000"
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: 'color' }}
      arcLabelsSkipAngle={10}
      arcLabelsTextColor="#fff"
      onClick={handleClick}
      activeOuterRadiusOffset={selectedId ? 8 : 0}
      activeId={selectedId ?? undefined}
      layers={['arcs', 'arcLabels', 'arcLinkLabels', 'legends']}
    />
  );
};

export default ExpertDashboardPieChart;
