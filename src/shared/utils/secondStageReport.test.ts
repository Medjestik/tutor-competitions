import { exportSecondStageParticipants, getSecondStageParticipants, secondStageQuery } from './api';
import type { ISecondStageFilters } from './api';

const filters: ISecondStageFilters = { search: ' Иван ', nomination: '1', status: 'in_progress', missing: ['video', 'photo'], page: 2 };

test('list and export serialize the same filters, export omits pagination', () => {
  const list = new URLSearchParams(secondStageQuery(filters));
  const exported = new URLSearchParams(secondStageQuery(filters, true));
  expect(list.get('search')).toBe('Иван');
  expect(list.getAll('missing')).toEqual(['video', 'photo']);
  expect(list.get('page')).toBe('2');
  list.delete('page');
  expect(list.toString()).toBe(exported.toString());
});

test('both requests carry JWT and failed export never reads the response as a file', async () => {
  const blob = jest.fn();
  const fetchMock = jest.fn().mockResolvedValue({ ok: false, blob });
  window.fetch = fetchMock;
  await expect(exportSecondStageParticipants('jwt', filters)).rejects.toThrow();
  expect(blob).not.toHaveBeenCalled();
  fetchMock.mockResolvedValue({ ok: true, json: async () => ({ count: 0 }) });
  await getSecondStageParticipants('jwt', filters);
  for (const call of fetchMock.mock.calls) expect(call[1].headers.Authorization).toBe('Bearer jwt');
});
