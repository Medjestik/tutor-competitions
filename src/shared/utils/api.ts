import type { ILoginData } from '../../pages/Login/interface/interface';
import type { IRegisterData } from '../../pages/Registration/interface/interface';
import type { IUploadFile, IUploadLink, IEvaluation } from '../components/Popup/interface/interface'; 

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

export const getMe = (token: string) => {
  return fetch(`${API_URL}/accounts/me`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    }
  })
  .then(res => handleResponse(res));
};

export const login = (data: ILoginData) => {
  return fetch(`${API_URL}/accounts/login/`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: data.username,
      password: data.password,
    }),
  })
  .then(res => handleResponse(res));
};

export const registration = (data: IRegisterData) => {
  return fetch(`${API_URL}/accounts/register/`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  .then(res => handleResponse(res));
};

export const getNominations = (token: string) => {
  return fetch(`${API_URL}/competition/nominations`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    }
  })
  .then(res => handleResponse(res));
};

export const getNominationForms = (token: string, nominationId: number) => {
  return fetch(`${API_URL}/competition/evaluations/nomination/${nominationId}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    }
  })
  .then(res => handleResponse(res));
};

export const getFormData = (token: string) => {
  return fetch(`${API_URL}/competition/forms/my-form`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    }
  })
  .then(res => handleResponse(res));
};

export const getExpertForm = (token: string, formId: string) => {
  return fetch(`${API_URL}/competition/evaluations/forms/${formId}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    }
  })
  .then(res => handleResponse(res));
};

export const setNomination = (token: string, nominationId: number) => {
  return fetch(`${API_URL}/competition/forms/select-nomination/`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      nomination_id: nominationId,    
    }),
  })
  .then(res => handleResponse(res));
};

const saveFormField = (token: string, field: string, value: string) => {
  return fetch(`${API_URL}/competition/forms/update/`, {
    method: 'PATCH',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      [field]: value,
    }),
  }).then(res => handleResponse(res));
};

export const saveFormName = (token: string, name: string) =>
  saveFormField(token, 'name', name);

export const saveFormTask = (token: string, task: string) =>
  saveFormField(token, 'task', task);

export const saveFormDescription = (token: string, description: string) =>
  saveFormField(token, 'description', description);

export const saveFormOriginality = (token: string, originality: string) =>
  saveFormField(token, 'originality', originality);

export const saveFormText = (token: string, text: string) =>
  saveFormField(token, 'text', text);

export const saveFormUsability = (token: string, usability: string) =>
  saveFormField(token, 'usability', usability);

export const submitForm = (token: string, name: string, task: string, description: string, originality: string, text: string, usability: string) => {
  return fetch(`${API_URL}/competition/forms/update/`, {
    method: 'PATCH',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ name, task , description, originality, text, usability, status: 'submitted' }),
  }).then(res => handleResponse(res));
};

export const scoreForm = (token: string, evaluations: IEvaluation[]) => {
  return fetch(`${API_URL}/competition/evaluations/`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ evaluations }),
  }).then(res => handleResponse(res));
};

export const uploadLink = (token: string, data: IUploadLink) => {
  return fetch(`${API_URL}/competition/forms/add-resource/`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      type: 'link',
      link: data.link,
      description: data.name
    }),
  })
  .then(res => handleResponse(res));
};

export const uploadFile = (token: string, data: IUploadFile) => {
  return fetch(`${API_URL}/competition/forms/add-resource/`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      type: 'file',
      file_data: data.file,
      description: data.name,
      filename: data.fileName,
    }),
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

export const getStages = (token: string) => {
  return fetch(`${API_URL}/competition/stages`, {
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
