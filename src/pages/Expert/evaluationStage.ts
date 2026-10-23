export type TEvaluationStage = 'qualifying' | 'semifinal';

export const getEvaluationStage = (params: URLSearchParams): TEvaluationStage =>
  params.get('stage') === 'qualifying' ? 'qualifying' : 'semifinal';

export const materialNames = (materials?: { has_video: boolean; has_presentation: boolean; has_photo: boolean }) =>
  materials ? [
    materials.has_video && 'Видео',
    materials.has_presentation && 'Презентация',
    materials.has_photo && 'Фото',
  ].filter(Boolean).join(', ') : '';
