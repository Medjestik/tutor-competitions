import type {
  ICourseDashboardStats,
  ICourseUniversityStats,
  IParticipant,
  TCourseStatusKey,
} from '../interface/interface';

export const COURSE_STATUS_LABELS: Record<TCourseStatusKey, string> = {
  filling: 'Заполняют документы',
  waiting: 'Ждут проверки',
  studying: 'Учатся',
  completed: 'Успешно закончили',
  expelled: 'Отчислены',
};

export const COURSE_STATUS_KEYS: TCourseStatusKey[] = [
  'filling',
  'waiting',
  'studying',
  'completed',
  'expelled',
];

export const COURSE_STATUS_COLORS: Record<TCourseStatusKey, string> = {
  filling: '#E53935',
  waiting: '#FB8C00',
  studying: '#43A047',
  completed: '#1E88E5',
  expelled: '#212121',
};

export const COURSE_CARD_LABELS: Array<{ key: TCourseStatusKey; label: string }> = [
  { key: 'filling', label: 'заполняют' },
  { key: 'waiting', label: 'ждут' },
  { key: 'studying', label: 'учатся' },
  { key: 'completed', label: 'обучено' },
  { key: 'expelled', label: 'отчислено' },
];

export interface ICourseChartRow {
  rowId: string;
  shortName: string;
  originalName: string;
  [statusLabel: string]: string | number;
}

export const courseUniversityTotal = (item: ICourseUniversityStats): number =>
  COURSE_STATUS_KEYS.reduce((sum, key) => sum + item[key].length, 0);

export const buildCourseChartRows = (
  byUniversity: ICourseUniversityStats[],
): {
  rows: ICourseChartRow[];
  keys: string[];
  participantsByCell: Map<string, IParticipant[]>;
} => {
  // Nivo horizontal: первый снизу → сортируем по возрастанию, больше сверху
  const sorted = [...byUniversity].sort(
    (a, b) =>
      courseUniversityTotal(a) - courseUniversityTotal(b) ||
      a.name.localeCompare(b.name, 'ru'),
  );

  const keys = COURSE_STATUS_KEYS.map((key) => COURSE_STATUS_LABELS[key]);
  const participantsByCell = new Map<string, IParticipant[]>();

  const rows: ICourseChartRow[] = sorted.map((item) => {
    const rowId = String(item.id);
    const row: ICourseChartRow = {
      rowId,
      shortName: item.shortName,
      originalName: item.name,
    };

    COURSE_STATUS_KEYS.forEach((key) => {
      const label = COURSE_STATUS_LABELS[key];
      row[label] = item[key].length;
      participantsByCell.set(`${rowId}::${label}`, item[key]);
    });

    return row;
  });

  return { rows, keys, participantsByCell };
};

export const EMPTY_COURSE_STATS: ICourseDashboardStats = {
  cards: {
    filling: 0,
    waiting: 0,
    studying: 0,
    completed: 0,
    expelled: 0,
  },
  byUniversity: [],
};
