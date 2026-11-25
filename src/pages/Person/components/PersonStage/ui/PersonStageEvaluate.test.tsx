import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import PersonStageEvaluate from './PersonStageEvaluate';

jest.mock('../../../../../store/store', () => ({
  useSelector: (selector: (state: unknown) => unknown) => selector({ user: { user: { passed_final: true } } }),
}));

beforeEach(() => { localStorage.setItem('token', 'test'); });
afterEach(() => { jest.restoreAllMocks(); });

test('does not request or display awards before publication', () => {
  const fetchMock = jest.spyOn(global, 'fetch');
  render(<PersonStageEvaluate isPublished={false} maxChatLink='' />);
  expect(screen.getByText('Результаты ещё не опубликованы')).toBeInTheDocument();
  expect(fetchMock).not.toHaveBeenCalled();
});

test('shows saved coauthors and sends edited names for separate diplomas', async () => {
  const fetchMock = jest.spyOn(global, 'fetch')
    .mockResolvedValueOnce({ ok: true, json: async () => ({ award: 'prizewinner', coauthors: ['Первый соавтор'] }) } as Response)
    .mockResolvedValueOnce({ ok: true, blob: async () => new Blob(['zip']) } as Response);
  Object.defineProperty(URL, 'createObjectURL', { configurable: true, value: jest.fn(() => 'blob:test') });
  Object.defineProperty(URL, 'revokeObjectURL', { configurable: true, value: jest.fn() });
  jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
  render(<PersonStageEvaluate isPublished maxChatLink='' />);
  expect(await screen.findByText(/Вы призёр/)).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('ФИО соавтора 2'), { target: { value: 'Второй соавтор' } });
  fireEvent.click(screen.getByRole('button', { name: 'Скачать дипломы' }));
  await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
  expect(JSON.parse(fetchMock.mock.calls[1][1]?.body as string)).toEqual({ coauthors: ['Первый соавтор', 'Второй соавтор'] });
  await waitFor(() => expect(screen.getByRole('button', { name: 'Скачать дипломы' })).not.toBeDisabled());
});

test('retries loading the result after a network failure', async () => {
  const fetchMock = jest.spyOn(global, 'fetch')
    .mockRejectedValueOnce(new Error('offline'))
    .mockResolvedValueOnce({ ok: true, json: async () => ({ award: 'winner', coauthors: [] }) } as Response);
  render(<PersonStageEvaluate isPublished maxChatLink='' />);
  expect(await screen.findByRole('alert')).toHaveTextContent('Не удалось загрузить');
  fireEvent.click(screen.getByRole('button', { name: 'Попробовать снова' }));
  expect(await screen.findByText(/Вы победитель/)).toBeInTheDocument();
  expect(fetchMock).toHaveBeenCalledTimes(2);
});
