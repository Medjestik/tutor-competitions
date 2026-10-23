import { act } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as api from '../../../../../shared/utils/api';
import PersonStageSlides from './PersonStageSlides';

let mockEligible = true;
jest.mock('../../../../../store/store', () => ({
  useSelector: (selector: (state: unknown) => unknown) => selector({ user: { user: { passed_second_stage: mockEligible } } }),
}));
jest.mock('../../../../../shared/utils/api', () => ({
  getSecondStageMaterials: jest.fn(), patchSecondStageMaterials: jest.fn(),
}));

const get = api.getSecondStageMaterials as jest.Mock;
const patch = api.patchSecondStageMaterials as jest.Mock;
const closed = {
  is_open: false, has_materials: false, practice_video_url: '',
  presentation_url: '', presentation_file_url: null, photo_url: null,
};

beforeEach(() => {
  jest.clearAllMocks();
  mockEligible = true;
  localStorage.setItem('token', 'token');
  get.mockResolvedValue(closed);
});

test('no materials shows missed message and course link in same tab', async () => {
  render(<PersonStageSlides isEducationEnabled />);
  expect(await screen.findByText('Вы не успели, но можете пройти курс')).toBeVisible();
  const link = screen.getByRole('link', { name: 'Перейти к обучению' });
  expect(link).toHaveAttribute('href', '/person/learning/program');
  expect(link).not.toHaveAttribute('target');
  expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  expect(screen.queryByText('Добавить файл')).not.toBeInTheDocument();
});

test('photo-only submission waits for results without course or upload controls', async () => {
  get.mockResolvedValue({ ...closed, has_materials: true, photo_url: 'https://example.com/photo.jpg' });
  render(<PersonStageSlides isEducationEnabled />);
  expect(await screen.findByText('Ждите итогов')).toBeVisible();
  expect(screen.queryByRole('link', { name: 'Перейти к обучению' })).not.toBeInTheDocument();
  expect(screen.queryByText('Добавить фото')).not.toBeInTheDocument();
});

test('disabled education hides course action', async () => {
  render(<PersonStageSlides />);
  await screen.findByText('Вы не успели, но можете пройти курс');
  expect(screen.queryByRole('link')).not.toBeInTheDocument();
});

test('ineligible participants stay blocked without closed messages or requests', () => {
  mockEligible = false;
  render(<PersonStageSlides isEducationEnabled />);
  expect(screen.getByText('Этот этап вам недоступен')).toBeVisible();
  expect(screen.queryByText('Вы не успели, но можете пройти курс')).not.toBeInTheDocument();
  expect(get).not.toHaveBeenCalled();
});

test('pending request never displays a missed conclusion or upload controls', async () => {
  let resolveState!: (data: typeof closed) => void;
  get.mockReturnValueOnce(new Promise((resolve) => { resolveState = resolve; }));
  render(<PersonStageSlides />);
  expect(screen.queryByText('Вы не успели, но можете пройти курс')).not.toBeInTheDocument();
  expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  await act(async () => { resolveState(closed); });
  expect(await screen.findByText('Вы не успели, но можете пройти курс')).toBeVisible();
});

test('failed state request offers retry instead of claiming no submission', async () => {
  const log = jest.spyOn(console, 'error').mockImplementation(() => {});
  get.mockRejectedValueOnce(new Error('network'));
  render(<PersonStageSlides />);
  expect(await screen.findByRole('alert')).toHaveTextContent('Не удалось загрузить состояние');
  expect(screen.queryByText('Вы не успели, но можете пройти курс')).not.toBeInTheDocument();
  fireEvent.click(screen.getByText('Повторить'));
  expect(await screen.findByText('Вы не успели, но можете пройти курс')).toBeVisible();
  log.mockRestore();
});

test('open stage permits saving and closure response replaces a stale upload form', async () => {
  get.mockResolvedValueOnce({ ...closed, is_open: true });
  patch.mockRejectedValueOnce({ json: async () => ({ code: 'second_stage_closed' }) });
  const onStateChange = jest.fn();
  render(<PersonStageSlides onStateChange={onStateChange} />);
  const input = await screen.findByLabelText('Ссылка на видеопредставление практики');
  fireEvent.change(input, { target: { value: 'https://example.com/video' } });
  fireEvent.click(screen.getByText('Сохранить ссылку'));
  await waitFor(() => expect(patch).toHaveBeenCalledWith('token', expect.any(FormData)));
  expect(await screen.findByText('Вы не успели, но можете пройти курс')).toBeVisible();
  expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  expect(onStateChange).toHaveBeenLastCalledWith(closed);
});
