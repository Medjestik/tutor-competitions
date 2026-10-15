export const PRACTICE_FORM_STAGE_ID = 1;

export const CLOSED_FORM_SUBMITTED_MESSAGE = 'Ждите итогов';
export const CLOSED_FORM_MISSED_MESSAGE =
  'Вы не успели, но можете пройти курс';
export const CLOSED_FORM_MISSED_PAGE_MESSAGE =
  'К сожалению, вы не успели подать анкету педагогической практики в установленный срок для участия в конкурсе. Однако у вас по-прежнему есть возможность пройти бесплатную программу повышения квалификации «Инженерная дидактика в транспортном образовании» и получить удостоверение установленного образца.';

export function getClosedPracticeFormMessage(
  formStatus: string | null | undefined,
): string {
  return formStatus === 'submitted'
    ? CLOSED_FORM_SUBMITTED_MESSAGE
    : CLOSED_FORM_MISSED_MESSAGE;
}
