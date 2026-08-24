import type { ReactNode } from 'react';

export type TLearningTab = 'about' | 'faq';

export interface IPersonLearningTabsProps {
  activeTab: TLearningTab;
  onChange: (tab: TLearningTab) => void;
}

export interface IPersonLearningAboutProps {
  onContinue: () => void;
}

export interface IPersonLearningFaqProps {
  onBack: () => void;
  onUpload: () => void;
}

export interface IPersonLearningDownloadProps {
  title: string;
  description: string;
  href: string;
}

export interface ILearningFaqItem {
  id: number;
  title: string;
  content: string;
}

export interface IPersonLearningAccordionProps {
  items: ILearningFaqItem[];
}

export interface IPersonLearningAccordionItemProps {
  item: ILearningFaqItem;
}

export interface IProgramContent {
  title: string;
  lead: string;
  videoUrl: string;
  pdfUrl: string;
  aboutTitle: string;
  aboutText: string;
  downloadTitle: string;
  downloadDescription: string;
}

export type TListenerTab = 'info' | 'consent' | 'snils' | 'diploma' | 'review';

export type TListenerFooterVariant = 'info' | 'middle' | 'submit' | 'review';

export type TListenerGender = 'female' | 'male' | '';

export interface IListenerDateParts {
  day: string;
  month: string;
  year: string;
}

export interface IListenerFormState {
  lastName: string;
  firstName: string;
  middleName: string;
  birthDate: IListenerDateParts;
  gender: TListenerGender;
  educationLevelId: number;
  graduationYear: string;
  institutionName: string;
  actualAddress: string;
  studyAddress: string;
  addressSameAsActual: boolean;
  workplace: string;
  position: string;
  email: string;
  phone: string;
  password: string;
  registrationAddress: string;
  passportSeries: string;
  passportNumber: string;
  passportIssueDate: IListenerDateParts;
  passportIssuedBy: string;
  personalDataConsent: boolean;
  snils: string;
  snilsFileName: string;
  diplomaFileName: string;
  marriageCertFileName: string;
  apostilleFileName: string;
  degreeDiplomaFileName: string;
}

export interface IListenerConfirmedSections {
  info: boolean;
  consent: boolean;
  snils: boolean;
  diploma: boolean;
}

export interface ILearningApplicationResponse {
  id: number;
  status: string;
  statusDisplay?: string;
  lastName: string;
  firstName: string;
  middleName: string | null;
  birthDate: IListenerDateParts;
  gender: TListenerGender;
  educationLevelId: number;
  graduationYear: string;
  institutionName: string;
  actualAddress: string;
  studyAddress: string;
  addressSameAsActual: boolean;
  workplace: string;
  position: string;
  email: string;
  phone: string | null;
  registrationAddress: string;
  passportSeries: string;
  passportNumber: string;
  passportIssueDate: IListenerDateParts;
  passportIssuedBy: string;
  personalDataConsent: boolean;
  snils: string;
  snilsFileName: string;
  diplomaFileName: string;
  marriageCertFileName: string;
  apostilleFileName: string;
  degreeDiplomaFileName: string;
  infoConfirmed: boolean;
  consentConfirmed: boolean;
  snilsConfirmed: boolean;
  diplomaConfirmed: boolean;
  organizerComment?: string;
  created_at: string;
  updated_at: string;
}

export type TLearningDocumentType =
  | 'snils'
  | 'diploma'
  | 'marriage_cert'
  | 'apostille'
  | 'degree_diploma';

export interface IPersonLearningListenerTabsProps {
  activeTab: TListenerTab;
  onChange: (tab: TListenerTab) => void;
  confirmedSections: IListenerConfirmedSections;
  tabs?: Array<{ id: TListenerTab; label: string }>;
}

export interface IPersonLearningListenerFooterProps {
  variant: TListenerFooterVariant;
  onBack?: () => void;
  onSave?: () => void;
  onContinue?: () => void;
  onSubmit?: () => void;
  isSaving?: boolean;
  isSectionConfirmed?: boolean;
  isSubmitDisabled?: boolean;
}

export interface IListenerFieldError {
  text: string;
  isShow: boolean;
}

export type TListenerFieldErrors = Partial<
  Record<keyof IListenerFormState, string>
>;

export interface IPersonLearningListenerFieldProps {
  title: string;
  withInfo?: boolean;
  infoText?: string;
  caption?: string;
  titleColor?: 'default' | 'primary';
  fieldError?: IListenerFieldError;
  fieldKey?: keyof IListenerFormState;
  children: ReactNode;
  className?: string;
}

export interface IPersonLearningListenerGenderToggleProps {
  value: TListenerGender;
  onChange: (value: TListenerGender) => void;
  hasError?: boolean;
  disabled?: boolean;
}

export interface IPersonLearningListenerDateInputsProps {
  value: IListenerDateParts;
  onChange: (value: IListenerDateParts) => void;
  hasError?: boolean;
  disabled?: boolean;
}

export interface IPersonLearningListenerCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  hasError?: boolean;
  errorText?: string;
  fieldKey?: keyof IListenerFormState;
  disabled?: boolean;
  children: ReactNode;
}

export interface IPersonLearningListenerFileUploadProps {
  label: string;
  withInfo?: boolean;
  infoText?: string;
  fileName: string;
  onUpload: (file: File) => void;
  isUploading?: boolean;
  fieldError?: IListenerFieldError;
  fieldKey?: keyof IListenerFormState;
  disabled?: boolean;
  accept?: string;
}

export interface IPersonLearningListenerConfirmModalProps {
  isOpen: boolean;
  section: TListenerTab;
  isLoading: boolean;
  error: string;
  onClose: () => void;
  onConfirm: (password: string) => void;
}

export interface IListenerTabProps {
  formData: IListenerFormState;
  fieldErrors: TListenerFieldErrors;
  isSectionConfirmed: boolean;
  isReadOnly: boolean;
  allSectionsConfirmed?: boolean;
  isApplicationSubmitted?: boolean;
  applicationStatus?: string;
  organizerComment?: string;
  onChange: <TKey extends keyof IListenerFormState>(
    key: TKey,
    value: IListenerFormState[TKey]
  ) => void;
  onBack?: () => void;
  onSave: () => void;
  onContinue?: () => void;
  onSubmit?: () => void;
  onUploadDocument?: (documentType: TLearningDocumentType, file: File) => void;
  isSaving?: boolean;
  isUploading?: boolean;
}
