import type { ILoginData } from '../../pages/Login/interface/interface';
import type { IAuthResponse } from '../../store/user/types';

import { request } from './utils';

const setTokens = (accessToken: string) => {
	localStorage.setItem('token', accessToken);
};

export const login = (data: ILoginData) => {
	return request('/accounts/login/', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			username: data.username,
			password: data.password,
		}),
	}).then((res: IAuthResponse) => {
		if (res.access) {
			setTokens(res.access);
		}
		return res;
	}).catch((err) => {
		let parsed;

		try {
			parsed = JSON.parse(err.message);
		} catch {
			parsed = null;
		}

		if (parsed?.detail === 'Недопустимый токен.') {
			localStorage.removeItem('token');
		}

		throw err;
	});
};

export const getMe = (token: string) => {
	return request('/accounts/me/', {
	  method: 'GET',
	  headers: {
		'Accept': 'application/json',
		'Content-Type': 'application/json',
		'Authorization': `Bearer ${token}`,
	  }
	});
};

export const getSettings = () => {
	return request('/settings/', {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	});
};
