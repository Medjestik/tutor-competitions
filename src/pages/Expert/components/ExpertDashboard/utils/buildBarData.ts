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
	registered: 'Только регистрация',
	nominationSelected: 'В процессе',
	formSubmitted: 'Отправили анкету',
};

export const keys = Object.values(displayKeyLabels);

const shortNameFromOrg = (org: string): string => {
	if (org.length <= 16) return org;
	return `${org.slice(0, 14)}…`;
};

const emptyBuckets = (): Pick<
	IBarItem,
	'registered' | 'nominationSelected' | 'formSubmitted'
> => ({
	registered: [],
	nominationSelected: [],
	formSubmitted: [],
});

export const universityTotal = (item: IBarItem): number =>
	item.registered.length +
	item.nominationSelected.length +
	item.formSubmitted.length;

export const buildBarData = (
	participants: IParticipant[],
): IBarItem[] => {
	const resultMap = new Map<string, IBarItem>();

	knownUniversities.forEach(({ id, name, shortName }) => {
		resultMap.set(name, {
			id,
			name,
			shortName,
			...emptyBuckets(),
		});
	});

	let nextId = knownUniversities.length + 1;

	participants.forEach((participant) => {
		const org = (participant.educational_organization || '').trim();
		if (!org) return;

		let target = resultMap.get(org);

		if (!target) {
			target = {
				id: nextId,
				name: org,
				shortName: shortNameFromOrg(org),
				...emptyBuckets(),
			};
			resultMap.set(org, target);
			nextId += 1;
		}

		// Взаимоисключающие этапы: каждый участник ровно в одном сегменте
		if (participant.isSubmitted) {
			target.formSubmitted.push(participant);
		} else if (participant.hasFormProgress) {
			target.nominationSelected.push(participant);
		} else {
			target.registered.push(participant);
		}
	});

	return Array.from(resultMap.values()).sort(
		(a, b) => universityTotal(a) - universityTotal(b) || a.name.localeCompare(b.name, 'ru'),
	);
};
