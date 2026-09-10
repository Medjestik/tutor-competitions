import type { IParticipant, IBarItem } from '../interface/interface';

export const knownUniversities: Omit<
	IBarItem,
	'registered' | 'nominationSelected' | 'formSubmitted'
>[] = [
	{ id: 1, name: 'ВГУВТ', shortName: 'ВГУВТ' },
	{ id: 2, name: 'ГМУ им. адм. Ф.Ф. Ушакова', shortName: 'ГМУ' },
	{ id: 3, name: 'ГУМРФ им. адм. С.О. Макарова', shortName: 'ГУМРФ' },
	{ id: 4, name: 'ДВГУПС', shortName: 'ДВГУПС' },
	{ id: 5, name: 'ДонИЖТ', shortName: 'ДонИЖТ' },
	{ id: 6, name: 'ИрГУПС', shortName: 'ИрГУПС' },
	{ id: 7, name: 'МАДИ', shortName: 'МАДИ' },
	{ id: 8, name: 'МГТУ ГА', shortName: 'МГТУ ГА' },
	{ id: 9, name: 'МГУ им. адм. Г.И. Невельского', shortName: 'МГУ' },
	{ id: 10, name: 'ОмГУПС (ОмИИТ)', shortName: 'ОмГУПС' },
	{ id: 11, name: 'ПГУПС', shortName: 'ПГУПС' },
	{ id: 12, name: 'ПривГУПС', shortName: 'ПРГУПС' },
	{ id: 13, name: 'РГУПС', shortName: 'РГУПС' },
	{ id: 14, name: 'РУТ (МИИТ)', shortName: 'РУТ' },
	{ id: 15, name: 'СГУВТ', shortName: 'СГУВТ' },
	{ id: 16, name: 'СГУПС', shortName: 'СГУПС' },
	{ id: 17, name: 'СибАДИ', shortName: 'СибАДИ' },
	{ id: 18, name: 'СПбГУ ГА им. А.А. Новикова', shortName: 'СПбГУ ГА' },
	{ id: 19, name: 'УИ ГА', shortName: 'УИ ГА' },
	{ id: 20, name: 'УрГУПС', shortName: 'УрГУПС' },
	{ id: 21, name: 'ХГМА', shortName: 'ХГМА' },
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
