import { IParticipant, IBarItem } from '../interface/interface';

export const knownUniversities: Omit<IBarItem, 'registered' | 'nominationSelected' | 'formSubmitted'>[] = [
  { id: 1, name: 'Российский университет транспорта', shortName: 'РУТ' },
  { id: 2, name: 'Дальневосточный государственный университет путей сообщения', shortName: 'ДВГУПС' },
  { id: 3, name: 'Иркутский государственный университет путей сообщения', shortName: 'ИрГУПС' },
  { id: 4, name: 'Омский государственный университет путей сообщения', shortName: 'ОмГУПС' },
  { id: 5, name: 'Петербургский государственный университет путей сообщения', shortName: 'ПГУПС' },
  { id: 6, name: 'Ростовский государственный университет путей сообщения', shortName: 'РГУПС' },
  { id: 7, name: 'Приволжский государственный университет путей сообщения', shortName: 'ПРГУПС' },
  { id: 8, name: 'Сибирский государственный университет путей сообщения', shortName: 'СГУПС' },
  { id: 9, name: 'Уральский государственный университет путей сообщения', shortName: 'УрГУПС' },
  { id: 10, name: 'Донецкий институт железнодорожного транспорта', shortName: 'ДИЖТ' },
  { id: 11, name: 'ГУМРФ им. адмирала С.О. Макарова', shortName: 'ГУМРФ' },
  { id: 12, name: 'Волжский государственный университет водного транспорта', shortName: 'ВГУВТ' },
  { id: 13, name: 'Херсонская государственная морская академия', shortName: 'ХГМА' },
  { id: 14, name: 'Государственный морской университет им. Ф.Ф. Ушакова', shortName: 'ГМУ' },
  { id: 15, name: 'Морской государственный университет им. Г.И. Невельского', shortName: 'МГУ' },
  { id: 16, name: 'Сибирский государственный университет водного транспорта', shortName: 'СГУВТ' },
  { id: 17, name: 'Московский государственный технический университет гражданской авиации', shortName: 'МГТУ ГА' },
  { id: 18, name: 'СПбГУ гражданской авиации им. А.А. Новикова', shortName: 'СПбГУ ГА' },
  { id: 19, name: 'УИ гражданской авиации им. Б.П. Бугаева', shortName: 'УИ ГА' },
  { id: 20, name: 'Московский автомобильно-дорожный государственный технический университет', shortName: 'МАДИ' },
  { id: 21, name: 'Сибирский государственный автомобильно-дорожный университет', shortName: 'СибАДИ' },
  { id: 22, name: 'Другие университеты', shortName: 'Другое' },
];

export const displayKeyLabels: Record<string, string> = {
  registered: 'Прошли регистрацию',
  nominationSelected: 'Выбрали номинацию',
  formSubmitted: 'Отправили анкету',
};

export const keys = Object.values(displayKeyLabels);

const organizationAliases: Record<string, string> = {
  'РУТ (МИИТ)': 'Российский университет транспорта',
  'ПривГУПС': 'Приволжский государственный университет путей сообщения',
  'ОмГУПС (ОмИИТ)': 'Омский государственный университет путей сообщения',
  'МГУ им. адм. Г.И. Невельского': 'Морской государственный университет им. Г.И. Невельского',
  'УИГА': 'УИ гражданской авиации им. Б.П. Бугаева',
  'ВГУВТ': 'Волжский государственный университет водного транспорта',
  'ГУМРФ': 'ГУМРФ им. адмирала С.О. Макарова',
  'ДВГУПС': 'Дальневосточный государственный университет путей сообщения',
  'ИрГУПС': 'Иркутский государственный университет путей сообщения',
  'РГУПС': 'Ростовский государственный университет путей сообщения',
  'СГУПС': 'Сибирский государственный университет путей сообщения',
  'СибАДИ': 'Сибирский государственный автомобильно-дорожный университет',
  'УрГУПС': 'Уральский государственный университет путей сообщения',
};

const resolveUniversityKey = (organization: string, resultMap: Map<string, IBarItem>): string => {
  if (resultMap.has(organization)) {
    return organization;
  }

  const aliasKey = organizationAliases[organization];
  if (aliasKey && resultMap.has(aliasKey)) {
    return aliasKey;
  }

  const byShortName = knownUniversities.find((university) => university.shortName === organization);
  if (byShortName && resultMap.has(byShortName.name)) {
    return byShortName.name;
  }

  return 'Другие университеты';
};

export const buildBarData = (participants: IParticipant[]): IBarItem[] => {
  const resultMap = new Map<string, IBarItem>();

  knownUniversities.forEach(({ id, name, shortName }) => {
    resultMap.set(name, {
      id,
      name,
      shortName,
      registered: [],
      nominationSelected: [],
      formSubmitted: [],
    });
  });

  participants.forEach((participant) => {
    const org = participant.educational_organization;
    const targetKey = resolveUniversityKey(org, resultMap);
    const target = resultMap.get(targetKey);
    if (!target) return;

    if (participant.isSubmitted) {
      target.formSubmitted.push(participant);
    } else if (participant.nomination !== null) {
      target.nominationSelected.push(participant);
    } else {
      target.registered.push(participant);
    }
  });

  return Array.from(resultMap.values());
};
