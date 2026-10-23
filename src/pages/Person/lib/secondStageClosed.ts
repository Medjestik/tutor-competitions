import type { IStageNavItem } from '../interface/interface';
import type { ISecondStageMaterials } from '../../../shared/utils/api';
import { CLOSED_FORM_MISSED_MESSAGE, CLOSED_FORM_SUBMITTED_MESSAGE } from './practiceFormClosed';

export const getClosedSecondStageMessage = (hasMaterials: boolean) =>
  hasMaterials ? CLOSED_FORM_SUBMITTED_MESSAGE : CLOSED_FORM_MISSED_MESSAGE;

export function withSecondStageNav(
  stages: IStageNavItem[],
  eligible: boolean,
  state: ISecondStageMaterials | null,
  failed = false,
): IStageNavItem[] {
  if (!eligible || state?.is_open) return stages;
  return stages.map((stage) => stage.id === 3 ? {
    ...stage,
    description: state ? getClosedSecondStageMessage(state.has_materials)
      : failed ? 'Не удалось проверить материалы' : 'Проверяем материалы…',
  } : stage);
}
