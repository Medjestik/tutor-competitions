import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import PersonStageWorkshop from './PersonStageWorkshop';
import * as api from '../../../../../shared/utils/api';

let mockFinalist = false;
jest.mock('../../../../../store/store', () => ({
  useSelector: (selector: (state: unknown) => unknown) => selector({ user: { user: { passed_second_stage: true, passed_final: mockFinalist } } }),
}));
jest.mock('../../../../../shared/utils/api', () => ({ getFormData: jest.fn(), downloadParticipantCertificate: jest.fn() }));

beforeEach(() => {
  mockFinalist = false;
  localStorage.setItem('token', 'token');
  jest.clearAllMocks();
  (api.getFormData as jest.Mock).mockResolvedValue({ status: 'submitted' });
});

test('non-finalist sees certificate and semifinal protocol above illustration', async () => {
  render(<PersonStageWorkshop isPublished />);
  expect(await screen.findByText('К сожалению, ваша работа не вышла в финал.')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Скачать сертификат' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Скачать протокол' })).toHaveAttribute('href', '/protocol-semifinal.pdf');
});

test('certificate failure can be retried', async () => {
  (api.downloadParticipantCertificate as jest.Mock).mockRejectedValue(new Error('offline'));
  render(<PersonStageWorkshop isPublished />);
  fireEvent.click(await screen.findByRole('button', { name: 'Скачать сертификат' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Не удалось скачать сертификат');
  fireEvent.click(screen.getByRole('button', { name: 'Скачать сертификат' }));
  await waitFor(() => expect(api.downloadParticipantCertificate).toHaveBeenCalledTimes(2));
  expect(await screen.findByRole('alert')).toBeInTheDocument();
});

test('downloads certificate for a non-finalist', async () => {
  (api.downloadParticipantCertificate as jest.Mock).mockResolvedValue(new Blob(['pdf']));
  Object.defineProperty(URL, 'createObjectURL', { configurable: true, value: jest.fn(() => 'blob:test') });
  Object.defineProperty(URL, 'revokeObjectURL', { configurable: true, value: jest.fn() });
  const click = jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
  render(<PersonStageWorkshop isPublished />);
  fireEvent.click(await screen.findByRole('button', { name: 'Скачать сертификат' }));
  await waitFor(() => expect(click).toHaveBeenCalled());
  expect(api.downloadParticipantCertificate).toHaveBeenCalledWith('token');
  click.mockRestore();
});

test('finalist and unpublished result preserve prior behavior', async () => {
  mockFinalist = true;
  const { unmount } = render(<PersonStageWorkshop isPublished />);
  expect(await screen.findByText('Работа прошла в финал')).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Скачать сертификат' })).not.toBeInTheDocument();
  unmount();
  render(<PersonStageWorkshop isPublished={false} />);
  expect(screen.getByText('Результаты ещё не опубликованы')).toBeInTheDocument();
});

test('form status failure is retried rather than treated as draft', async () => {
  const log = jest.spyOn(console, 'error').mockImplementation(() => {});
  (api.getFormData as jest.Mock).mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce({ status: 'submitted' });
  render(<PersonStageWorkshop isPublished />);
  expect(await screen.findByRole('alert')).toHaveTextContent('Не удалось загрузить');
  fireEvent.click(screen.getByRole('button', { name: 'Повторить' }));
  expect(await screen.findByText('К сожалению, ваша работа не вышла в финал.')).toBeInTheDocument();
  log.mockRestore();
});

