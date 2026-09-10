import type { IParticipant } from '../interface/interface';

import { nominationMap } from '../../../../../shared/utils/nominations';
import { knownUniversities } from './buildBarData';

export type TNominationBarMode = 'submitted' | 'inProgress';

export interface INominationBarUniversity {
  name: string;
  shortName: string;
  participants: IParticipant[];
}

export interface INominationBarItem {
  nominationId: number;
  nominationName: string;
  universities: INominationBarUniversity[];
}

export interface INominationBarChartRow {
  rowId: string;
  nominationName: string;
  [universityShortName: string]: string | number;
}

const CHART_PALETTE = [
  '#E53935',
  '#1E88E5',
  '#43A047',
  '#FB8C00',
  '#8E24AA',
  '#00ACC1',
  '#D81B60',
  '#3949AB',
  '#7CB342',
  '#F4511E',
  '#00897B',
  '#5E35B1',
  '#FFB300',
  '#039BE5',
  '#C0CA33',
];

export const universityColors: Record<string, string> = {
  ВГУВТ: '#E53935',
  ГУМРФ: '#8E24AA',
  ДВГУПС: '#1E88E5',
  ИрГУПС: '#FB8C00',
  МГУ: '#43A047',
  ОмГУПС: '#00ACC1',
  ПРГУПС: '#D81B60',
  РГУПС: '#5E35B1',
  РУТ: '#F4511E',
  СГУПС: '#FFB300',
  СибАДИ: '#7CB342',
  УИГА: '#3949AB',
  УрГУПС: '#00897B',
};

const shortNameFromOrg = (org: string): string => {
  const known = knownUniversities.find((item) => item.name === org);
  if (known) return known.shortName;
  if (org.length <= 16) return org;
  return `${org.slice(0, 14)}…`;
};

export const buildUniversityColorMap = (keys: string[]): Record<string, string> => {
  const used = new Set<string>();
  const map: Record<string, string> = {};
  let paletteIndex = 0;

  keys.forEach((key) => {
    const preferred = universityColors[key];
    if (preferred && !used.has(preferred)) {
      map[key] = preferred;
      used.add(preferred);
      return;
    }

    while (used.has(CHART_PALETTE[paletteIndex % CHART_PALETTE.length])) {
      paletteIndex += 1;
      if (paletteIndex > CHART_PALETTE.length * 2) break;
    }
    const color = CHART_PALETTE[paletteIndex % CHART_PALETTE.length];
    map[key] = color;
    used.add(color);
    paletteIndex += 1;
  });

  return map;
};

export const getUniversityColor = (
  shortName: string,
  colorMap?: Record<string, string>,
): string => colorMap?.[shortName] || universityColors[shortName] || CHART_PALETTE[0];


export const nominationBarTotal = (item: INominationBarItem): number =>
  item.universities.reduce((sum, uni) => sum + uni.participants.length, 0);

export const buildNominationBarData = (
  participants: IParticipant[],
  mode: TNominationBarMode,
): INominationBarItem[] => {
  const filtered = participants.filter((participant) => {
    if (participant.nomination == null) return false;
    if (mode === 'submitted') return participant.isSubmitted;
    return participant.hasFormProgress && !participant.isSubmitted;
  });

  const byNomination = new Map<number, Map<string, INominationBarUniversity>>();

  Object.keys(nominationMap).forEach((idStr) => {
    byNomination.set(Number(idStr), new Map());
  });

  filtered.forEach((participant) => {
    const nominationId = Number(participant.nomination);
    if (!nominationMap[nominationId]) return;

    const org = (participant.educational_organization || '').trim() || 'Не указан';
    let uniMap = byNomination.get(nominationId);
    if (!uniMap) {
      uniMap = new Map();
      byNomination.set(nominationId, uniMap);
    }

    let bucket = uniMap.get(org);
    if (!bucket) {
      bucket = {
        name: org,
        shortName: shortNameFromOrg(org),
        participants: [],
      };
      uniMap.set(org, bucket);
    }
    bucket.participants.push(participant);
  });

  return Array.from(byNomination.entries())
    .map(([nominationId, uniMap]) => ({
      nominationId,
      nominationName: nominationMap[nominationId],
      universities: Array.from(uniMap.values()),
    }))
    .sort(
      (a, b) =>
        nominationBarTotal(a) - nominationBarTotal(b) ||
        a.nominationName.localeCompare(b.nominationName, 'ru'),
    );
};

export const buildNominationChartRows = (
  items: INominationBarItem[],
): { rows: INominationBarChartRow[]; keys: string[]; participantsByCell: Map<string, IParticipant[]> } => {
  const keySet = new Set<string>();
  items.forEach((item) => {
    item.universities.forEach((uni) => {
      if (uni.participants.length > 0) {
        keySet.add(uni.shortName);
      }
    });
  });

  // Стабильный порядок: сначала известные вузы, потом остальные
  const knownOrder = knownUniversities.map((uni) => uni.shortName);
  const keys = [
    ...knownOrder.filter((key) => keySet.has(key)),
    ...Array.from(keySet).filter((key) => !knownOrder.includes(key)).sort((a, b) => a.localeCompare(b, 'ru')),
  ];

  const participantsByCell = new Map<string, IParticipant[]>();

  const rows: INominationBarChartRow[] = items.map((item) => {
    const rowId = String(item.nominationId);
    const row: INominationBarChartRow = {
      rowId,
      nominationName: item.nominationName,
    };

    keys.forEach((key) => {
      row[key] = 0;
    });

    item.universities.forEach((uni) => {
      if (!keySet.has(uni.shortName)) return;
      row[uni.shortName] = uni.participants.length;
      participantsByCell.set(`${rowId}::${uni.shortName}`, uni.participants);
    });

    return row;
  });

  return { rows, keys, participantsByCell };
};
