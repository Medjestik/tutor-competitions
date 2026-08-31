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
  'ГУМРФ',
  'ДВГУПС',
  'ИрГУПС',
  'МГУ им. адм. Г.И. Невельского',
  'ОмГУПС (ОмИИТ)',
  'ПривГУПС',
  'РГУПС',
  'РУТ (МИИТ)',
  'СГУПС',
  'СибАДИ',
  'УИГА',
  'УрГУПС',
];

export const ORGANIZATION_OPTIONS: ISelectOption[] = [
  ORGANIZATION_PLACEHOLDER,
  ...ORGANIZATION_NAMES.map((name, index) => ({
    id: index + 1,
    name,
  })),
  OTHER_ORGANIZATION,
];
