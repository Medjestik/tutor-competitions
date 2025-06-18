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

  const otherKey = 'Другие университеты';

  participants.forEach((participant) => {
    const org = participant.educational_organization;
    const targetKey = resultMap.has(org) ? org : otherKey;
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
