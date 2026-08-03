import { request } from './utils';

export interface ISettings {
	can_login?: boolean;
	[key: string]: boolean | string | undefined;
}

export const getSettings = (): Promise<ISettings> => {
	return request('/settings/', {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	});
};
