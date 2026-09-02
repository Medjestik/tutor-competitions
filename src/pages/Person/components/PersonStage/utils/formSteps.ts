import type { IFormFieldDef } from '../../../interface/interface';

export type TPracticeFormStep = 'about' | 'description' | 'results' | 'materials';

export const PRACTICE_FORM_STEPS: { id: TPracticeFormStep; label: string }[] = [
  { id: 'about', label: 'О практике' },
  { id: 'description', label: 'Описание' },
  { id: 'results', label: 'Результаты' },
  { id: 'materials', label: 'Материалы' },
];

const RESULTS_FIELD_KEYS = new Set([
  'results',
  'result',
  'reproducibility',
  'demand_effect',
  'sustainability',
]);

export function getFieldStep(key: string): TPracticeFormStep {
  if (key === 'name') {
    return 'about';
  }
  if (RESULTS_FIELD_KEYS.has(key)) {
    return 'results';
  }
  return 'description';
}

export function getFieldsForStep(
  schema: IFormFieldDef[],
  step: TPracticeFormStep,
): IFormFieldDef[] {
  if (step === 'materials') {
    return [];
  }
  return schema.filter((field) => getFieldStep(field.key) === step);
}

export function getStepIndex(step: TPracticeFormStep): number {
  return PRACTICE_FORM_STEPS.findIndex((item) => item.id === step);
}

export function getNextStep(step: TPracticeFormStep): TPracticeFormStep | null {
  const index = getStepIndex(step);
  if (index < 0 || index >= PRACTICE_FORM_STEPS.length - 1) {
    return null;
  }
  return PRACTICE_FORM_STEPS[index + 1].id;
}

export function getPreviousStep(step: TPracticeFormStep): TPracticeFormStep | null {
  const index = getStepIndex(step);
  if (index <= 0) {
    return null;
  }
  return PRACTICE_FORM_STEPS[index - 1].id;
}
