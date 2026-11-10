import { render, screen } from '@testing-library/react';
import PersonLearningMaterials from './PersonLearningMaterials';
import PersonLearningResults from './PersonLearningResults';
import { getMyLmsMaterials, getMyLearningOutcome } from '../../../../../shared/utils/api';

jest.mock('react-router-dom', () => ({ Link: ({ children }: any) => <span>{children}</span> }));
jest.mock('./player/PersonLearningCoursePlayer', () => () => null);
jest.mock('../../../../../shared/utils/api', () => ({ getMyLmsMaterials: jest.fn(), getMyLearningOutcome: jest.fn() }));

test('shows opening date before a stream begins', async () => {
  localStorage.setItem('token', 'learner');
  (getMyLmsMaterials as jest.Mock).mockResolvedValue({ access: 'stream_not_started', message: 'Обучение начнётся 01.12.2026.', resultsAvailable: false });
  render(<PersonLearningMaterials />);
  expect(await screen.findByText('Обучение начнётся 01.12.2026.')).toBeInTheDocument();
  expect(screen.queryByText('Перейти к итогам обучения')).not.toBeInTheDocument();
});

test('shows waiting outcome after stream ends', async () => {
  localStorage.setItem('token', 'learner');
  (getMyLearningOutcome as jest.Mock).mockResolvedValue({ resultsAvailable: true, coursePlayable: false, outcome: null });
  render(<PersonLearningResults />);
  expect(await screen.findByText(/Оргкомитет формирует итоги обучения/)).toBeInTheDocument();
});
