import { buildPersonStages } from './stages';
import { EROUTES, EROUTESSTAGES } from '../../../shared/utils/ERoutes';

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

  it('blocks stage-1 results when unpublished at any current stage', () => {
    const stages = buildPersonStages(5, true, false);
    const results = stages.find((s) => s.id === 2);
    expect(results?.type).toBe('block');
    expect(results?.description).toBe('Дождитесь решения жюри');
    expect(results?.route).toBe(
      `${EROUTES.PERSON}/${EROUTESSTAGES.PERSON_RESULTS}`,
    );
  });

  it('opens stage-1 results when published even at stage 1', () => {
    const stages = buildPersonStages(1, false, true);
    const results = stages.find((s) => s.id === 2);
    expect(results?.type).toBe('default');
    expect(results?.route).toBe(
      `${EROUTES.PERSON}/${EROUTESSTAGES.PERSON_RESULTS}`,
    );
  });

  it('keeps video locked without flag when stage-1 results are published', () => {
    const stages = buildPersonStages(1, false, true);
    const video = stages.find((s) => s.id === 3);
    expect(video?.type).toBe('block');
  });

  it('blocks stage-2 results until published even for semifinalists', () => {
    const stages = buildPersonStages(5, true, true, false, false);
    expect(stages.find((s) => s.id === 4)?.type).toBe('block');
  });

  it('opens stage-2 results for semifinalists when final results published', () => {
    const stages = buildPersonStages(1, true, true, true, false);
    expect(stages.find((s) => s.id === 4)?.type).toBe('default');
  });

  it('opens final stage only for passed_final when published', () => {
    const stages = buildPersonStages(5, true, true, true, true);
    expect(stages.find((s) => s.id === 5)?.type).toBe('default');
    const notFinal = buildPersonStages(5, true, true, true, false);
    expect(notFinal.find((s) => s.id === 5)?.type).toBe('block');
  });
});
