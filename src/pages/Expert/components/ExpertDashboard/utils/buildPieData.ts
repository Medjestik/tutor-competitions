import type { IParticipant, IPieChartDatum } from '../interface/interface';

import { nominationMap } from '../../../../../shared/utils/nominations';

export const buildPieDataByNomination = (participants: IParticipant[]): IPieChartDatum[] => {
  const counters: Record<number, number> = {};
  participants.forEach(p => {
    if (p.nomination != null) counters[p.nomination] = (counters[p.nomination] || 0) + 1;
  });
  return Object.entries(counters).map(([idStr, count]) => {
    const id = Number(idStr);
    const name = nominationMap[id] || `Номинация ${id}`;
    return { id: name, label: name, value: count };
  });
};

export const buildPieDataByNominationStatus = (
  participants: IParticipant[],
  selectedNominationName: string | null
): IPieChartDatum[] => {
  const statuses = { selected: 0, submitted: 0, scored: 0 };

  const shouldInclude = (p: IParticipant): boolean => {
    if (selectedNominationName === null) {
      return p.nomination !== null && p.nomination !== undefined;
    }

    const nominationId = Object.entries(nominationMap).find(([, name]) => name === selectedNominationName)?.[0];
    if (!nominationId) return false;

    return p.nomination === Number(nominationId);
  };

  participants.forEach(p => {
    if (!shouldInclude(p)) return;

    if (p.isScored) {
      statuses.scored += 1;
    } else if (p.isSubmitted) {
      statuses.submitted += 1;
    } else {
      statuses.selected += 1;
    }
  });

  return [
    { id: 'Выбрали номинацию', label: 'Выбрали номинацию', value: statuses.selected },
    { id: 'Отправили анкету', label: 'Отправили анкету', value: statuses.submitted },
    { id: 'Анкета оценена', label: 'Анкета оценена', value: statuses.scored },
  ];
};
