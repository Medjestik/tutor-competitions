import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import StaffLearningApplicationDetail from './StaffLearningApplicationDetail';
import { approveLearningApplication, createStaffLearningStream, getLearningApplicationDetail, getStaffLearningStreams } from '../../shared/utils/api';

jest.mock('react-router-dom', () => ({ useParams: () => ({ id: '1' }), Link: ({ children }: any) => <span>{children}</span> }));
jest.mock('../../shared/components/Layout/ui/MainLayout', () => ({ children }: any) => <div>{children}</div>);
jest.mock('../../shared/components/ToastProvider/ui/ToastProvider', () => ({ useToast: () => ({ showToast: jest.fn() }) }));
jest.mock('../../shared/utils/api', () => ({ getLearningApplicationDetail: jest.fn(), getStaffLearningStreams: jest.fn(), approveLearningApplication: jest.fn(), createStaffLearningStream: jest.fn() }));

test('requires a stream and submits the selected stream', async () => {
  localStorage.setItem('token', 'staff');
  (getLearningApplicationDetail as jest.Mock).mockResolvedValue({ id: 1, status: 'submitted', courseId: 3 });
  (getStaffLearningStreams as jest.Mock).mockResolvedValue([{ id: 4, name: 'Поток', startDate: '2026-11-01', endDate: '2026-11-30' }]);
  (approveLearningApplication as jest.Mock).mockResolvedValue({ id: 1, status: 'approved', courseId: 3 });
  render(<StaffLearningApplicationDetail />);
  const open = (await screen.findAllByRole('button', { name: 'Одобрить' }))[0];
  fireEvent.click(open);
  await screen.findByRole('option', { name: /Поток \(/ });
  fireEvent.click(screen.getAllByRole('button', { name: 'Одобрить' }).slice(-1)[0]);
  expect((await screen.findAllByText('Выберите поток курса')).length).toBeGreaterThan(0);
  expect(approveLearningApplication).not.toHaveBeenCalled();
  fireEvent.change(screen.getByLabelText('Поток обучения'), { target: { value: '4' } });
  fireEvent.click(screen.getAllByRole('button', { name: 'Одобрить' }).slice(-1)[0]);
  await waitFor(() => expect(approveLearningApplication).toHaveBeenCalledWith('staff', 1, 4));
});

test('shows server error when approval fails', async () => {
  localStorage.setItem('token', 'staff');
  (getLearningApplicationDetail as jest.Mock).mockResolvedValue({ id: 1, status: 'submitted', courseId: 3 });
  (getStaffLearningStreams as jest.Mock).mockResolvedValue([{ id: 4, name: 'Поток', startDate: '2026-11-01', endDate: '2026-11-30' }]);
  (approveLearningApplication as jest.Mock).mockRejectedValue(new Error('offline'));
  render(<StaffLearningApplicationDetail />);
  fireEvent.click((await screen.findAllByRole('button', { name: 'Одобрить' }))[0]);
  await screen.findByRole('option', { name: /Поток \(/ });
  fireEvent.change(screen.getByLabelText('Поток обучения'), { target: { value: '4' } });
  fireEvent.click(screen.getAllByRole('button', { name: 'Одобрить' }).slice(-1)[0]);
  expect((await screen.findAllByText('Не удалось одобрить заявку.')).length).toBeGreaterThan(0);
});

test('opens stream management from approval and refreshes selection', async () => {
  localStorage.setItem('token', 'staff');
  (getLearningApplicationDetail as jest.Mock).mockResolvedValue({ id: 1, status: 'submitted', courseId: 3 });
  (getStaffLearningStreams as jest.Mock).mockResolvedValue([]);
  (createStaffLearningStream as jest.Mock).mockImplementation(async () => {
    (getStaffLearningStreams as jest.Mock).mockResolvedValue([{ id: 8, name: 'Новый', startDate: '2026-12-01', endDate: '2026-12-30' }]);
  });
  render(<StaffLearningApplicationDetail />);
  fireEvent.click((await screen.findAllByRole('button', { name: 'Одобрить' }))[0]);
  fireEvent.click(screen.getByRole('button', { name: 'Потоки' }));
  fireEvent.change(screen.getByLabelText('Название'), { target: { value: 'Новый' } });
  fireEvent.change(screen.getByLabelText('Начало'), { target: { value: '2026-12-01' } });
  fireEvent.change(screen.getByLabelText('Окончание'), { target: { value: '2026-12-30' } });
  fireEvent.click(screen.getByRole('button', { name: 'Создать поток' }));
  await screen.findByRole('option', { name: /Новый \(/ });
  fireEvent.click(screen.getByRole('button', { name: 'Закрыть' }));
  fireEvent.change(screen.getByLabelText('Поток обучения'), { target: { value: '8' } });
  expect(screen.getByLabelText('Поток обучения')).toHaveValue('8');
});
