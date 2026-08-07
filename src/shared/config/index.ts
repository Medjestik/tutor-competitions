
export const getApiUrl = (): string => {
  const { hostname } = window.location;
  
  if (hostname === 'localhost') {
    return 'https://edtech-api.emiit.ru/api'; // http://10.242.221.0:8000/api
  } else {
    return 'https://edtech-api.emiit.ru/api';
  }
};
  
export const API_URL = getApiUrl();
  
