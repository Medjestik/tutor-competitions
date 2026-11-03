import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import CoauthorCertificate from './CoauthorCertificate';
import { downloadCertificateWithCoauthors } from '../../../../../shared/utils/api';

jest.mock('../../../../../shared/utils/api', () => ({ downloadCertificateWithCoauthors: jest.fn() }));

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.setItem('token', 'test');
});

test('opens four fields, validates first and closes with Escape', async () => {
  render(<CoauthorCertificate />);
  const trigger = screen.getByRole('button', { name: 'Сертификат для соавторов' });
  fireEvent.click(trigger);
  expect(screen.getByRole('dialog')).toBeInTheDocument();
  expect(screen.getAllByRole('textbox')).toHaveLength(4);
  expect(screen.getAllByRole('textbox')[0]).toHaveFocus();
  expect(screen.getAllByRole('textbox')[0]).toBeRequired();
  fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  expect(trigger).toHaveFocus();
});

test('retains input on failure and downloads entered names on retry', async () => {
  (downloadCertificateWithCoauthors as jest.Mock).mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce(new Blob(['pdf']));
  Object.defineProperty(URL, 'createObjectURL', { configurable: true, value: jest.fn(() => 'blob:test') });
  Object.defineProperty(URL, 'revokeObjectURL', { configurable: true, value: jest.fn() });
  const click = jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
  render(<CoauthorCertificate />);
  fireEvent.click(screen.getByRole('button', { name: 'Сертификат для соавторов' }));
  const inputs = screen.getAllByRole('textbox');
  fireEvent.change(inputs[0], { target: { value: ' Иванов Иван ' } });
  fireEvent.change(inputs[2], { target: { value: 'Петров Пётр' } });
  fireEvent.click(screen.getByRole('button', { name: 'Скачать сертификат' }));
  expect(await screen.findByRole('alert')).toBeInTheDocument();
  expect(inputs[0]).toHaveValue(' Иванов Иван ');
  fireEvent.click(screen.getByRole('button', { name: 'Скачать сертификат' }));
  await waitFor(() => expect(click).toHaveBeenCalled());
  expect(downloadCertificateWithCoauthors).toHaveBeenLastCalledWith('test', ['Иванов Иван', 'Петров Пётр']);
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  click.mockRestore();
});
