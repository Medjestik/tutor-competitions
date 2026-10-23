import { act } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import * as api from '../../shared/utils/api';
import ExpertForms from './components/ExpertForms/ui/ExpertForms';
import ExpertFormPage from './components/ExpertFormPage/ui/ExpertFormPage';

jest.mock('../../shared/utils/api', () => ({
  getNominationForms: jest.fn(), getExpertForm: jest.fn(), scoreForm: jest.fn(),
}));

const list = api.getNominationForms as jest.Mock;
const detail = api.getExpertForm as jest.Mock;
const score = api.scoreForm as jest.Mock;
const photoOnly = { count: 1, has_video: false, has_presentation: false, has_photo: true, photo_url: 'https://example.com/photo.jpg' };
const row = { id: 7, nomination: 1, name: 'Практика', total_evaluations: 1, is_evaluated: true, second_stage_materials: photoOnly };
const form = {
  ...row, resources: [], schema: [], nomination_name: 'Номинация',
  evaluation_details: [{ criteria_id: 1, criteria_name: 'Критерий', indicators: [
    { id: 3, name: 'Индикатор', score: 1, comment: 'Сохранённый комментарий', position: 1 },
  ] }],
};

function Location() {
  const location = useLocation();
  return <output data-testid='location'>{location.pathname}{location.search}</output>;
}

function setup(path = '/person/nomination/1') {
  return render(<MemoryRouter initialEntries={[path]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <Location />
    <Routes>
      <Route path='/person/nomination/:nominationId' element={<ExpertForms />} />
      <Route path='/person/nomination/:nominationId/form/:formId' element={<ExpertFormPage />} />
    </Routes>
  </MemoryRouter>);
}

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.setItem('token', 'token');
  list.mockResolvedValue([row]);
  detail.mockResolvedValue(form);
  score.mockResolvedValue(form.evaluation_details);
});

test('defaults to semifinal and shows partial materials on rows and detail', async () => {
  setup();
  expect(await screen.findByText('Практика')).toBeVisible();
  expect(screen.getByLabelText('Этап')).toHaveValue('semifinal');
  expect(list).toHaveBeenLastCalledWith('token', '1', 'semifinal');
  expect(screen.getByText('Материалы: 1/3 · Фото')).toBeVisible();
  fireEvent.click(screen.getByText('Практика'));
  expect(await screen.findByRole('region', { name: 'Материалы полуфинала' })).toBeVisible();
  expect(detail).toHaveBeenLastCalledWith('token', '7', 'semifinal');
  expect(screen.getAllByText(/Не загружено/)).toHaveLength(2);
  expect(screen.getByRole('link', { name: 'Открыть фото' })).toHaveAttribute('href', photoOnly.photo_url);
  fireEvent.click(screen.getByText('Вернуться к списку'));
  expect(await screen.findByLabelText('Этап')).toHaveValue('semifinal');
});

test('qualifying selection survives card and return navigation', async () => {
  setup();
  await screen.findByText('Практика');
  fireEvent.change(screen.getByLabelText('Этап'), { target: { value: 'qualifying' } });
  await waitFor(() => expect(list).toHaveBeenLastCalledWith('token', '1', 'qualifying'));
  fireEvent.click(await screen.findByText('Практика'));
  await waitFor(() => expect(detail).toHaveBeenLastCalledWith('token', '7', 'qualifying'));
  expect(await screen.findByText(/Отборочный · Оценка общая/)).toBeVisible();
  expect(screen.queryByRole('region', { name: 'Материалы полуфинала' })).not.toBeInTheDocument();
  fireEvent.click(screen.getByText('Вернуться к списку'));
  expect(await screen.findByLabelText('Этап')).toHaveValue('qualifying');
});

test('uses existing scores and comments and saves to the selected stage', async () => {
  setup('/person/nomination/1/form/7?stage=semifinal');
  fireEvent.click(await screen.findByText('Оценить анкету'));
  expect(screen.getByText('1', { selector: 'button' })).toHaveClass('selected');
  fireEvent.click(screen.getByText('2', { selector: 'button' }));
  fireEvent.click(screen.getByText('Сохранить'));
  await waitFor(() => expect(score).toHaveBeenCalledWith('token', [
    { participant_form: 7, indicator: 3, score: 2, comment: 'Сохранённый комментарий' },
  ], 'semifinal'));
});

test('does not let an obsolete list response replace the selected stage', async () => {
  let resolveOld!: (rows: unknown[]) => void;
  list.mockImplementationOnce(() => new Promise((resolve) => { resolveOld = resolve; }));
  list.mockResolvedValueOnce([{ ...row, name: 'Отборочная практика' }]);
  setup();
  fireEvent.change(screen.getByLabelText('Этап'), { target: { value: 'qualifying' } });
  await screen.findByText('Отборочная практика');
  await act(async () => { resolveOld([{ ...row, name: 'Устаревшая практика' }]); });
  expect(screen.queryByText('Устаревшая практика')).not.toBeInTheDocument();
  expect(screen.getByText('Отборочная практика')).toBeVisible();
});

test('empty and failed lists retain the stage filter', async () => {
  list.mockResolvedValueOnce([]);
  list.mockRejectedValueOnce(new Error('network'));
  setup();
  expect(await screen.findByText('Список анкет пуст.')).toBeVisible();
  fireEvent.change(screen.getByLabelText('Этап'), { target: { value: 'qualifying' } });
  expect(await screen.findByRole('alert')).toHaveTextContent('Не удалось загрузить практики');
  expect(screen.getByLabelText('Этап')).toHaveValue('qualifying');
});

test('detail errors offer return navigation and score errors stay visible in popup', async () => {
  score.mockRejectedValueOnce(new Error('network'));
  setup('/person/nomination/1/form/7?stage=qualifying');
  fireEvent.click(await screen.findByText('Оценить анкету'));
  fireEvent.click(screen.getByText('Сохранить'));
  expect(await screen.findByRole('alert')).toHaveTextContent('Не удалось сохранить оценку');
  fireEvent.click(screen.getByText('Отменить'));
  fireEvent.click(screen.getByText('Вернуться к списку'));
  detail.mockRejectedValueOnce(new Error('not found'));
  fireEvent.click(await screen.findByText('Практика'));
  expect(await screen.findByRole('alert')).toHaveTextContent('Практика недоступна');
  fireEvent.click(screen.getByText('Вернуться к списку'));
  expect(await screen.findByLabelText('Этап')).toHaveValue('qualifying');
  await screen.findByText('Практика');
});

test('full kit exposes video and presentation file links', async () => {
  detail.mockResolvedValueOnce({ ...form, second_stage_materials: {
    ...photoOnly, count: 3, has_video: true, has_presentation: true,
    practice_video_url: 'https://example.com/video', presentation_file_url: 'https://example.com/slides.pptx',
  } });
  setup('/person/nomination/1/form/7');
  expect(await screen.findByText('Материалы: 3/3')).toBeVisible();
  expect(screen.getByRole('link', { name: 'Открыть видео' })).toHaveAttribute('href', 'https://example.com/video');
  expect(screen.getByRole('link', { name: 'Открыть файл' })).toHaveAttribute('href', 'https://example.com/slides.pptx');
});
