import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import StaffLearningApplicationDetail from './StaffLearningApplicationDetail';
import { approveLearningApplication, createStaffLearningStream, getLearningApplicationDetail, getStaffLearningStreams, reopenLearningApplication } from '../../shared/utils/api';

jest.mock('react-router-dom', () => ({ useParams: () => ({ id: '1' }), Link: ({ children }: any) => <span>{children}</span> }));
jest.mock('../../shared/components/Layout/ui/MainLayout', () => ({ children }: any) => <div>{children}</div>);
jest.mock('../../shared/components/ToastProvider/ui/ToastProvider', () => ({ useToast: () => ({ showToast: jest.fn() }) }));
jest.mock('../../shared/utils/api', () => ({ getLearningApplicationDetail: jest.fn(), getStaffLearningStreams: jest.fn(), approveLearningApplication: jest.fn(), createStaffLearningStream: jest.fn(), reopenLearningApplication: jest.fn() }));

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

const reopenButton = 'Вернуть в статус «Подана»';
const accessWarning = /Доступ слушателя к курсу будет закрыт/;

beforeEach(() => {
  localStorage.setItem('token', 'staff');
  (reopenLearningApplication as jest.Mock).mockReset();
});

test.each(['filling', 'correction_required', 'rejected', 'approved', 'submitted'])(
  'shows the appropriate reopen action for %s',
  async (status) => {
    (getLearningApplicationDetail as jest.Mock).mockResolvedValue({
      id: 1, status, courseId: 3, statusDisplay: 'Текущий статус',
    });
    render(<StaffLearningApplicationDetail />);
    await screen.findByText(/Текущий статус/);
    if (status === 'submitted') {
      expect(screen.queryByRole('button', { name: reopenButton })).not.toBeInTheDocument();
      return;
    }
    fireEvent.click(screen.getByRole('button', { name: reopenButton }));
    expect(screen.getByRole('heading', { name: 'Вернуть заявку в статус «Подана»?' })).toBeInTheDocument();
    if (status === 'approved') {
      expect(screen.getByText(accessWarning)).toBeInTheDocument();
    } else {
      expect(screen.queryByText(accessWarning)).not.toBeInTheDocument();
    }
  }
);

test('cancels reopen without changing the application', async () => {
  (getLearningApplicationDetail as jest.Mock).mockResolvedValue({
    id: 1, status: 'approved', statusDisplay: 'Одобрена',
  });
  render(<StaffLearningApplicationDetail />);
  fireEvent.click(await screen.findByRole('button', { name: reopenButton }));
  const popup = screen.getByText(accessWarning).parentElement!;
  fireEvent.click(within(popup).getByRole('button', { name: 'Отменить' }));
  expect(screen.queryByText(accessWarning)).not.toBeInTheDocument();
  expect(screen.getByText(/Статус: Одобрена/)).toBeInTheDocument();
  expect(reopenLearningApplication).not.toHaveBeenCalled();
});

test('reopens the application and enables review actions', async () => {
  (getLearningApplicationDetail as jest.Mock).mockResolvedValue({ id: 1, status: 'approved' });
  (reopenLearningApplication as jest.Mock).mockResolvedValue({
    id: 1, status: 'submitted', statusDisplay: 'Подана',
  });
  render(<StaffLearningApplicationDetail />);
  fireEvent.click(await screen.findByRole('button', { name: reopenButton }));
  fireEvent.click(screen.getByRole('button', { name: 'Вернуть заявку' }));
  await screen.findByText(/Статус: Подана/);
  expect(reopenLearningApplication).toHaveBeenCalledWith('staff', 1, 'approved');
  expect(screen.queryByRole('button', { name: reopenButton })).not.toBeInTheDocument();
  for (const name of ['Одобрить', 'На исправление', 'Отклонить']) {
    expect(screen.getAllByRole('button', { name })[0]).toBeEnabled();
  }
});

test('keeps the confirmation open when reopening fails', async () => {
  (getLearningApplicationDetail as jest.Mock).mockResolvedValue({ id: 1, status: 'rejected' });
  (reopenLearningApplication as jest.Mock).mockRejectedValue(new Response(
    JSON.stringify({ error: 'Статус заявки изменился.' }), { status: 409 }
  ));
  render(<StaffLearningApplicationDetail />);
  fireEvent.click(await screen.findByRole('button', { name: reopenButton }));
  fireEvent.click(screen.getByRole('button', { name: 'Вернуть заявку' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Статус заявки изменился.');
  expect(screen.getByRole('button', { name: 'Вернуть заявку' })).toBeEnabled();
});
