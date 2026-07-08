import { API_URL } from '../config';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const normalizeErrorToString = (data: any): string => {
	if (!data) return 'Произошла ошибка';

	if (typeof data === 'string') return data;

	if (data.errors && typeof data.errors === 'object') {
		const text = Object.entries(data.errors)
			.map(([field, msg]) => `${field}: ${msg}`)
			.join('\n');

		if (text) return text;
	}

	return (
		data.message || data.error || JSON.stringify(data) || 'Произошла ошибка'
	);
};

const checkResponse = async (res: Response) => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let data: any;

	try {
		data = await res.json();
	} catch {
		data = await res.text();
	}

	if (res.ok) return data;

	const message = normalizeErrorToString(data);

	throw new Error(message);
};

export const request = (endpoint: string, options: RequestInit) => {
	return fetch(`${API_URL}${endpoint}`, options).then(checkResponse);
};
