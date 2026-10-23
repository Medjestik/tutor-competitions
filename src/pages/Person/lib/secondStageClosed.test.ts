import { buildPersonStages } from './stages';
import { withSecondStageNav } from './secondStageClosed';

const state = { is_open: false, has_materials: false, practice_video_url: '', presentation_url: '', presentation_file_url: null, photo_url: null };

test('closed card uses saved material presence and stays clickable', () => {
  const stages = buildPersonStages(1, true);
  expect(withSecondStageNav(stages, true, state).find((stage) => stage.id === 3)).toMatchObject({
    description: 'Вы не успели, но можете пройти курс', type: 'default',
  });
  expect(withSecondStageNav(stages, true, { ...state, has_materials: true }).find((stage) => stage.id === 3)?.description).toBe('Ждите итогов');
  expect(withSecondStageNav(stages, true, state).find((stage) => stage.id === 1)).toEqual(stages.find((stage) => stage.id === 1));
});

test('open and ineligible cards remain unchanged', () => {
  const stages = buildPersonStages(1, false);
  expect(withSecondStageNav(stages, false, state)).toBe(stages);
  expect(withSecondStageNav(stages, true, { ...state, is_open: true })).toBe(stages);
});

test('loading and failed requests never classify a participant as missed', () => {
  const stages = buildPersonStages(1, true);
  expect(withSecondStageNav(stages, true, null).find((stage) => stage.id === 3)?.description).toBe('Проверяем материалы…');
  expect(withSecondStageNav(stages, true, null, true).find((stage) => stage.id === 3)?.description).toBe('Не удалось проверить материалы');
});
