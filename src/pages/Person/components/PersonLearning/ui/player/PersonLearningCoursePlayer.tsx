import type {
  FC,
  ReactNode,
} from 'react';
import type {
  ILmsLearnerCourse,
  ILmsLearnerCoursePart,
  ILmsLearnerQuestion,
  ILmsLearnerTask,
  ILmsLearnerTest,
  ILmsLearnerTestQuestionResult,
  ILmsLearnerTestResult,
} from '../../../../../../shared/utils/api';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

import Preloader from '../../../../../../shared/components/Preloader/ui/Preloader';
import checkCompleteIcon from '../../../../../../shared/icons/lms/check-complete.svg';
import dragHandleIcon from '../../../../../../shared/icons/lms/drag-handle.svg';
import questionListIcon from '../../../../../../shared/icons/lms/question-list.svg';
import sidebarCollapseIcon from '../../../../../../shared/icons/lms/sidebar-collapse.svg';
import sidebarExpandIcon from '../../../../../../shared/icons/lms/sidebar-expand.svg';
import closeIcon from '../../../../../../shared/icons/buttons/close-color.svg';
import {
  completeMyLmsCoursePart,
  getMyLmsCourse,
  getMyLmsCoursePart,
  getMyLmsCourseTask,
  getMyLmsCourseTest,
  getMyLmsCourseTestResult,
  submitMyLmsCourseTask,
  submitMyLmsCourseTest,
} from '../../../../../../shared/utils/api';
import {
  buildTreeOrder,
  getNextPlayablePart,
  getPartIcon,
} from '../../lib/coursePlayer';
import PersonLearningListenerFileUpload from '../listener/PersonLearningListenerFileUpload';

import './person-learning-course-player.css';

type TQuestionResponse = Record<
  number,
  | null
  | number[]
  | number
  | string
>;

interface IPersonLearningCoursePlayerProps {
  isOpen: boolean;
  partId: number | null;
  onClose: () => void;
  onSelectPart: (partId: number) => void;
}

const renderCoursePlayerPortal = (content: ReactNode) => {
  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(content, document.body);
};

const CoursePlayerCloseButton: FC<{ onClose: () => void }> = ({ onClose }) => (
  <button
    type='button'
    className='course-player__close'
    aria-label='Закрыть'
    title='Закрыть'
    onClick={onClose}
  >
    <img src={closeIcon} alt='' aria-hidden='true' />
  </button>
);

const getCorrectMatchingOrder = (answers: ILmsLearnerQuestion['answers']) =>
  answers
    .slice()
    .sort((a, b) => a.position - b.position)
    .map((answer) => answer.id);

const getShuffledWrongOrder = (question: ILmsLearnerQuestion) => {
  const correctOrder = getCorrectMatchingOrder(question.answers);
  if (correctOrder.length <= 1) {
    return correctOrder;
  }

  let shuffled = [...correctOrder];
  let attempts = 0;

  do {
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    attempts += 1;
    if (attempts > 20) {
      shuffled = [...correctOrder.slice(1), correctOrder[0]];
      break;
    }
  } while (shuffled.every((id, index) => id === correctOrder[index]));

  return shuffled;
};

const getInitialQuestionResponse = (question: ILmsLearnerQuestion) => {
  switch (question.question_type) {
    case 'single':
      return null;
    case 'multiple':
      return [] as number[];
    case 'text':
      return '';
    case 'matching':
      return getShuffledWrongOrder(question);
    case 'ordering':
      return getShuffledWrongOrder(question);
    default:
      return '';
  }
};

const isQuestionAnswered = (
  q: ILmsLearnerQuestion,
  r: TQuestionResponse[number] | undefined,
  touchedQuestionIds: Set<number>
) => {
  if (r === null || r === undefined) return false;
  switch (q.question_type) {
    case 'single':
      return typeof r === 'number' && !Number.isNaN(r);
    case 'multiple':
      return Array.isArray(r) && r.length > 0;
    case 'text':
      return typeof r === 'string' && r.trim().length > 0;
    case 'matching':
      return touchedQuestionIds.has(q.id);
    case 'ordering':
      return touchedQuestionIds.has(q.id);
    default:
      return false;
  }
};

const getNextUnansweredIndex = (
  questions: ILmsLearnerQuestion[],
  currentIndex: number,
  responses: TQuestionResponse,
  touchedQuestionIds: Set<number>
) => {
  for (let offset = 1; offset < questions.length; offset += 1) {
    const index = (currentIndex + offset) % questions.length;
    const question = questions[index];
    if (!isQuestionAnswered(question, responses[question.id], touchedQuestionIds)) {
      return index;
    }
  }
  return null;
};

interface ILessonViewerProps {
  part: ILmsLearnerCoursePart;
  continueLabel: string;
  onContinue: () => void;
  isSubmitting: boolean;
  submitError?: string;
}

const HtmlViewer: FC<ILessonViewerProps> = ({
  part,
  continueLabel,
  onContinue,
  isSubmitting,
  submitError,
}) => (
  <section className='course-player__content-card course-player__content-card_lesson'>
    <div className='course-player__lesson-scroll'>
      <div className='course-player__content-head'>
        <span className='course-player__eyebrow'>Текстовый урок</span>
        <h1 className='course-player__content-title'>{part.name}</h1>
      </div>
      <div
        className='course-player__html'
        dangerouslySetInnerHTML={{
          __html: part.text || '<p>Для этого урока пока не добавлен HTML-контент.</p>',
        }}
      />
      {submitError ? (
        <p className='course-player__error course-player__error_inline'>{submitError}</p>
      ) : null}
    </div>
    <div className='course-player__question-nav course-player__question-nav_fixed course-player__question-nav_single'>
      <button
        type='button'
        className='course-player__primary-btn'
        disabled={isSubmitting}
        onClick={onContinue}
      >
        {continueLabel}
      </button>
    </div>
  </section>
);

const PdfViewer: FC<ILessonViewerProps> = ({
  part,
  continueLabel,
  onContinue,
  isSubmitting,
  submitError,
}) => (
  <section className='course-player__content-card course-player__content-card_lesson'>
    <div className='course-player__lesson-scroll'>
      <div className='course-player__content-head'>
        <span className='course-player__eyebrow'>Слайдер PDF</span>
        <h1 className='course-player__content-title'>{part.name}</h1>
      </div>
      {part.file_url ? (
        <>
          <iframe
            className='course-player__pdf-frame'
            src={part.file_url}
            title={part.name}
          />
          <a
            className='course-player__secondary-link'
            href={part.file_url}
            target='_blank'
            rel='noreferrer'
          >
            Открыть PDF в новой вкладке
          </a>
        </>
      ) : (
        <p className='course-player__empty'>
          Для этого слайдера пока не загружен PDF-файл.
        </p>
      )}
      {submitError ? (
        <p className='course-player__error course-player__error_inline'>{submitError}</p>
      ) : null}
    </div>
    <div className='course-player__question-nav course-player__question-nav_fixed course-player__question-nav_single'>
      <button
        type='button'
        className='course-player__primary-btn'
        disabled={isSubmitting}
        onClick={onContinue}
      >
        {continueLabel}
      </button>
    </div>
  </section>
);

const formatUserResponse = (
  question: ILmsLearnerTestQuestionResult
): string => {
  const value = question.user_response;
  if (value === null || value === undefined) {
    return 'Нет ответа';
  }
  if (question.question_type === 'text') {
    return typeof value === 'string' && value.trim() ? value : 'Нет ответа';
  }
  if (question.question_type === 'single') {
    const answer = question.answers.find((item) => item.id === value);
    return answer?.text || 'Нет ответа';
  }
  if (question.question_type === 'multiple') {
    if (!Array.isArray(value) || value.length === 0) {
      return 'Нет ответа';
    }
    return question.answers
      .filter((item) => value.includes(item.id))
      .map((item) => item.text)
      .join(', ') || 'Нет ответа';
  }
  if (question.question_type === 'matching') {
    if (!Array.isArray(value)) {
      return 'Нет ответа';
    }
    const terms = question.answers
      .slice()
      .sort((a, b) => a.position - b.position);
    return terms
      .map((term, index) => {
        const right = question.answers.find((item) => item.id === value[index]);
        return `${term.text} → ${right?.match_text || '—'}`;
      })
      .join('; ');
  }
  if (question.question_type === 'ordering') {
    if (!Array.isArray(value)) {
      return 'Нет ответа';
    }
    return value
      .map((answerId, index) => {
        const answer = question.answers.find((item) => item.id === answerId);
        return `${index + 1}. ${answer?.text || '—'}`;
      })
      .join('; ');
  }
  return String(value);
};

const TestResultView: FC<{
  result: ILmsLearnerTestResult;
  testName: string;
  onRetry?: () => void;
}> = ({ result, testName, onRetry }) => (
  <section className='course-player__content-card course-player__content-card_test'>
    <div className='course-player__test-scroll'>
      <div className='course-player__content-head course-player__content-head_compact'>
        <span className='course-player__eyebrow'>Тест</span>
        <h1 className='course-player__content-title course-player__content-title_compact'>
          {testName}
        </h1>
      </div>
      <div
        className={`course-player__test-result${
          result.is_passed
            ? ' course-player__test-result_passed'
            : ' course-player__test-result_failed'
        }`}
      >
        <div className='course-player__test-result-summary'>
          <strong>
            {result.is_passed ? 'Тест пройден' : 'Тест не пройден'}
          </strong>
          <span>
            Балл: {result.score ?? 0}% / порог: {result.pass_score ?? '—'}%
          </span>
          <span>
            Попытка: {result.attempt}
            {result.max_attempts ? ` / ${result.max_attempts}` : ''}
          </span>
          {!result.is_passed && !result.can_retry ? (
            <span>Лимит попыток исчерпан</span>
          ) : null}
        </div>
        <ul className='course-player__test-result-list'>
          {result.questions.map((question, index) => (
            <li
              key={question.id}
              className={`course-player__question-result${
                question.is_correct
                  ? ' course-player__question-result_correct'
                  : ' course-player__question-result_incorrect'
              }`}
            >
              <div className='course-player__question-result-head'>
                <span>
                  {question.is_correct ? '✓' : '✗'} Вопрос {index + 1}
                </span>
                <span>
                  {question.is_correct ? 'Правильно' : 'Неправильно'}
                </span>
              </div>
              <p className='course-player__question-result-text'>{question.text}</p>
              <p className='course-player__question-result-answer'>
                Ваш ответ: {formatUserResponse(question)}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
    {result.can_retry && onRetry ? (
      <div className='course-player__question-nav course-player__question-nav_fixed course-player__question-nav_single'>
        <button
          type='button'
          className='course-player__primary-btn'
          onClick={onRetry}
        >
          Повторить попытку
        </button>
      </div>
    ) : null}
  </section>
);

const TestViewer: FC<{
  partId: number;
  test: ILmsLearnerTest;
  onPassed: () => void;
}> = ({ partId, test, onPassed }) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<TQuestionResponse>({});
  const [touchedQuestionIds, setTouchedQuestionIds] = useState<Set<number>>(
    () => new Set()
  );
  const [isQuestionNavOpen, setIsQuestionNavOpen] = useState(false);
  const [result, setResult] = useState<ILmsLearnerTestResult | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [attemptKey, setAttemptKey] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsBootstrapping(false);
      return;
    }

    setIsBootstrapping(true);
    getMyLmsCourseTestResult(token, partId)
      .then((existing) => {
        if (existing?.is_passed || (existing && !existing.can_retry)) {
          setResult(existing);
        } else {
          setResult(null);
        }
      })
      .catch(() => setResult(null))
      .finally(() => setIsBootstrapping(false));
  }, [partId, attemptKey]);

  useEffect(() => {
    setQuestionIndex(0);
    setTouchedQuestionIds(new Set());
    setIsQuestionNavOpen(false);
    setSubmitError('');
    setResponses(
      test.questions.reduce<TQuestionResponse>((acc, question) => {
        acc[question.id] = getInitialQuestionResponse(question);
        return acc;
      }, {})
    );
  }, [test, attemptKey]);

  const resetAttempt = () => {
    setResult(null);
    setAttemptKey((prev) => prev + 1);
  };

  const question = test.questions[questionIndex];

  const answeredCount = useMemo(() => {
    let count = 0;
    test.questions.forEach((q) => {
      const r = responses[q.id];
      if (isQuestionAnswered(q, r, touchedQuestionIds)) count += 1;
    });
    return count;
  }, [responses, test, touchedQuestionIds]);

  const allAnswered = answeredCount === test.questions.length;

  const nextUnansweredIndex = useMemo(
    () => getNextUnansweredIndex(
      test.questions,
      questionIndex,
      responses,
      touchedQuestionIds
    ),
    [test.questions, questionIndex, responses, touchedQuestionIds]
  );

  if (isBootstrapping) {
    return <Preloader />;
  }

  if (result) {
    return (
      <TestResultView
        result={result}
        testName={test.name}
        onRetry={result.can_retry ? resetAttempt : undefined}
      />
    );
  }

  if (test.attempts_used >= test.max_attempts) {
    return (
      <section className='course-player__content-card'>
        <div className='course-player__content-head'>
          <span className='course-player__eyebrow'>Тест</span>
          <h1 className='course-player__content-title'>{test.name}</h1>
        </div>
        <p className='course-player__empty'>
          Исчерпан лимит попыток ({test.attempts_used} / {test.max_attempts}).
        </p>
      </section>
    );
  }

  if (!question) {
    return (
      <section className='course-player__content-card'>
        <div className='course-player__content-head'>
          <span className='course-player__eyebrow'>Тест</span>
          <h1 className='course-player__content-title'>{test.name}</h1>
        </div>
        <p className='course-player__empty'>В тесте пока нет вопросов.</p>
      </section>
    );
  }

  const response = responses[question.id];

  const setQuestionResponse = (
    value: TQuestionResponse[number]
  ) => {
    setResponses((prev) => ({ ...prev, [question.id]: value }));
  };

  const markQuestionTouched = (questionId: number) => {
    setTouchedQuestionIds((prev) => {
      if (prev.has(questionId)) {
        return prev;
      }
      const next = new Set(prev);
      next.add(questionId);
      return next;
    });
  };

  const handleFinishAttempt = async () => {
    const confirmed = window.confirm(
      'Отправить результаты на проверку и завершить попытку?'
    );
    if (!confirmed) {
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setSubmitError('Требуется авторизация');
      return;
    }

    const answers = Object.fromEntries(
      Object.entries(responses).map(([key, value]) => [String(key), value])
    );

    setIsSubmitting(true);
    setSubmitError('');
    try {
      const submitted = await submitMyLmsCourseTest(token, partId, answers);
      setResult(submitted);
      if (submitted.is_passed) {
        onPassed();
      }
    } catch (error) {
      let message = 'Не удалось отправить результаты теста';
      if (error instanceof Response) {
        try {
          const data = await error.json();
          if (data?.error) {
            message = String(data.error);
          }
        } catch {
          // keep default message
        }
      }
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextQuestion = () => {
    if (allAnswered) {
      void handleFinishAttempt();
      return;
    }
    if (nextUnansweredIndex !== null) {
      setQuestionIndex(nextUnansweredIndex);
    }
  };

  const handleSelectQuestion = (index: number) => {
    setQuestionIndex(index);
    setIsQuestionNavOpen(false);
  };

  const renderAnswers = (): ReactNode => {
    switch (question.question_type) {
      case 'single':
        return (
          <div className='course-player__answers'>
            {question.answers.map((answer) => (
              <label className='course-player__answer' key={answer.id}>
                <input
                  type='radio'
                  name={`single-${question.id}`}
                  checked={response === answer.id}
                  onChange={() => setQuestionResponse(answer.id)}
                />
                <span>{answer.text}</span>
              </label>
            ))}
          </div>
        );
      case 'multiple':
        return (
          <div className='course-player__answers'>
            {question.answers.map((answer) => {
              const selected = Array.isArray(response)
                ? response.includes(answer.id)
                : false;
              return (
                <label className='course-player__answer' key={answer.id}>
                  <input
                    type='checkbox'
                    checked={selected}
                    onChange={() => {
                      const next = Array.isArray(response) ? [...response] : [];
                      if (selected) {
                        setQuestionResponse(next.filter((id) => id !== answer.id));
                      } else {
                        setQuestionResponse([...next, answer.id]);
                      }
                    }}
                  />
                  <span>{answer.text}</span>
                </label>
              );
            })}
          </div>
        );
      case 'text':
        return (
          <textarea
            className='course-player__textarea'
            value={typeof response === 'string' ? response : ''}
            onChange={(event) => setQuestionResponse(event.target.value)}
            placeholder='Введите свой ответ'
          />
        );
      case 'matching':
        return (
          <MatchingDnD
            question={question}
            response={response}
            onChange={(next) => {
              setQuestionResponse(next);
              markQuestionTouched(question.id);
            }}
          />
        );
      case 'ordering':
        return (
          <div className='course-player__ordering'>
            {(() => {
              const correctOrder = getCorrectMatchingOrder(question.answers);
              const currentOrder =
                Array.isArray(response) && response.length === correctOrder.length
                  ? response
                  : correctOrder;

              return currentOrder.map((answerId, index, arr) => {
                const answer = question.answers.find((item) => item.id === answerId);
                if (!answer) return null;
              return (
                  <div className='course-player__ordering-item' key={answer.id}>
                    <span className='course-player__ordering-text'>{answer.text}</span>
                    <div className='course-player__ordering-actions'>
                      <button
                        type='button'
                        className='course-player__ordering-btn'
                        disabled={index === 0}
                        onClick={() => {
                          const next = [...arr];
                          [next[index - 1], next[index]] = [next[index], next[index - 1]];
                          setQuestionResponse(next);
                          markQuestionTouched(question.id);
                        }}
                      >
                        ↑
                      </button>
                      <button
                        type='button'
                        className='course-player__ordering-btn'
                        disabled={index === arr.length - 1}
                        onClick={() => {
                          const next = [...arr];
                          [next[index], next[index + 1]] = [next[index + 1], next[index]];
                          setQuestionResponse(next);
                          markQuestionTouched(question.id);
                        }}
                      >
                        ↓
                      </button>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        );
      default:
        return null;
    }
  };

  const MatchingDnD = ({
    question: matchQuestion,
    response: matchResponse,
    onChange,
  }: {
    question: ILmsLearnerQuestion;
    response: TQuestionResponse[number] | undefined;
    onChange: (next: number[]) => void;
  }) => {
    const correctOrder = getCorrectMatchingOrder(matchQuestion.answers);
    const currentOrder =
      Array.isArray(matchResponse) && matchResponse.length === correctOrder.length
        ? matchResponse
        : correctOrder;

    return (
      <div className='course-player__matching-board'>
        <div className='course-player__matching-hint'>
          Соедините соответствия справа с правильными вариантами
        </div>
        <div className='course-player__matching-grid'>
          {matchQuestion.answers.map((term, index) => {
            const rightAnswerId = currentOrder[index];
            const rightAnswer = matchQuestion.answers.find(
              (answer) => answer.id === rightAnswerId
            );
            if (!rightAnswer) return null;

            return (
              <div className='course-player__matching-row-ui' key={term.id}>
                <div className='course-player__matching-fixed'>
                  <span>{index + 1})</span>
                  <span>{term.text}</span>
                </div>
                <div className='course-player__matching-connector' />
                <div
                  className='course-player__matching-slot'
                  onDragOver={(event) => {
                    event.preventDefault();
                    event.dataTransfer.dropEffect = 'move';
                  }}
                  onDrop={(event) => {
                    event.preventDefault();
                    const dragIndexRaw = event.dataTransfer.getData(
                      'application/x-dnd-match-index'
                    );
                    if (!dragIndexRaw) return;
                    const dragIndex = Number(dragIndexRaw);
                    if (Number.isNaN(dragIndex) || dragIndex === index) return;
                    const next = [...currentOrder];
                    const [moved] = next.splice(dragIndex, 1);
                    next.splice(index, 0, moved);
                    onChange(next);
                  }}
                >
                  <div
                    className='course-player__matching-draggable'
                    draggable
                    onDragStart={(event) => {
                      event.dataTransfer.setData(
                        'application/x-dnd-match-index',
                        String(index)
                      );
                      event.dataTransfer.effectAllowed = 'move';
                    }}
                  >
                    <span className='course-player__matching-draggable-text'>
                      {rightAnswer.match_text}
                    </span>
                    <span
                      className='course-player__matching-drag-handle'
                      aria-hidden='true'
                    >
                      <img src={dragHandleIcon} alt='' />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      <section className='course-player__content-card course-player__content-card_test'>
        <div className='course-player__test-scroll'>
          <div className='course-player__content-head course-player__content-head_compact'>
            <span className='course-player__eyebrow'>Тест</span>
            <h1 className='course-player__content-title course-player__content-title_compact'>
              {test.name}
            </h1>
            <p className='course-player__content-lead course-player__content-lead_compact'>
              Попытка {test.attempts_used + 1} из {test.max_attempts}
            </p>
            {test.description ? (
              <p className='course-player__content-lead course-player__content-lead_compact'>
                {test.description}
              </p>
            ) : null}
          </div>
          {submitError ? (
            <p className='course-player__error course-player__error_inline'>{submitError}</p>
          ) : null}
          <div className='course-player__test-top'>
            <button
              type='button'
              className='course-player__progress-card course-player__progress-card_button'
              aria-label='Открыть навигацию по вопросам'
              title='Все вопросы'
              onClick={() => setIsQuestionNavOpen(true)}
            >
              <img
                className='course-player__progress-card-icon'
                src={questionListIcon}
                alt=''
                aria-hidden='true'
              />
              <span className='course-player__progress-card-label'>
                Вопрос {questionIndex + 1} из {test.questions.length}
              </span>
              <span className='course-player__progress-card-chevron' aria-hidden='true' />
            </button>
            <div className='course-player__progress-card'>
              Порог прохождения: {test.pass_score ?? 'не указан'}%
            </div>
            <div className='course-player__progress-card'>
              Отвечено: {answeredCount} из {test.questions.length}
            </div>
          </div>
          <div className='course-player__question-card course-player__question-card_compact'>
            <h2 className='course-player__question-title course-player__question-title_compact'>
              {question.text}
            </h2>
            {renderAnswers()}
          </div>
        </div>
        <div className='course-player__question-nav course-player__question-nav_fixed'>
          <button
            type='button'
            className='course-player__ghost-btn'
            disabled={questionIndex === 0 || isSubmitting}
            onClick={() => setQuestionIndex((prev) => Math.max(prev - 1, 0))}
          >
            Назад
          </button>
          <button
            type='button'
            className='course-player__primary-btn'
            disabled={
              isSubmitting || (!allAnswered && nextUnansweredIndex === null)
            }
            onClick={handleNextQuestion}
          >
            {allAnswered
              ? isSubmitting
                ? 'Отправка…'
                : 'Завершить попытку'
              : 'Далее'}
          </button>
        </div>
      </section>
      {isQuestionNavOpen ? (
        <div className='course-player__test-nav-modal'>
          <button
            type='button'
            className='course-player__test-nav-backdrop'
            aria-label='Закрыть навигацию по вопросам'
            onClick={() => setIsQuestionNavOpen(false)}
          />
          <div
            className='course-player__test-nav-dialog'
            role='dialog'
            aria-modal='true'
            aria-labelledby='course-player-test-nav-title'
          >
            <div className='course-player__test-nav-head'>
              <h3
                className='course-player__test-nav-title'
                id='course-player-test-nav-title'
              >
                Навигация по вопросам
              </h3>
              <button
                type='button'
                className='course-player__test-nav-close'
                aria-label='Закрыть'
                onClick={() => setIsQuestionNavOpen(false)}
              >
                ×
              </button>
            </div>
            <ul className='course-player__test-nav-list'>
              {test.questions.map((testQuestion, index) => {
                const isAnswered = isQuestionAnswered(
                  testQuestion,
                  responses[testQuestion.id],
                  touchedQuestionIds
                );
                const isCurrent = index === questionIndex;

                return (
                  <li key={testQuestion.id}>
                    <button
                      type='button'
                      className={`course-player__test-nav-item${
                        isCurrent ? ' course-player__test-nav-item_current' : ''
                      }`}
                      onClick={() => handleSelectQuestion(index)}
                    >
                      <span className='course-player__test-nav-index'>
                        {index + 1}
                      </span>
                      <span className='course-player__test-nav-text'>
                        {testQuestion.text}
                      </span>
                      <span
                        className={`course-player__test-nav-status${
                          isAnswered
                            ? ' course-player__test-nav-status_answered'
                            : ' course-player__test-nav-status_unanswered'
                        }`}
                      >
                        {isAnswered ? (
                          <>
                            <img src={checkCompleteIcon} alt='' />
                            Отвечен
                          </>
                        ) : (
                          'Не отвечен'
                        )}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      ) : null}
    </>
  );
};

const TaskViewer: FC<{
  task: ILmsLearnerTask;
  partId: number;
  onTaskUpdated: (task: ILmsLearnerTask) => void;
  onPartCompleted: () => void;
}> = ({ task, partId, onTaskUpdated, onPartCompleted }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [comment, setComment] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const formatDate = (value: string | null) => {
    if (!value) {
      return '—';
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleUpload = (file: File) => {
    setSelectedFile(file);
    setFileName(file.name);
    setUploadError('');
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setUploadError('Выберите файл для отправки.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setUploadError('Требуется авторизация');
      return;
    }

    setIsUploading(true);
    setUploadError('');

    try {
      const updatedTask = await submitMyLmsCourseTask(
        token,
        partId,
        selectedFile,
        comment
      );
      onTaskUpdated(updatedTask);
      setSelectedFile(null);
      setFileName('');
      setComment('');
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : 'Не удалось отправить задание'
      );
    } finally {
      setIsUploading(false);
    }
  };

  const hasAccepted = task.submissions.some(
    (submission) => submission.status === 'accepted'
  );

  useEffect(() => {
    if (hasAccepted) {
      onPartCompleted();
    }
  }, [hasAccepted, onPartCompleted]);

  return (
    <section className='course-player__content-card'>
      <div className='course-player__content-head'>
        <span className='course-player__eyebrow'>Практическое задание</span>
        <h1 className='course-player__content-title'>{task.name}</h1>
      </div>
      <div className='course-player__task-description'>
        {task.description}
        {' '}
        Если файлов несколько, объедините их в один архив (ZIP) перед загрузкой.
      </div>

      {task.can_upload ? (
        <div className='course-player__task-upload'>
          <PersonLearningListenerFileUpload
            label='Файл с решением'
            fileName={fileName}
            onUpload={handleUpload}
            accept='.pdf,.docx,.zip,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/zip'
            isUploading={isUploading}
            disabled={isUploading}
          />
          <label className='course-player__task-comment'>
            <span className='course-player__task-comment-label'>Комментарий</span>
            <textarea
              className='course-player__textarea course-player__task-comment-input'
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder='Необязательный комментарий к работе'
              rows={3}
              disabled={isUploading}
            />
          </label>
          <button
            type='button'
            className='course-player__primary-btn course-player__task-submit-btn'
            onClick={handleSubmit}
            disabled={isUploading || !selectedFile}
          >
            {isUploading ? 'Отправка...' : 'Отправить на проверку'}
          </button>
          {uploadError ? (
            <p className='course-player__task-error'>{uploadError}</p>
          ) : null}
        </div>
      ) : hasAccepted ? (
        <p className='course-player__task-note course-player__task-note_success'>
          Задание принято. Повторная загрузка не требуется.
        </p>
      ) : (
        <p className='course-player__task-note'>
          Работа отправлена и ожидает проверки. Новую версию можно загрузить после
          получения комментария тьютора.
        </p>
      )}

      {task.submissions.length > 0 ? (
        <div className='course-player__task-submissions'>
          <h2 className='course-player__task-submissions-title'>История отправок</h2>
          <div className='course-player__task-submissions-table-wrap'>
            <table className='course-player__task-submissions-table'>
              <thead>
                <tr>
                  <th>Дата</th>
                  <th>Статус</th>
                  <th>Ваш комментарий</th>
                  <th>Комментарий тьютора</th>
                  <th>Файл</th>
                </tr>
              </thead>
              <tbody>
                {task.submissions.map((submission) => (
                  <tr key={submission.id}>
                    <td>{formatDate(submission.submitted_at)}</td>
                    <td>{submission.status_display}</td>
                    <td>{submission.user_comment || '—'}</td>
                    <td>{submission.reviewer_comment || '—'}</td>
                    <td>
                      {submission.file_url ? (
                        <a
                          href={submission.file_url}
                          target='_blank'
                          rel='noreferrer'
                        >
                          Скачать
                        </a>
                      ) : (
                        '—'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </section>
  );
};

const PersonLearningCoursePlayer: FC<IPersonLearningCoursePlayerProps> = ({
  isOpen,
  partId,
  onClose,
  onSelectPart,
}) => {
  const [course, setCourse] = useState<ILmsLearnerCourse | null>(null);
  const [currentPart, setCurrentPart] = useState<ILmsLearnerCoursePart | null>(null);
  const [currentTest, setCurrentTest] = useState<ILmsLearnerTest | null>(null);
  const [currentTask, setCurrentTask] = useState<ILmsLearnerTask | null>(null);
  const [isLoadingCourse, setIsLoadingCourse] = useState(true);
  const [isLoadingPart, setIsLoadingPart] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [error, setError] = useState('');
  const [isCompletingPart, setIsCompletingPart] = useState(false);
  const [completeError, setCompleteError] = useState('');

  const orderedParts = useMemo(
    () => (course?.parts ? buildTreeOrder(course.parts) : []),
    [course]
  );

  const firstPlayablePart = useMemo(
    () => orderedParts.find((part) => part.part_type.code !== 'folder') || null,
    [orderedParts]
  );

  const nextPlayablePart = useMemo(
    () => (partId !== null ? getNextPlayablePart(orderedParts, partId) : null),
    [orderedParts, partId]
  );

  const handleTaskPartCompleted = useCallback(() => {
    if (partId === null) {
      return;
    }
    setCourse((prev) => {
      if (!prev) {
        return prev;
      }
      return {
        ...prev,
        parts: prev.parts.map((part) =>
          part.id === partId
            ? {
                ...part,
                progress_status: 'completed',
                progress_status_display: 'Завершено',
              }
            : part
        ),
      };
    });
    setCurrentPart((prev) =>
      prev
        ? {
            ...prev,
            progress_status: 'completed',
            progress_status_display: 'Завершено',
          }
        : prev
    );
  }, [partId]);

  useEffect(() => {
    setCompleteError('');
  }, [partId]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Требуется авторизация');
      setIsLoadingCourse(false);
      return;
    }

    setIsLoadingCourse(true);
    setError('');
    getMyLmsCourse(token)
      .then((response) => setCourse(response))
      .catch(() => setError('Не удалось загрузить курс для плеера'))
      .finally(() => setIsLoadingCourse(false));
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !course || isLoadingCourse) return;

    if (partId === null && firstPlayablePart) {
      onSelectPart(firstPlayablePart.id);
      return;
    }
  }, [course, partId, firstPlayablePart, isLoadingCourse, isOpen, onSelectPart]);

  useEffect(() => {
    if (!isOpen) return;

    const token = localStorage.getItem('token');
    if (!token || !partId) return;

    setIsLoadingPart(true);
    setCurrentPart(null);
    setCurrentTest(null);
    setCurrentTask(null);
    (async () => {
      try {
        const response = await getMyLmsCoursePart(token, partId);
        setCurrentPart(response);

        if (response.test_id) {
          const test = await getMyLmsCourseTest(token, response.id);
          setCurrentTest(test);
        }

        if (response.task_id) {
          const task = await getMyLmsCourseTask(token, response.id);
          setCurrentTask(task);
        }
      } catch {
        setError('Не удалось загрузить выбранный раздел курса');
      } finally {
        setIsLoadingPart(false);
      }
    })();
  }, [partId, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const handleSelectPart = (part: ILmsLearnerCoursePart) => {
    if (part.part_type.code === 'folder') return;
    onSelectPart(part.id);
  };

  if (!isOpen) {
    return null;
  }

  if (isLoadingCourse) {
    return renderCoursePlayerPortal(
      <div className='course-player-modal'>
        <div className='course-player-modal__dialog course-player-modal__dialog_loading'>
          <CoursePlayerCloseButton onClose={onClose} />
          <Preloader />
        </div>
      </div>
    );
  }

  if (error) {
    return renderCoursePlayerPortal(
      <div className='course-player-modal'>
        <div className='course-player-modal__dialog'>
          <CoursePlayerCloseButton onClose={onClose} />
          <div className='course-player course-player_error'>
            <p className='course-player__error'>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return renderCoursePlayerPortal(
      <div className='course-player-modal'>
        <div className='course-player-modal__dialog'>
          <CoursePlayerCloseButton onClose={onClose} />
          <div className='course-player course-player_error'>
            <p className='course-player__error'>Курс для плеера не найден.</p>
          </div>
        </div>
      </div>
    );
  }

  const handleCompletePart = async () => {
    if (partId === null) {
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setCompleteError('Требуется авторизация');
      return;
    }

    setIsCompletingPart(true);
    setCompleteError('');

    try {
      const updated = await completeMyLmsCoursePart(token, partId);
      setCourse((prev) => {
        if (!prev) {
          return prev;
        }

        return {
          ...prev,
          parts: prev.parts.map((part) =>
            part.id === updated.id
              ? {
                  ...part,
                  progress_status: updated.progress_status,
                  progress_status_display: updated.progress_status_display,
                }
              : part
          ),
        };
      });

      const nextPart = getNextPlayablePart(orderedParts, partId);
      if (nextPart) {
        onSelectPart(nextPart.id);
      }
    } catch {
      setCompleteError('Не удалось сохранить прогресс по уроку');
    } finally {
      setIsCompletingPart(false);
    }
  };

  const content = isLoadingPart || !currentPart
    ? <Preloader />
    : currentPart.part_type.code === 'text'
      ? (
        <HtmlViewer
          part={currentPart}
          continueLabel={nextPlayablePart ? 'Продолжить' : 'Завершить'}
          onContinue={handleCompletePart}
          isSubmitting={isCompletingPart}
          submitError={completeError}
        />
      )
      : currentPart.part_type.code === 'slider'
        ? (
          <PdfViewer
            part={currentPart}
            continueLabel={nextPlayablePart ? 'Продолжить' : 'Завершить'}
            onContinue={handleCompletePart}
            isSubmitting={isCompletingPart}
            submitError={completeError}
          />
        )
        : currentPart.part_type.code === 'test'
          ? currentTest
            ? (
              <TestViewer
                partId={currentPart.id}
                test={currentTest}
                onPassed={() => {
                  setCourse((prev) => {
                    if (!prev || !currentPart) {
                      return prev;
                    }
                    return {
                      ...prev,
                      parts: prev.parts.map((part) =>
                        part.id === currentPart.id
                          ? {
                              ...part,
                              progress_status: 'completed',
                              progress_status_display: 'Завершено',
                            }
                          : part
                      ),
                    };
                  });
                  setCurrentPart((prev) =>
                    prev
                      ? {
                          ...prev,
                          progress_status: 'completed',
                          progress_status_display: 'Завершено',
                        }
                      : prev
                  );
                }}
              />
            )
            : <p className='course-player__empty'>Тест для этого раздела недоступен.</p>
          : currentPart.part_type.code === 'task'
            ? currentTask && partId !== null
              ? (
                <TaskViewer
                  task={currentTask}
                  partId={partId}
                  onTaskUpdated={setCurrentTask}
                  onPartCompleted={handleTaskPartCompleted}
                />
              )
              : (
                <p className='course-player__empty'>
                  Задание для этого раздела недоступно.
                </p>
              )
            : (
              <p className='course-player__empty'>
                Выберите раздел курса в левой структуре.
              </p>
            );

  return renderCoursePlayerPortal(
    <div className='course-player-modal'>
      <div className='course-player-modal__backdrop' onClick={onClose} />
      <div className='course-player-modal__dialog'>
        <CoursePlayerCloseButton onClose={onClose} />
        <div className='course-player'>
          <div className='course-player__header'>
            <h1 className='course-player__title'>{course.name}</h1>
          </div>

          <div
            className={`course-player__layout${isSidebarCollapsed ? ' course-player__layout_full' : ''}`}
          >
            {!isSidebarCollapsed ? (
              <aside className='course-player__sidebar'>
                <div className='course-player__sidebar-head'>
                  <div className='course-player__sidebar-title'>Структура курса</div>
                  <button
                    type='button'
                    className='course-player__sidebar-toggle'
                    aria-label='Скрыть структуру'
                    title='Скрыть структуру'
                    onClick={() => setIsSidebarCollapsed(true)}
                  >
                    <img src={sidebarCollapseIcon} alt='' aria-hidden='true' />
                  </button>
                </div>
                <ul className='course-player__tree'>
                  {orderedParts.map((part) => {
                    const isActive = currentPart?.id === part.id;
                    const isCompleted = part.progress_status === 'completed';
                    const isFolder = part.part_type.code === 'folder';
                    return (
                      <li
                        key={part.id}
                        className={`course-player__tree-item${isActive ? ' course-player__tree-item_active' : ''}${isFolder ? ' course-player__tree-item_folder' : ''}`}
                        style={{ paddingLeft: 14 + part.level * 18 }}
                      >
                        {isFolder ? (
                          <>
                            <div className='course-player__tree-main'>
                              <img
                                className='course-player__tree-icon'
                                src={getPartIcon(part.part_type.code)}
                                alt={part.part_type.name}
                              />
                              <span className='course-player__tree-name'>{part.name}</span>
                            </div>
                            <div className='course-player__tree-flags'>
                              {isCompleted ? (
                                <img
                                  className='course-player__flag-icon'
                                  src={checkCompleteIcon}
                                  alt='Раздел пройден'
                                  title='Раздел пройден'
                                />
                              ) : null}
                            </div>
                          </>
                        ) : (
                          <button
                            type='button'
                            className='course-player__tree-button'
                            onClick={() => handleSelectPart(part)}
                          >
                            <div className='course-player__tree-main'>
                              <img
                                className='course-player__tree-icon'
                                src={getPartIcon(part.part_type.code)}
                                alt={part.part_type.name}
                              />
                              <span className='course-player__tree-name'>{part.name}</span>
                            </div>
                            <div className='course-player__tree-flags'>
                              {part.is_mandatory ? (
                                <span
                                  className='course-player__flag course-player__flag_warning'
                                  title='Обязательный раздел'
                                  aria-label='Обязательный раздел'
                                >
                                  !
                                </span>
                              ) : null}
                              {isCompleted ? (
                                <img
                                  className='course-player__flag-icon'
                                  src={checkCompleteIcon}
                                  alt='Раздел пройден'
                                  title='Раздел пройден'
                                />
                              ) : null}
                            </div>
                          </button>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </aside>
            ) : (
              <button
                type='button'
                className='course-player__sidebar-expand'
                aria-label='Показать структуру'
                title='Показать структуру'
                onClick={() => setIsSidebarCollapsed(false)}
              >
                <img src={sidebarExpandIcon} alt='' aria-hidden='true' />
              </button>
            )}

            <main className='course-player__content'>{content}</main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonLearningCoursePlayer;
