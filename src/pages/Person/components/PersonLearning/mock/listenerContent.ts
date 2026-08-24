import type {
  ILearningApplicationResponse,
  IListenerConfirmedSections,
  IListenerFormState,
  TListenerTab,
} from '../interface/interface';
import type { ISelectOption } from '../../../../../shared/components/Select/interface/interface';
import type { ICurrentUser } from '../../../../../shared/components/App/interface';

export const listenerContent = {
  title: 'Данные слушателя',
  lead:
    'Заполните личный листок слушателя для оформления документов и зачисления на программу обучения. Вы можете вносить изменения и дополнять информацию.',
  autoFillInfoText:
    'Для заполнения данного поля автоматически использованы сведения, указанные вами при регистрации в качестве участника конкурса. При необходимости вы можете внести изменения, однако обращаем внимание, что обновлённые данные будут автоматически изменены и в анкете участника. В дальнейшем именно эта информация будет использоваться в рамках проведения конкурса.',
  marriageCertInfoText:
    'Документ требуется, если фамилия в дипломе отличается от текущей фамилии.',
  apostilleInfoText:
    'Апостиль требуется для документов об образовании, выданных за пределами Российской Федерации.',
  passwordCaption:
    'Введите пароль от личного кабинета, чтобы подписать введённую информацию.',
};

export const listenerTabs = [
  { id: 'info' as const, label: 'Информация о слушателе' },
  { id: 'consent' as const, label: 'Обработка ПД' },
  { id: 'snils' as const, label: 'СНИЛС' },
  { id: 'diploma' as const, label: 'Диплом' },
  { id: 'review' as const, label: 'Проверка' },
];

export const listenerConfirmableTabs: Array<keyof IListenerConfirmedSections> = [
  'info',
  'consent',
  'snils',
  'diploma',
];

export const listenerTabOrder: TListenerTab[] = listenerTabs.map((tab) => tab.id);

export const getFirstUnconfirmedListenerTab = (
  confirmedSections: IListenerConfirmedSections,
  isApplicationSubmitted = false
): TListenerTab => {
  const firstUnconfirmed = listenerConfirmableTabs.find(
    (tab) => !confirmedSections[tab]
  );
  if (firstUnconfirmed) {
    return firstUnconfirmed;
  }
  if (!isApplicationSubmitted) {
    return 'review';
  }
  return 'review';
};

export const confirmModalContent: Record<
  TListenerTab,
  { title: string; question: string }
> = {
  info: {
    title: 'Подтверждение данных',
    question: 'Подтвердить информацию о слушателе?',
  },
  consent: {
    title: 'Согласие на обработку ПД',
    question: 'Дать согласие на обработку персональных данных?',
  },
  snils: {
    title: 'Подтверждение СНИЛС',
    question: 'Подтвердить данные СНИЛС?',
  },
  diploma: {
    title: 'Подтверждение документов',
    question: 'Подтвердить документы об образовании?',
  },
  review: {
    title: 'Отправка на проверку',
    question: 'Отправить документы на проверку?',
  },
};

export const sectionConfirmedMessages: Record<TListenerTab, string> = {
  info: 'Информация о слушателе успешно подтверждена. Редактирование недоступно.',
  consent: 'Согласие на обработку персональных данных успешно подтверждено. Редактирование недоступно.',
  snils: 'Данные СНИЛС успешно подтверждены. Редактирование недоступно.',
  diploma: 'Документы об образовании успешно подтверждены. Редактирование недоступно.',
  review: 'Документы отправлены на проверку.',
};

export const educationLevelOptions: ISelectOption[] = [
  { id: 0, name: 'Выберите уровень образования' },
  { id: 1, name: 'Среднее профессиональное' },
  { id: 2, name: 'Высшее — бакалавриат' },
  { id: 3, name: 'Высшее — специалитет' },
  { id: 4, name: 'Высшее — магистратура' },
  { id: 5, name: 'Высшее — аспирантура' },
];

const emptyDate = { day: '', month: '', year: '' };

export const emptyConfirmedSections: IListenerConfirmedSections = {
  info: false,
  consent: false,
  snils: false,
  diploma: false,
};

export const createListenerFormFromUser = (user: ICurrentUser): IListenerFormState => ({
  lastName: user.last_name || '',
  firstName: user.first_name || '',
  middleName: user.middle_name || '',
  birthDate: emptyDate,
  gender: '',
  educationLevelId: 0,
  graduationYear: '',
  institutionName: '',
  actualAddress: '',
  studyAddress: '',
  addressSameAsActual: false,
  workplace: user.educational_organization || '',
  position: user.main_position || '',
  email: user.email || '',
  phone: user.phone_number || '',
  password: '',
  registrationAddress: '',
  passportSeries: '',
  passportNumber: '',
  passportIssueDate: emptyDate,
  passportIssuedBy: '',
  personalDataConsent: false,
  snils: '',
  snilsFileName: '',
  diplomaFileName: '',
  marriageCertFileName: '',
  apostilleFileName: '',
  degreeDiplomaFileName: '',
});

export const mapApplicationToFormState = (
  data: ILearningApplicationResponse
): IListenerFormState => ({
  lastName: data.lastName || '',
  firstName: data.firstName || '',
  middleName: data.middleName || '',
  birthDate: data.birthDate || emptyDate,
  gender: data.gender || '',
  educationLevelId: data.educationLevelId || 0,
  graduationYear: data.graduationYear || '',
  institutionName: data.institutionName || '',
  actualAddress: data.actualAddress || '',
  studyAddress: data.studyAddress || '',
  addressSameAsActual: Boolean(data.addressSameAsActual),
  workplace: data.workplace || '',
  position: data.position || '',
  email: data.email || '',
  phone: data.phone || '',
  password: '',
  registrationAddress: data.registrationAddress || '',
  passportSeries: data.passportSeries || '',
  passportNumber: data.passportNumber || '',
  passportIssueDate: data.passportIssueDate || emptyDate,
  passportIssuedBy: data.passportIssuedBy || '',
  personalDataConsent: Boolean(data.personalDataConsent),
  snils: data.snils || '',
  snilsFileName: data.snilsFileName || '',
  diplomaFileName: data.diplomaFileName || '',
  marriageCertFileName: data.marriageCertFileName || '',
  apostilleFileName: data.apostilleFileName || '',
  degreeDiplomaFileName: data.degreeDiplomaFileName || '',
});

export const mapApplicationToConfirmedSections = (
  data: ILearningApplicationResponse
): IListenerConfirmedSections => ({
  info: Boolean(data.infoConfirmed),
  consent: Boolean(data.consentConfirmed),
  snils: Boolean(data.snilsConfirmed),
  diploma: Boolean(data.diplomaConfirmed),
});

export const buildLearningApplicationPayload = (formData: IListenerFormState) => ({
  lastName: formData.lastName,
  firstName: formData.firstName,
  middleName: formData.middleName,
  birthDate: formData.birthDate,
  gender: formData.gender,
  educationLevelId: formData.educationLevelId,
  graduationYear: formData.graduationYear,
  institutionName: formData.institutionName,
  actualAddress: formData.actualAddress,
  studyAddress: formData.studyAddress,
  addressSameAsActual: formData.addressSameAsActual,
  workplace: formData.workplace,
  position: formData.position,
  email: formData.email,
  phone: formData.phone,
  registrationAddress: formData.registrationAddress,
  passportSeries: formData.passportSeries,
  passportNumber: formData.passportNumber,
  passportIssueDate: formData.passportIssueDate,
  passportIssuedBy: formData.passportIssuedBy,
  personalDataConsent: formData.personalDataConsent,
  snils: formData.snils,
});

type TLearningApplicationPayload = ReturnType<typeof buildLearningApplicationPayload>;

const listenerSectionPayloadFields: Record<TListenerTab, Array<keyof TLearningApplicationPayload>> = {
  info: [
    'lastName',
    'firstName',
    'middleName',
    'birthDate',
    'gender',
    'educationLevelId',
    'graduationYear',
    'institutionName',
    'actualAddress',
    'studyAddress',
    'addressSameAsActual',
    'workplace',
    'position',
    'email',
    'phone',
  ],
  consent: [
    'lastName',
    'firstName',
    'middleName',
    'registrationAddress',
    'passportSeries',
    'passportNumber',
    'passportIssueDate',
    'passportIssuedBy',
    'personalDataConsent',
    'email',
    'phone',
  ],
  snils: ['snils'],
  diploma: [],
  review: [],
};

export const buildLearningApplicationPayloadForSection = (
  section: TListenerTab,
  formData: IListenerFormState
): Partial<TLearningApplicationPayload> => {
  const fullPayload = buildLearningApplicationPayload(formData);

  return Object.fromEntries(
    listenerSectionPayloadFields[section].map((field) => [field, fullPayload[field]])
  ) as Partial<TLearningApplicationPayload>;
};

export const areAllListenerSectionsConfirmed = (
  confirmedSections: IListenerConfirmedSections
): boolean =>
  confirmedSections.info &&
  confirmedSections.consent &&
  confirmedSections.snils &&
  confirmedSections.diploma;

export const initialListenerForm: IListenerFormState = createListenerFormFromUser({
  id: 0,
  username: '',
  first_name: '',
  last_name: '',
  middle_name: '',
  current_stage_id: 0,
  educational_organization: '',
  email: '',
  main_position: '',
  phone_number: '',
  role: '',
  telegram_username: '',
  timezone: '',
  passed_second_stage: false,
  is_staff: false,
  is_lms_tutor: false,
  nomination: null,
});
