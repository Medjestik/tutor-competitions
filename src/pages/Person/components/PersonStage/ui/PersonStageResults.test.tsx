import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import PersonStageResults from './PersonStageResults';
import * as api from '../../../../../shared/utils/api';

jest.mock('../../../../../shared/utils/api', () => ({ getFormData: jest.fn(), downloadParticipantCertificate: jest.fn() }));
jest.mock('../../../../../store/store', () => ({ useSelector: jest.fn() }));
import { useSelector } from '../../../../../store/store';

const getFormData = api.getFormData as jest.Mock;

beforeEach(() => {
  localStorage.setItem('token', 'test-token');
  getFormData.mockReset();
  (useSelector as unknown as jest.Mock).mockReturnValue(false);
});

test('reports a loading error and retries without claiming the form was missed', async () => {
  getFormData.mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce({ status: 'submitted' });
  const error = jest.spyOn(console, 'error').mockImplementation(() => {});
  render(<PersonStageResults isPublished />);
  expect(await screen.findByRole('alert')).toHaveTextContent('Не удалось загрузить');
  expect(screen.queryByText(/Вы не отправили анкету/)).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Повторить' }));
  expect(await screen.findByText('К сожалению, ваша работа не вышла в полуфинал.')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Скачать сертификат' })).toBeInTheDocument();
  expect(getFormData).toHaveBeenCalledTimes(2);
  error.mockRestore();
});

test('shows the qualified outcome and protocol', async () => {
  (useSelector as unknown as jest.Mock).mockReturnValue(true);
  getFormData.mockResolvedValue({ status: 'submitted' });
  render(<PersonStageResults isPublished />);
  expect(await screen.findByText('Ваша работа вышла в полуфинал')).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Скачать сертификат' })).not.toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Скачать протокол' })).toBeInTheDocument();
});

test('shows missed form and protocol for a draft', async () => {
  getFormData.mockResolvedValue({ status: 'draft' });
  render(<PersonStageResults isPublished />);
  expect(await screen.findByText(/Вы не отправили анкету/)).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Скачать сертификат' })).not.toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Скачать протокол' })).toHaveAttribute('href', '/protocol-stage-1.pdf');
});

test('shows an error and allows retry when certificate download fails', async () => {
  getFormData.mockResolvedValue({ status: 'submitted' });
  (api.downloadParticipantCertificate as jest.Mock).mockRejectedValue(new Error('offline'));
  render(<PersonStageResults isPublished />);
  fireEvent.click(await screen.findByRole('button', { name: 'Скачать сертификат' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Не удалось скачать сертификат');
  fireEvent.click(screen.getByRole('button', { name: 'Скачать сертификат' }));
  await waitFor(() => expect(api.downloadParticipantCertificate).toHaveBeenCalledTimes(2));
  expect(await screen.findByRole('alert')).toHaveTextContent('Не удалось скачать сертификат');
});

test('downloads a PDF for an eligible participant', async () => {
  getFormData.mockResolvedValue({ status: 'submitted' });
  (api.downloadParticipantCertificate as jest.Mock).mockResolvedValue(new Blob(['pdf'], { type: 'application/pdf' }));
  const create = jest.fn(() => 'blob:test');
  const revoke = jest.fn();
  Object.defineProperty(URL, 'createObjectURL', { configurable: true, value: create });
  Object.defineProperty(URL, 'revokeObjectURL', { configurable: true, value: revoke });
  const click = jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
  render(<PersonStageResults isPublished />);
  fireEvent.click(await screen.findByRole('button', { name: 'Скачать сертификат' }));
  await waitFor(() => expect(click).toHaveBeenCalled());
  expect(api.downloadParticipantCertificate).toHaveBeenCalledWith('test-token');
  expect(revoke).toHaveBeenCalledWith('blob:test');
  click.mockRestore();
});

test('does not load or show results before publication', () => {
  render(<PersonStageResults isPublished={false} />);
  expect(screen.getByText('Результаты ещё не опубликованы')).toBeInTheDocument();
  expect(getFormData).not.toHaveBeenCalled();
});
