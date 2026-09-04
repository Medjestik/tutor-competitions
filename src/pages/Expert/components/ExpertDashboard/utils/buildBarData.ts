import type { IParticipant, IBarItem } from '../interface/interface';

export const knownUniversities: Omit<
	IBarItem,
	'registered' | 'nominationSelected' | 'formSubmitted'
>[] = [
	{
		id: 1,
		name: 'ВГУВТ',
		shortName: 'ВГУВТ',
	},
	{
		id: 2,
		name: 'ГУМРФ',
		shortName: 'ГУМРФ',
	},
	{
		id: 3,
		name: 'ДВГУПС',
		shortName: 'ДВГУПС',
	},
	{
		id: 4,
		name: 'ИрГУПС',
		shortName: 'ИрГУПС',
	},
	{
		id: 5,
		name: 'МГУ им. адм. Г.И. Невельского',
		shortName: 'МГУ',
	},
	{
		id: 6,
		name: 'ОмГУПС (ОмИИТ)',
		shortName: 'ОмГУПС',
	},
	{
		id: 7,
		name: 'ПривГУПС',
		shortName: 'ПРГУПС',
	},
	{
		id: 8,
		name: 'РГУПС',
		shortName: 'РГУПС',
	},
	{
		id: 9,
		name: 'РУТ (МИИТ)',
		shortName: 'РУТ',
	},
	{
		id: 10,
		name: 'СГУПС',
		shortName: 'СГУПС',
	},
	{
		id: 11,
		name: 'СибАДИ',
		shortName: 'СибАДИ',
	},
	{
		id: 12,
		name: 'УИГА',
		shortName: 'УИГА',
	},
	{
		id: 13,
		name: 'УрГУПС',
		shortName: 'УрГУПС',
	},
];

export const displayKeyLabels: Record<string, string> = {
	registered: 'Прошли регистрацию',
	nominationSelected: 'Выбрали номинацию',
	formSubmitted: 'Отправили анкету',
};

export const keys = Object.values(displayKeyLabels);

export const buildBarData = (
	participants: IParticipant[],
): IBarItem[] => {
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

		const target = resultMap.get(org);

		if (!target) {
			return;
		}

		// Все участники, пришедшие с бэка, прошли регистрацию
		target.registered.push(participant);

		// Есть выбранная номинация
		if (participant.nomination !== null) {
			target.nominationSelected.push(participant);
		}

		// Анкета отправлена
		if (participant.isSubmitted) {
			target.formSubmitted.push(participant);
		}
	});

	return Array.from(resultMap.values());
};
