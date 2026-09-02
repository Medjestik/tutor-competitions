import type { ICoauthor, IFormFieldDef } from '../../../interface/interface';
import { ORGANIZATION_OPTIONS } from '../../../../Registration/lib/organizations';
import { getFieldStep, getFieldsForStep, type TPracticeFormStep } from './formSteps';

const REQUIRED_MESSAGE = 'Поле обязательно для заполнения.';

const organizationNames = new Set(
  ORGANIZATION_OPTIONS.filter((option) => option.id !== 0).map((option) => option.name),
);

export function validateFieldValue(
  field: IFormFieldDef,
  value: string,
): string | null {
  const trimmed = value.trim();

  if (field.required && !trimmed) {
    return REQUIRED_MESSAGE;
  }

  if (trimmed && trimmed.length > field.max_length) {
    return `Не более ${field.max_length} символов.`;
  }

  return null;
}

export function validateStep(
  step: TPracticeFormStep,
  schema: IFormFieldDef[],
  answers: Record<string, string>,
  nominationId: number,
): Record<string, string> {
  const errors: Record<string, string> = {};

  if (step === 'about' && nominationId === 0) {
    errors.nomination = 'Выберите номинацию.';
  }

  getFieldsForStep(schema, step).forEach((field) => {
    const error = validateFieldValue(field, answers[field.key] ?? '');
    if (error) {
      errors[field.key] = error;
    }
  });

  return errors;
}

export function validateAllRequired(
  schema: IFormFieldDef[],
  answers: Record<string, string>,
  nominationId: number,
): Record<string, string> {
  const errors: Record<string, string> = {};

  if (nominationId === 0) {
    errors.nomination = 'Выберите номинацию.';
  }

  schema.forEach((field) => {
    const error = validateFieldValue(field, answers[field.key] ?? '');
    if (error) {
      errors[field.key] = error;
    }
  });

  return errors;
}

export function validateCoauthors(coauthors: ICoauthor[]): Record<string, string> {
  const messages: string[] = [];

  coauthors.forEach((item, index) => {
    const fullName = item.full_name.trim();
    const position = item.position.trim();
    const organization = item.educational_organization.trim();
    const hasAny = Boolean(fullName || position || organization);

    if (!hasAny) {
      return;
    }

    if (!fullName) {
      messages.push(`Соавтор ${index + 1}: укажите ФИО.`);
    }
    if (!position) {
      messages.push(`Соавтор ${index + 1}: укажите должность.`);
    }
    if (!organization) {
      messages.push(`Соавтор ${index + 1}: укажите образовательную организацию.`);
    } else if (!organizationNames.has(organization)) {
      messages.push(
        `Соавтор ${index + 1}: недопустимая образовательная организация.`,
      );
    }
  });

  if (messages.length > 0) {
    return { coauthors: messages.join(' ') };
  }

  return {};
}

export function getFirstErrorStep(
  errors: Record<string, string>,
  schema: IFormFieldDef[],
): TPracticeFormStep | null {
  if (errors.nomination) {
    return 'about';
  }

  if (errors.coauthors) {
    return 'materials';
  }

  for (const field of schema) {
    if (errors[field.key]) {
      return getFieldStep(field.key);
    }
  }

  return null;
}
