import type { ILoginData } from '../../features/login/interface/interface';
import type { IRegisterData } from '../../pages/Registration/interface/interface';
import type { IUploadFile, IUploadLink } from '../components/Popup/interface/interface'; 

import { API_URL } from './config';

function handleResponse (res: Response) {
  if (res.ok) {
    return res.json();
  } else {
    return Promise.reject(res);
  }
}

function checkResponse (res: Response) {
  if (res.status === 201) {
    return res;
  } else {
    return Promise.reject(res);
  }
}

export const getTeam = (token: string) => {
  return fetch(`${API_URL}/current-team`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`,
    }
  })
  .then(res => handleResponse(res));
};

export const login = (data: ILoginData) => {
  return fetch(`${API_URL}/auth/login/`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: data.login,
      password: data.password,
    }),
  })
  .then(res => handleResponse(res));
};

export const registration = (data: IRegisterData) => {
  return fetch(`${API_URL}/register/`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: data.name,
      login: data.login,
      university: data.university,
      case: data.case,
      participants: data.participants,
    }),
  })
  .then(res => handleResponse(res));
};

export const subscribe = (email: string) => {
  return fetch(`${API_URL}/email/`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  })
  .then(res => handleResponse(res));
};

export const getCases = () => {
  return fetch(`${API_URL}/cases`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  })
  .then(res => handleResponse(res));
};

export const getUniversity = () => {
  return fetch(`${API_URL}/universities`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  })
  .then(res => handleResponse(res));
};

export const getCourses = () => {
  return fetch(`${API_URL}/levels`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  })
  .then(res => handleResponse(res));
};

export const getStages = (token: string) => {
  return fetch(`${API_URL}/stages`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`,
    }
  })
  .then(res => handleResponse(res));
};

export const getStage = (token: string, stageId: number) => {
  return fetch(`${API_URL}/stages/${stageId}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`,
    }
  })
  .then(res => handleResponse(res));
};

export const uploadFile = (token: string, data: IUploadFile, stageId: number) => {
  return fetch(`${API_URL}/upload-file/`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`,
    },
    body: JSON.stringify({
      file: data.file,
      name: data.name,
      filename: data.fileName,
      stage: stageId,
    }),
  })
  .then(res => handleResponse(res));
};

export const uploadLink = (token: string, data: IUploadLink, stageId: number) => {
  return fetch(`${API_URL}/upload-url/`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`,
    },
    body: JSON.stringify({
      url: data.link,
      name: data.name,
      stage: stageId,
    }),
  })
  .then(res => checkResponse(res));
};

export const uploadVideo = (token: string, data: IUploadLink, stageId: number) => {
  return fetch(`${API_URL}/upload-video/`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`,
    },
    body: JSON.stringify({
      url: data.link,
      name: data.name,
      stage: stageId,
    }),
  })
  .then(res => checkResponse(res));
};

export const nextStage = (token: string) => {
  return fetch(`${API_URL}/next_stage/`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`,
    },
  })
  .then(res => handleResponse(res));
};
