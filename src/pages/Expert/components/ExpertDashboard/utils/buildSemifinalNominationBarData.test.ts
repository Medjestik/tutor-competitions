import { buildSemifinalNominationBarData } from './buildSemifinalNominationBarData';
import type { ISemifinalParticipant } from '../interface/interface';

const nominationMap = { 1: 'Номинация A' };

const participant = (
  id: number,
  status: ISemifinalParticipant['secondStageStatus'],
): ISemifinalParticipant => ({
  id,
  fullname: `User ${id}`,
  educational_organization: 'РУТ (МИИТ)',
  isSubmitted: false,
  hasFormProgress: false,
  isScored: false,
  main_position: '',
  nomination: 1,
  phone_number: '',
  email: `u${id}@example.com`,
  timezone: '',
  form_name: '',
  secondStageStatus: status,
});

describe('buildSemifinalNominationBarData', () => {
  it('filters by submitted mode', () => {
    const items = buildSemifinalNominationBarData(
      [participant(1, 'submitted'), participant(2, 'in_progress')],
      'submitted',
      nominationMap,
    );
    expect(items[0].universities[0].participants).toHaveLength(1);
    expect(items[0].universities[0].participants[0].id).toBe(1);
  });

  it('excludes not_started from chart data', () => {
    const items = buildSemifinalNominationBarData(
      [participant(3, 'not_started')],
      'in_progress',
      nominationMap,
    );
    const total = items.reduce(
      (sum, item) =>
        sum + item.universities.reduce((s, u) => s + u.participants.length, 0),
      0,
    );
    expect(total).toBe(0);
  });
});
