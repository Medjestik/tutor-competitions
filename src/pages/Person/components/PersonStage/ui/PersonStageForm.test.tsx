import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PersonStageForm from './PersonStageForm';
import * as api from '../../../../../shared/utils/api';

jest.mock('../../../../../shared/utils/api', () => ({ getNominations: jest.fn(), getFormData: jest.fn() }));

beforeEach(() => {
  localStorage.setItem('token', 'test');
  (api.getNominations as jest.Mock).mockResolvedValue([]);
});

test.each([true, false])('closed submitted form and education enabled=%s', async (enabled) => {
  (api.getFormData as jest.Mock).mockResolvedValue({ status: 'submitted' });
  render(<MemoryRouter><PersonStageForm onNextStage={jest.fn()} isPracticeFormOpen={false} isEducationEnabled={enabled} /></MemoryRouter>);
  expect(await screen.findByText(/Анкета вашей практики успешно отправлена/)).toBeInTheDocument();
  const link = screen.queryByRole('link', { name: 'Перейти к обучению' });
  if (enabled) {
    expect(link).toHaveAttribute('href', '/person/learning/program');
    expect(link).not.toHaveAttribute('target');
  } else expect(link).not.toBeInTheDocument();
});

test('closed draft retains missed message', async () => {
  (api.getFormData as jest.Mock).mockResolvedValue({ status: 'draft' });
  render(<MemoryRouter><PersonStageForm onNextStage={jest.fn()} isPracticeFormOpen={false} /></MemoryRouter>);
  expect(await screen.findByText(/вы не успели подать анкету/)).toBeInTheDocument();
});

test('open submitted form retains confirmation', async () => {
  (api.getFormData as jest.Mock).mockResolvedValue({ status: 'submitted' });
  render(<MemoryRouter><PersonStageForm onNextStage={jest.fn()} isPracticeFormOpen /></MemoryRouter>);
  expect(await screen.findByText(/Спасибо! Анкета практики успешно отправлена/)).toBeInTheDocument();
});
