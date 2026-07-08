export const formatTextDate = (date: string | Date): string => {
	const d = new Date(date);
	return d.toLocaleDateString('ru-RU', {
		weekday: 'short',
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	});
};

export const formatShortDate = (date: string | Date): string => {
	const d = new Date(date);
	const day = String(d.getDate()).padStart(2, '0');
	const month = String(d.getMonth() + 1).padStart(2, '0');
	return `${day}.${month}`;
};
