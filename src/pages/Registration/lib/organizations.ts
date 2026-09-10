import type { ISelectOption } from '../../../shared/components/Select/interface/interface';

export const ORGANIZATION_PLACEHOLDER: ISelectOption = {
  id: 0,
  name: 'Выберите образовательную организацию',
};

export const OTHER_ORGANIZATION: ISelectOption = {
  id: -1,
  name: 'Другая организация',
};

const ORGANIZATION_NAMES = [
  'ВГУВТ',
  'ГМУ им. адм. Ф.Ф. Ушакова',
  'ГУМРФ им. адм. С.О. Макарова',
  'ДВГУПС',
  'ДонИЖТ',
  'ИрГУПС',
  'МАДИ',
  'МГТУ ГА',
  'МГУ им. адм. Г.И. Невельского',
  'ОмГУПС (ОмИИТ)',
  'ПГУПС',
  'ПривГУПС',
  'РГУПС',
  'РУТ (МИИТ)',
  'СГУВТ',
  'СГУПС',
  'СибАДИ',
  'СПбГУ ГА им. А.А. Новикова',
  'УИ ГА',
  'УрГУПС',
  'ХГМА',
];

export const ORGANIZATION_OPTIONS: ISelectOption[] = [
  ORGANIZATION_PLACEHOLDER,
  ...ORGANIZATION_NAMES.map((name, index) => ({
    id: index + 1,
    name,
  })),
  OTHER_ORGANIZATION,
];
