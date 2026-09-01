export const getApiUrl = (): string => {
  const { hostname } = window.location;

  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return process.env.REACT_APP_API_URL || 'http://localhost:8888/api';
  }

  return 'https://edtech-api.emiit.ru/api';
};

export const API_URL = getApiUrl();
