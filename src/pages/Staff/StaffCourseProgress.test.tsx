import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import StaffCourseProgress from './StaffCourseProgress';
import { exportStaffCourseTestScores, getStaffLearningStreams, getStaffProgressCourses, getStaffCourseProgressList } from '../../shared/utils/api';

jest.mock('../../shared/components/Layout/ui/MainLayout', () => ({ children }: any) => <div>{children}</div>);
jest.mock('./components/StaffBackButton', () => () => null);
jest.mock('../../shared/utils/api', () => ({
  getStaffProgressCourses: jest.fn(),
  getStaffLearningStreams: jest.fn(),
  getStaffCourseProgressList: jest.fn(),
  exportStaffCourseTestScores: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.setItem('token', 'staff-jwt');
  (getStaffProgressCourses as jest.Mock).mockResolvedValue([{ id: 3, name: 'Курс' }]);
  (getStaffLearningStreams as jest.Mock).mockResolvedValue([{ id: 12, name: 'Поток 1' }]);
  (getStaffCourseProgressList as jest.Mock).mockResolvedValue({ results: [], count: 0, next: null, previous: null });
});

test('requires a concrete stream, exports whole stream, shows loading and failure', async () => {
  render(<StaffCourseProgress />);
  await screen.findByRole('option', { name: 'Курс' });
  const button = screen.getByRole('button', { name: 'Excel: баллы за тесты' });
  expect(button).toBeDisabled();
  fireEvent.change(screen.getByLabelText('Курс'), { target: { value: '3' } });
  await screen.findByRole('option', { name: 'Поток 1' });
  expect(button).toBeDisabled();
  fireEvent.change(screen.getByLabelText('Орг. поток'), { target: { value: 'none' } });
  expect(button).toBeDisabled();
  fireEvent.change(screen.getByLabelText('Орг. поток'), { target: { value: '12' } });
  await waitFor(() => expect(button).toBeEnabled());
  let rejectExport: (reason?: unknown) => void = () => {};
  (exportStaffCourseTestScores as jest.Mock).mockImplementation(() => new Promise((_, reject) => { rejectExport = reject; }));
  fireEvent.click(button);
  expect(exportStaffCourseTestScores).toHaveBeenCalledWith('staff-jwt', 3, 12);
  expect(screen.getByRole('button', { name: 'Выгрузка баллов…' })).toBeDisabled();
  rejectExport(new Error('network'));
  await screen.findByText('Не удалось выгрузить баллы за тесты. Попробуйте ещё раз.');
  expect(button).toBeEnabled();
});

test('downloads the selected stream workbook and releases the object URL', async () => {
  const file = new Blob(['xlsx']);
  (exportStaffCourseTestScores as jest.Mock).mockResolvedValue(file);
  window.URL.createObjectURL = jest.fn().mockReturnValue('blob:scores');
  window.URL.revokeObjectURL = jest.fn();
  const click = jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
  render(<StaffCourseProgress />);
  await screen.findByRole('option', { name: 'Курс' });
  fireEvent.change(screen.getByLabelText('Курс'), { target: { value: '3' } });
  await screen.findByRole('option', { name: 'Поток 1' });
  fireEvent.change(screen.getByLabelText('Орг. поток'), { target: { value: '12' } });
  fireEvent.click(screen.getByRole('button', { name: 'Excel: баллы за тесты' }));
  await waitFor(() => expect(click).toHaveBeenCalledTimes(1));
  expect(click.mock.instances[0].download).toBe('test_scores_course_3_stream_12.xlsx');
  expect(window.URL.createObjectURL).toHaveBeenCalledWith(file);
  expect(window.URL.revokeObjectURL).toHaveBeenCalledWith('blob:scores');
  click.mockRestore();
});
