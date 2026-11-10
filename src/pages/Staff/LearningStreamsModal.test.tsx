import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import LearningStreamsModal from './LearningStreamsModal';
import { createStaffLearningStream, getStaffLearningStreams, updateStaffLearningStream } from '../../shared/utils/api';

jest.mock('../../shared/utils/api', () => ({ createStaffLearningStream: jest.fn(), updateStaffLearningStream: jest.fn(), deleteStaffLearningStream: jest.fn(), getStaffLearningStreams: jest.fn() }));

test('creates and edits a stream, then returns to the caller', async () => {
  localStorage.setItem('token', 'staff');
  const existing = { id: 5, name: 'Первый', startDate: '2026-11-01', endDate: '2026-11-30' };
  (getStaffLearningStreams as jest.Mock).mockResolvedValue([existing]);
  (createStaffLearningStream as jest.Mock).mockResolvedValue({});
  (updateStaffLearningStream as jest.Mock).mockResolvedValue({});
  const onClose = jest.fn(); const onChanged = jest.fn();
  render(<LearningStreamsModal isOpen courseId={3} onClose={onClose} onChanged={onChanged} />);
  await screen.findByText('Первый');
  fireEvent.change(screen.getByLabelText('Название'), { target: { value: 'Новый' } });
  fireEvent.change(screen.getByLabelText('Начало'), { target: { value: '2026-12-01' } });
  fireEvent.change(screen.getByLabelText('Окончание'), { target: { value: '2026-12-30' } });
  fireEvent.click(screen.getByRole('button', { name: 'Создать поток' }));
  await waitFor(() => expect(createStaffLearningStream).toHaveBeenCalledWith('staff', 3, { name: 'Новый', startDate: '2026-12-01', endDate: '2026-12-30' }));
  fireEvent.click(screen.getByRole('button', { name: 'Изменить' }));
  fireEvent.change(screen.getByLabelText('Название'), { target: { value: 'Изменённый' } });
  fireEvent.click(screen.getByRole('button', { name: 'Сохранить' }));
  await waitFor(() => expect(updateStaffLearningStream).toHaveBeenCalledWith('staff', 3, 5, { name: 'Изменённый', startDate: existing.startDate, endDate: existing.endDate }));
  await waitFor(() => expect(onChanged).toHaveBeenCalledTimes(2));
  fireEvent.click(screen.getByRole('button', { name: 'Закрыть' }));
  expect(onClose).toHaveBeenCalled();
});
