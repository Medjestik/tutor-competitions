const isLocalHost =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

export const API_URL =
  process.env.REACT_APP_API_URL ||
  (isLocalHost ? 'http://localhost:8888/api' : 'https://edtech.rut-miit.ru/api');
