import { API_URL } from '../config';

const jsonHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

export interface IViewAsUserSearchItem {
  id: number;
  full_name: string;
  email: string;
  role: string;
}

export interface IViewAsUserSearchResponse {
  results: IViewAsUserSearchItem[];
}

export const searchViewAsUsers = async (
  token: string,
  search: string
): Promise<IViewAsUserSearchResponse> => {
  const params = new URLSearchParams();
  if (search.trim()) {
    params.set('search', search.trim());
  }
  const query = params.toString();
  const res = await fetch(
    `${API_URL}/accounts/view-as/users/${query ? `?${query}` : ''}`,
    {
      method: 'GET',
      headers: {
        ...jsonHeaders,
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!res.ok) {
    throw new Error('Не удалось найти пользователей');
  }
  return res.json();
};

export const startViewAsUser = async (
  token: string,
  userId: number
): Promise<{ access: string }> => {
  const res = await fetch(`${API_URL}/accounts/view-as/`, {
    method: 'POST',
    headers: {
      ...jsonHeaders,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ user_id: userId }),
  });
  if (!res.ok) {
    let message = 'Не удалось открыть кабинет пользователя';
    try {
      const data = await res.json();
      if (data?.error) {
        message = data.error;
      }
    } catch {
      // keep default
    }
    throw new Error(message);
  }
  return res.json();
};
