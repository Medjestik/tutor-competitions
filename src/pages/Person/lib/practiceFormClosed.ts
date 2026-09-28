export const PRACTICE_FORM_STAGE_ID = 1;

export const CLOSED_FORM_SUBMITTED_MESSAGE = 'Ждите итогов';
export const CLOSED_FORM_MISSED_MESSAGE =
  'Вы не успели, но можете пройти курс';

export function getClosedPracticeFormMessage(
  formStatus: string | null | undefined,
): string {
  return formStatus === 'submitted'
    ? CLOSED_FORM_SUBMITTED_MESSAGE
    : CLOSED_FORM_MISSED_MESSAGE;
}
