import { fireEvent, render, screen } from '@testing-library/react';
import PersonStageResults from './PersonStageResults';
import * as api from '../../../../../shared/utils/api';

jest.mock('../../../../../shared/utils/api', () => ({ getFormData: jest.fn() }));
jest.mock('../../../../../store/store', () => ({ useSelector: () => false }));

const getFormData = api.getFormData as jest.Mock;

beforeEach(() => {
  localStorage.setItem('token', 'test-token');
  getFormData.mockReset();
});

test('reports a loading error and retries without claiming the form was missed', async () => {
  getFormData.mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce({ status: 'submitted' });
  const error = jest.spyOn(console, 'error').mockImplementation(() => {});
  render(<PersonStageResults isPublished />);
  expect(await screen.findByRole('alert')).toHaveTextContent('Не удалось загрузить');
  expect(screen.queryByText(/Вы не отправили анкету/)).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Повторить' }));
  expect(await screen.findByText('Работа не прошла в полуфинал')).toBeInTheDocument();
  expect(getFormData).toHaveBeenCalledTimes(2);
  error.mockRestore();
});

test('shows missed form and protocol for a draft', async () => {
  getFormData.mockResolvedValue({ status: 'draft' });
  render(<PersonStageResults isPublished />);
  expect(await screen.findByText(/Вы не отправили анкету/)).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Скачать протокол' })).toHaveAttribute('href', '/protocol-stage-1.pdf');
});

test('does not load or show results before publication', () => {
  render(<PersonStageResults isPublished={false} />);
  expect(screen.getByText('Результаты ещё не опубликованы')).toBeInTheDocument();
  expect(getFormData).not.toHaveBeenCalled();
});
