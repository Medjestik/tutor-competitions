import type { ILoginData } from '../../pages/Login/interface/interface';
import type { IRegisterData } from '../../pages/Registration/interface/interface';
import type { IUploadFile, IUploadLink } from '../components/Popup/interface/interface'; 
import type { IScoreItem } from '../../pages/Person/interface/interface';

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
  return fetch(`${API_URL}/accounts/me/`, {
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

export const getNominations = () => {
  return fetch(`${API_URL}/competition/nominations`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  })
  .then(res => handleResponse(res));
};

export const getNominationForms = (token: string, nominationId: string) => {
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

export const getDashboardData = (token: string) => {
  return fetch(`${API_URL}/competition/dashboard/participants`, {
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

export const editForm = (token: string) => {
  return fetch(`${API_URL}/competition/forms/my-form/draft/`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    }
  }).then(res => handleResponse(res));
};

export const scoreForm = (token: string, evaluations: IScoreItem[]) => {
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

export const scoreWebinar = (token: string, masterclass_id: number, rating: number, comment: string ) => {
  return fetch(`${API_URL}/competition/masterclass/rating/`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({  masterclass_id, rating, comment }),
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
      description: data.name,
      stage_id: 4,
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
      stage_id: 4,
    }),
  })
  .then(res => handleResponse(res));
};

export const removeMaterial = (token: string, id: string) => {
  return fetch(`${API_URL}/competition/forms/delete-resource/`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      resource_id: id,
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

export const getStage = (token: string) => {
  return fetch(`${API_URL}/competition/resources?stage_id=4`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
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

export const getSlots = (token: string) => {
  return fetch(`${API_URL}/competition/slots`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    }
  })
  .then(res => handleResponse(res));
};

export const getWebinars = (token: string) => {
  return fetch(`${API_URL}/competition/masterclass`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    }
  })
  .then(res => handleResponse(res));
};

export const getCompletedWebinars = (token: string) => {
  return fetch(`${API_URL}/competition/masterclass/completed`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    }
  })
  .then(res => handleResponse(res));
};

export const getPublicWebinars = () => {
  return fetch(`${API_URL}/competition/public/masterclasses`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  })
  .then(res => handleResponse(res));
};

export interface ISLot {
  date: string;
  time: string;
}

export const SelectSlots = (token: string, slots: ISLot[]) => {
  return fetch(`${API_URL}/competition/slots/`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(slots),
  })
  .then(res => handleResponse(res));
};

export const getLearningApplication = (token: string) => {
  return fetch(`${API_URL}/learning/applications/my/`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  }).then((res) => handleResponse(res));
};

export const updateLearningApplication = (token: string, data: Record<string, unknown>) => {
  return fetch(`${API_URL}/learning/applications/my/`, {
    method: 'PATCH',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  }).then((res) => handleResponse(res));
};

export const confirmLearningSection = (
  token: string,
  section: string,
  password: string
) => {
  return fetch(`${API_URL}/learning/applications/my/confirm-section/`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      section,
      password,
      agreed: true,
    }),
  }).then((res) => handleResponse(res));
};

export const uploadLearningDocument = (
  token: string,
  documentType: string,
  fileData: string,
  filename: string
) => {
  return fetch(`${API_URL}/learning/applications/my/documents/`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      document_type: documentType,
      file_data: fileData,
      filename,
    }),
  }).then((res) => handleResponse(res));
};

export const submitLearningApplication = (token: string, password: string) => {
  return fetch(`${API_URL}/learning/applications/my/submit/`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ password }),
  }).then((res) => handleResponse(res));
};

export interface ILearningApplicationListItem {
  id: number;
  status: string;
  statusDisplay: string;
  lastName: string;
  firstName: string;
  middleName: string | null;
  email: string;
  phone: string | null;
  updatedAt: string;
}

export interface ILearningApplicationsListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ILearningApplicationListItem[];
}

export const getLearningApplicationsList = (
  token: string,
  params: { page?: number; search?: string } = {}
) => {
  const searchParams = new URLSearchParams();
  if (params.page) {
    searchParams.set('page', String(params.page));
  }
  if (params.search) {
    searchParams.set('search', params.search);
  }

  const query = searchParams.toString();
  const url = `${API_URL}/learning/applications/${query ? `?${query}` : ''}`;

  return fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => handleResponse(res)) as Promise<ILearningApplicationsListResponse>;
};

export const getLearningApplicationDetail = (token: string, applicationId: number) => {
  return fetch(`${API_URL}/learning/applications/${applicationId}/`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => handleResponse(res));
};

export const approveLearningApplication = (token: string, applicationId: number) => {
  return fetch(`${API_URL}/learning/applications/${applicationId}/approve/`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }).then((res) => handleResponse(res));
};

export const requestLearningApplicationCorrection = (
  token: string,
  applicationId: number,
  data: { comment: string; sectionsToRevise: string[] }
) => {
  return fetch(
    `${API_URL}/learning/applications/${applicationId}/request-correction/`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }
  ).then((res) => handleResponse(res));
};

export const rejectLearningApplication = (
  token: string,
  applicationId: number,
  data: { comment: string }
) => {
  return fetch(`${API_URL}/learning/applications/${applicationId}/reject/`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then((res) => handleResponse(res));
};

function handleLmsResponse(res: Response) {
  if (res.ok) {
    if (res.status === 204) {
      return null;
    }
    return res.json();
  }
  return Promise.reject(res);
}

const lmsAuthHeaders = (token: string) => ({
  Accept: 'application/json',
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
});

export interface ILmsPartType {
  id: number;
  code: string;
  name: string;
}

export interface ILmsCourse {
  id: number;
  name: string;
  description: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface ILmsCoursePart {
  id: number;
  course: number;
  name: string;
  part_type: ILmsPartType;
  level: number;
  position: number;
  parent: number | null;
  parent_id: number | null;
  is_mandatory: boolean;
  text: string;
  file_url: string | null;
  test_id: number | null;
  task_id: number | null;
  created_at: string;
  updated_at: string;
}

export interface ILmsCourseDetail extends ILmsCourse {
  parts: ILmsCoursePart[];
}

export interface ILmsAnswer {
  id?: number | null;
  text: string;
  is_correct: boolean;
  match_text: string;
  position: number;
}

export interface ILmsQuestion {
  id?: number | null;
  text: string;
  question_type: 'single' | 'multiple' | 'text' | 'matching' | 'ordering';
  position: number;
  answers: ILmsAnswer[];
}

export interface ILmsTest {
  id: number;
  name: string;
  description: string;
  pass_score: number | null;
  questions_count?: number;
  created_at: string;
  updated_at: string;
}

export interface ILmsTestDetail extends Omit<ILmsTest, 'questions_count'> {
  questions: ILmsQuestion[];
}

export interface ILmsTask {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export const getLmsPartTypes = (token: string) =>
  fetch(`${API_URL}/lms/part-types/`, {
    method: 'GET',
    headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
  }).then((res) => handleLmsResponse(res)) as Promise<ILmsPartType[]>;

export const getLmsCourses = (token: string, search = '') => {
  const query = search ? `?search=${encodeURIComponent(search)}` : '';
  return fetch(`${API_URL}/lms/courses/${query}`, {
    method: 'GET',
    headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
  }).then((res) => handleLmsResponse(res)) as Promise<ILmsCourse[]>;
};

export const createLmsCourse = (
  token: string,
  data: { name: string; description?: string; is_published?: boolean }
) =>
  fetch(`${API_URL}/lms/courses/`, {
    method: 'POST',
    headers: lmsAuthHeaders(token),
    body: JSON.stringify(data),
  }).then((res) => handleLmsResponse(res)) as Promise<ILmsCourseDetail>;

export const getLmsCourse = (token: string, courseId: number) =>
  fetch(`${API_URL}/lms/courses/${courseId}/`, {
    method: 'GET',
    headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
  }).then((res) => handleLmsResponse(res)) as Promise<ILmsCourseDetail>;

export const updateLmsCourse = (
  token: string,
  courseId: number,
  data: Partial<{ name: string; description: string; is_published: boolean }>
) =>
  fetch(`${API_URL}/lms/courses/${courseId}/`, {
    method: 'PATCH',
    headers: lmsAuthHeaders(token),
    body: JSON.stringify(data),
  }).then((res) => handleLmsResponse(res)) as Promise<ILmsCourseDetail>;

export const deleteLmsCourse = (token: string, courseId: number) =>
  fetch(`${API_URL}/lms/courses/${courseId}/`, {
    method: 'DELETE',
    headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
  }).then((res) => handleLmsResponse(res));

export const createLmsCoursePart = (
  token: string,
  courseId: number,
  data: Record<string, unknown>
) =>
  fetch(`${API_URL}/lms/courses/${courseId}/parts/`, {
    method: 'POST',
    headers: lmsAuthHeaders(token),
    body: JSON.stringify(data),
  }).then((res) => handleLmsResponse(res)) as Promise<ILmsCoursePart>;

export const updateLmsCoursePart = (
  token: string,
  partId: number,
  data: Record<string, unknown>
) =>
  fetch(`${API_URL}/lms/parts/${partId}/`, {
    method: 'PATCH',
    headers: lmsAuthHeaders(token),
    body: JSON.stringify(data),
  }).then((res) => handleLmsResponse(res)) as Promise<ILmsCoursePart>;

export const deleteLmsCoursePart = (token: string, partId: number) =>
  fetch(`${API_URL}/lms/parts/${partId}/`, {
    method: 'DELETE',
    headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
  }).then((res) => handleLmsResponse(res));

export const uploadLmsCoursePartFile = (
  token: string,
  partId: number,
  file: File
) => {
  const formData = new FormData();
  formData.append('file', file);
  return fetch(`${API_URL}/lms/parts/${partId}/upload/`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  }).then((res) => handleLmsResponse(res)) as Promise<ILmsCoursePart>;
};

export const getLmsTests = (token: string, search = '') => {
  const query = search ? `?search=${encodeURIComponent(search)}` : '';
  return fetch(`${API_URL}/lms/tests/${query}`, {
    method: 'GET',
    headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
  }).then((res) => handleLmsResponse(res)) as Promise<ILmsTest[]>;
};

export const createLmsTest = (
  token: string,
  data: Partial<ILmsTestDetail> & { name: string }
) =>
  fetch(`${API_URL}/lms/tests/`, {
    method: 'POST',
    headers: lmsAuthHeaders(token),
    body: JSON.stringify(data),
  }).then((res) => handleLmsResponse(res)) as Promise<ILmsTestDetail>;

export const getLmsTest = (token: string, testId: number) =>
  fetch(`${API_URL}/lms/tests/${testId}/`, {
    method: 'GET',
    headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
  }).then((res) => handleLmsResponse(res)) as Promise<ILmsTestDetail>;

export const updateLmsTest = (
  token: string,
  testId: number,
  data: Partial<ILmsTestDetail>
) =>
  fetch(`${API_URL}/lms/tests/${testId}/`, {
    method: 'PATCH',
    headers: lmsAuthHeaders(token),
    body: JSON.stringify(data),
  }).then((res) => handleLmsResponse(res)) as Promise<ILmsTestDetail>;

export const deleteLmsTest = (token: string, testId: number) =>
  fetch(`${API_URL}/lms/tests/${testId}/`, {
    method: 'DELETE',
    headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
  }).then((res) => handleLmsResponse(res));

export const getLmsTasks = (token: string, search = '') => {
  const query = search ? `?search=${encodeURIComponent(search)}` : '';
  return fetch(`${API_URL}/lms/tasks/${query}`, {
    method: 'GET',
    headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
  }).then((res) => handleLmsResponse(res)) as Promise<ILmsTask[]>;
};

export const createLmsTask = (
  token: string,
  data: { name: string; description: string }
) =>
  fetch(`${API_URL}/lms/tasks/`, {
    method: 'POST',
    headers: lmsAuthHeaders(token),
    body: JSON.stringify(data),
  }).then((res) => handleLmsResponse(res)) as Promise<ILmsTask>;

export const getLmsTask = (token: string, taskId: number) =>
  fetch(`${API_URL}/lms/tasks/${taskId}/`, {
    method: 'GET',
    headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
  }).then((res) => handleLmsResponse(res)) as Promise<ILmsTask>;

export const updateLmsTask = (
  token: string,
  taskId: number,
  data: Partial<{ name: string; description: string }>
) =>
  fetch(`${API_URL}/lms/tasks/${taskId}/`, {
    method: 'PATCH',
    headers: lmsAuthHeaders(token),
    body: JSON.stringify(data),
  }).then((res) => handleLmsResponse(res)) as Promise<ILmsTask>;

export const deleteLmsTask = (token: string, taskId: number) =>
  fetch(`${API_URL}/lms/tasks/${taskId}/`, {
    method: 'DELETE',
    headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
  }).then((res) => handleLmsResponse(res));

export interface ILmsMaterialsPart {
  id: number;
  name: string;
  part_type: ILmsPartType;
  level: number;
  position: number;
  parent_id: number | null;
  is_mandatory: boolean;
}

export interface ILmsMaterialsCourse {
  id: number;
  name: string;
  description: string;
  parts: ILmsMaterialsPart[];
}

export type TLmsMaterialsAccess =
  | 'granted'
  | 'blocked'
  | 'no_application'
  | 'no_course';

export interface ILmsMaterialsResponse {
  access: TLmsMaterialsAccess;
  message?: string;
  status?: string;
  statusDisplay?: string;
  applicationStatus?: string;
  organizerComment?: string;
  course?: ILmsMaterialsCourse;
}

export const getMyLmsMaterials = (token: string) =>
  fetch(`${API_URL}/lms/my/materials/`, {
    method: 'GET',
    headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
  }).then((res) => handleLmsResponse(res)) as Promise<ILmsMaterialsResponse>;

