import { buildPersonStages } from './stages';

describe('buildPersonStages', () => {
  it('opens video presentation when passed second stage even at stage 1', () => {
    const stages = buildPersonStages(1, true);
    const video = stages.find((s) => s.id === 3);
    expect(video?.type).toBe('default');
  });

  it('blocks video presentation without flag even at stage 3', () => {
    const stages = buildPersonStages(3, false);
    const video = stages.find((s) => s.id === 3);
    expect(video?.type).toBe('block');
  });
});
