import { act } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import type { ReactNode } from 'react';
import type { ISecondStageReport } from '../../shared/utils/api';
import { exportSecondStageParticipants, getNominations, getSecondStageParticipants } from '../../shared/utils/api';
import StaffSecondStageParticipants from './StaffSecondStageParticipants';

jest.mock('../../shared/utils/api', () => ({
  getSecondStageParticipants: jest.fn(), getNominations: jest.fn(), exportSecondStageParticipants: jest.fn()
}));
jest.mock('../../shared/components/Layout/ui/MainLayout', () => ({
  __esModule: true, default: ({ children }: { children: ReactNode }) => <main>{children}</main>
}));
jest.mock('./components/StaffBackButton', () => ({ __esModule: true, default: () => null }));

const getReport = getSecondStageParticipants as jest.MockedFunction<typeof getSecondStageParticipants>;
const getNominationList = getNominations as jest.MockedFunction<typeof getNominations>;
const exportReport = exportSecondStageParticipants as jest.MockedFunction<typeof exportSecondStageParticipants>;
const report = (): ISecondStageReport => ({
  count: 25, next: '?page=2', previous: null,
  cards: { total: 25, submitted: 1, inProgress: 1, notStarted: 23 },
  results: [{
    id: 1, fullname: 'Иванов Иван', educational_organization: 'Университет', nomination: null,
    email: 'test@example.com', phone_number: '+79990000000', telegram_username: '@teacher',
    secondStageStatus: 'in_progress', hasVideo: false, hasPresentation: true, hasPhoto: false,
    practice_video_url: '', presentation_file_url: 'https://example.com/file.pptx',
    presentation_url: 'https://example.com/slides', photo_url: null
  }]
});

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.setItem('token', 'test-token');
  getNominationList.mockResolvedValue([{ id: 1, name: 'Номинация' }]);
  getReport.mockResolvedValue(report());
});

test('shows contacts, both presentation sources, pagination and shared filters', async () => {
  render(<StaffSecondStageParticipants />);
  expect(await screen.findByText('Иванов Иван')).toBeVisible();
  expect(screen.getByText('test@example.com')).toHaveAttribute('href', 'mailto:test@example.com');
  expect(screen.getByText('Открыть файл')).toHaveAttribute('href', 'https://example.com/file.pptx');
  expect(screen.getByText('Открыть ссылку')).toHaveAttribute('href', 'https://example.com/slides');
  fireEvent.click(screen.getByText('Далее'));
  await waitFor(() => expect(getReport).toHaveBeenLastCalledWith('test-token', expect.objectContaining({ page: 2 }), expect.any(AbortSignal)));
  await screen.findByText('Иванов Иван');
  fireEvent.change(screen.getByLabelText('Поиск'), { target: { value: '@teacher' } });
  await screen.findByText('Иванов Иван');
  fireEvent.click(screen.getByLabelText('Нет видео'));
  await screen.findByText('Иванов Иван');
  fireEvent.click(screen.getByLabelText('Нет фото'));
  await waitFor(() => expect(getReport).toHaveBeenLastCalledWith('test-token', expect.objectContaining({
    page: 1, search: '@teacher', missing: ['video', 'photo']
  }), expect.any(AbortSignal)));
  await screen.findByText('Иванов Иван');
  fireEvent.click(screen.getByText('Сбросить фильтры'));
  await waitFor(() => expect(getReport).toHaveBeenLastCalledWith('test-token', {
    search: '', nomination: '', status: '', missing: [], page: 1
  }, expect.any(AbortSignal)));
});

test('ignores stale replies and disables export while the active query loads', async () => {
  let resolveOld: (value: ISecondStageReport) => void = () => undefined;
  getReport.mockImplementationOnce(() => new Promise((resolve) => { resolveOld = resolve; }));
  getReport.mockResolvedValueOnce({ ...report(), count: 0, results: [], cards: { total: 0, submitted: 0, inProgress: 0, notStarted: 0 } });
  render(<StaffSecondStageParticipants />);
  expect(screen.getByText('Скачать Excel')).toBeDisabled();
  fireEvent.change(screen.getByLabelText('Поиск'), { target: { value: 'нет совпадений' } });
  expect(await screen.findByText(/Участники не найдены/)).toBeVisible();
  await act(async () => resolveOld(report()));
  expect(screen.queryByText('Иванов Иван')).not.toBeInTheDocument();
});

test('reports list failure and retries successfully', async () => {
  getReport.mockRejectedValueOnce(new Error('server failed'));
  render(<StaffSecondStageParticipants />);
  expect(await screen.findByText('Не удалось загрузить участников.')).toBeVisible();
  expect(screen.getByText('Скачать Excel')).toBeDisabled();
  fireEvent.click(screen.getByText('Повторить'));
  expect(await screen.findByText('Иванов Иван')).toBeVisible();
});

test('exports applied filters, blocks repeat clicks and reports export failures', async () => {
  let rejectExport: (error: Error) => void = () => undefined;
  exportReport.mockImplementationOnce(() => new Promise((resolve, reject) => { rejectExport = reject; }));
  render(<StaffSecondStageParticipants />);
  await screen.findByText('Иванов Иван');
  fireEvent.change(screen.getByLabelText('Номинация'), { target: { value: '1' } });
  await screen.findByText('Иванов Иван');
  fireEvent.click(screen.getByText('Скачать Excel'));
  expect(screen.getByText('Подготовка Excel…')).toBeDisabled();
  fireEvent.click(screen.getByText('Подготовка Excel…'));
  expect(exportReport).toHaveBeenCalledTimes(1);
  expect(exportReport).toHaveBeenCalledWith('test-token', expect.objectContaining({ nomination: '1' }));
  await act(async () => rejectExport(new Error('failed')));
  expect(await screen.findByText(/Не удалось скачать Excel/)).toBeVisible();
  expect(screen.getByText('Скачать Excel')).toBeEnabled();
});

test('downloads the authorized Excel blob and revokes its temporary URL', async () => {
  const fileBlob = new Blob(['xlsx'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const createUrl = jest.fn(() => 'blob:second-stage-report');
  const revokeUrl = jest.fn();
  const clickLink = jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);
  Object.defineProperty(URL, 'createObjectURL', { configurable: true, value: createUrl });
  Object.defineProperty(URL, 'revokeObjectURL', { configurable: true, value: revokeUrl });
  exportReport.mockResolvedValue(fileBlob);
  render(<StaffSecondStageParticipants />);
  await screen.findByText('Иванов Иван');
  fireEvent.click(screen.getByText('Скачать Excel'));
  await waitFor(() => expect(clickLink).toHaveBeenCalled());
  const download = document.querySelector('a[download="second_stage_participants.xlsx"]');
  expect(download).not.toBeInTheDocument();
  expect(createUrl).toHaveBeenCalledWith(fileBlob);
  expect(exportReport).toHaveBeenCalledWith('test-token', expect.objectContaining({ page: 1 }));
  expect(clickLink).toHaveBeenCalledTimes(1);
  await waitFor(() => expect(revokeUrl).toHaveBeenCalledWith('blob:second-stage-report'), { timeout: 2000 });
  clickLink.mockRestore();
});
