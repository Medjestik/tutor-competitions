import { exportStaffCourseTestScores } from './api';

test('score export sends only the selected stream and staff token', async () => {
  const file = new Blob(['xlsx']);
  const fetchMock = jest.fn().mockResolvedValue({ ok: true, blob: async () => file });
  window.fetch = fetchMock;
  await expect(exportStaffCourseTestScores('staff-jwt', 3, 12)).resolves.toBe(file);
  const [url, options] = fetchMock.mock.calls[0];
  expect(url).toContain('/lms/staff/courses/3/test-scores/export/?learningStreamId=12');
  expect(options.headers.Authorization).toBe('Bearer staff-jwt');
});

test('failed exports do not download error responses', async () => {
  const blob = jest.fn();
  const response = { ok: false, status: 400, blob };
  window.fetch = jest.fn().mockResolvedValue(response);
  await expect(exportStaffCourseTestScores('jwt', 3, 12)).rejects.toBe(response);
  expect(blob).not.toHaveBeenCalled();
});
