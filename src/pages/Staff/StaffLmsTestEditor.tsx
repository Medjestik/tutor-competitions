import type { FC } from 'react';
import type { ILmsAnswer, ILmsQuestion, ILmsTestDetail } from '../../shared/utils/api';

import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import MainLayout from '../../shared/components/Layout/ui/MainLayout';
import Preloader from '../../shared/components/Preloader/ui/Preloader';
import Button from '../../shared/components/Button/ui/Button';
import { getLmsTest, updateLmsTest } from '../../shared/utils/api';
import { EROUTES } from '../../shared/utils/ERoutes';

import './staff-lms.css';

interface IStaffLmsTestEditorProps {
  windowWidth: number;
  onLogout: () => void;
}

type TQuestionType = ILmsQuestion['question_type'];

const QUESTION_TYPE_OPTIONS: { value: TQuestionType; label: string }[] = [
  { value: 'single', label: 'Одиночный выбор' },
  { value: 'multiple', label: 'Множественный выбор' },
  { value: 'text', label: 'Открытый текст' },
  { value: 'matching', label: 'Соответствие' },
  { value: 'ordering', label: 'Упорядочивание' },
];

const emptyAnswer = (position = 0): ILmsAnswer => ({
  text: '',
  is_correct: false,
  match_text: '',
  position,
});

const emptyQuestion = (position = 0): ILmsQuestion => ({
  text: '',
  question_type: 'single',
  position,
  answers: [emptyAnswer(0), emptyAnswer(1)],
});

const StaffLmsTestEditor: FC<IStaffLmsTestEditorProps> = ({
  windowWidth,
  onLogout,
}) => {
  const { id } = useParams();
  const testId = Number(id);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [passScore, setPassScore] = useState<number | ''>(70);
  const [questions, setQuestions] = useState<ILmsQuestion[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !testId) {
      setError('Требуется авторизация');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    getLmsTest(token, testId)
      .then((test: ILmsTestDetail) => {
        setName(test.name);
        setDescription(test.description || '');
        setPassScore(test.pass_score ?? '');
        setQuestions(
          test.questions.length
            ? test.questions.map((question) => ({
                ...question,
                answers: question.answers || [],
              }))
            : []
        );
      })
      .catch(() => setError('Не удалось загрузить тест'))
      .finally(() => setIsLoading(false));
  }, [testId]);

  const updateQuestion = (index: number, patch: Partial<ILmsQuestion>) => {
    setQuestions((prev) =>
      prev.map((question, questionIndex) =>
        questionIndex === index ? { ...question, ...patch } : question
      )
    );
  };

  const updateAnswer = (
    questionIndex: number,
    answerIndex: number,
    patch: Partial<ILmsAnswer>
  ) => {
    setQuestions((prev) =>
      prev.map((question, qIndex) => {
        if (qIndex !== questionIndex) return question;
        return {
          ...question,
          answers: question.answers.map((answer, aIndex) =>
            aIndex === answerIndex ? { ...answer, ...patch } : answer
          ),
        };
      })
    );
  };

  const moveQuestion = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= questions.length) return;
    setQuestions((prev) => {
      const next = [...prev];
      const [item] = next.splice(index, 1);
      next.splice(target, 0, item);
      return next.map((question, position) => ({ ...question, position }));
    });
  };

  const moveAnswer = (
    questionIndex: number,
    answerIndex: number,
    direction: -1 | 1
  ) => {
    setQuestions((prev) =>
      prev.map((question, qIndex) => {
        if (qIndex !== questionIndex) return question;
        const target = answerIndex + direction;
        if (target < 0 || target >= question.answers.length) return question;
        const answers = [...question.answers];
        const [item] = answers.splice(answerIndex, 1);
        answers.splice(target, 0, item);
        return {
          ...question,
          answers: answers.map((answer, position) => ({ ...answer, position })),
        };
      })
    );
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    setIsSaving(true);
    setError('');
    setMessage('');
    try {
      const payload = {
        name,
        description,
        pass_score: passScore === '' ? null : Number(passScore),
        questions: questions.map((question, position) => ({
          id: question.id || undefined,
          text: question.text,
          question_type: question.question_type,
          position,
          answers:
            question.question_type === 'text'
              ? []
              : question.answers.map((answer, answerPosition) => ({
                  id: answer.id || undefined,
                  text: answer.text,
                  is_correct: answer.is_correct,
                  match_text: answer.match_text || '',
                  position: answerPosition,
                })),
        })),
      };
      const saved = await updateLmsTest(token, testId, payload);
      setQuestions(
        saved.questions.map((question) => ({
          ...question,
          answers: question.answers || [],
        }))
      );
      setMessage('Тест сохранён');
    } catch {
      setError('Не удалось сохранить тест');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <MainLayout
      mainContainer={false}
      transparentMain
      windowWidth={windowWidth}
      isLoggedIn
      onLogout={onLogout}
    >
      <div className='staff-lms'>
        <div className='staff-lms__card'>
          <div className='staff-lms__breadcrumb'>
            <Link to={EROUTES.STAFF_LMS}>Конструктор LMS</Link>
            {' / '}
            <Link to={EROUTES.STAFF_LMS_TESTS}>Тесты</Link>
            {' / Редактор'}
          </div>

          {isLoading ? (
            <Preloader />
          ) : (
            <>
              <div className='staff-lms__header'>
                <h1 className='staff-lms__title'>Редактор теста</h1>
                <Button
                  text={isSaving ? 'Сохранение…' : 'Сохранить'}
                  type='button'
                  color='primary'
                  onClick={handleSave}
                  disabled={isSaving}
                />
              </div>

              <div className='staff-lms__form' style={{ marginBottom: 24 }}>
                <div className='staff-lms__field'>
                  <label className='staff-lms__label'>Название</label>
                  <input
                    className='staff-lms__input'
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                  />
                </div>
                <div className='staff-lms__field'>
                  <label className='staff-lms__label'>Описание</label>
                  <textarea
                    className='staff-lms__textarea'
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                  />
                </div>
                <div className='staff-lms__field'>
                  <label className='staff-lms__label'>Порог прохождения (%)</label>
                  <input
                    className='staff-lms__input'
                    type='number'
                    min={0}
                    max={100}
                    value={passScore}
                    onChange={(event) =>
                      setPassScore(
                        event.target.value === ''
                          ? ''
                          : Number(event.target.value)
                      )
                    }
                  />
                </div>
              </div>

              <div className='staff-lms__btn-row' style={{ marginBottom: 16 }}>
                <button
                  type='button'
                  className='staff-lms__ghost-btn'
                  onClick={() =>
                    setQuestions((prev) => [...prev, emptyQuestion(prev.length)])
                  }
                >
                  + Вопрос
                </button>
              </div>

              {questions.map((question, questionIndex) => (
                <div className='staff-lms__question' key={question.id ?? `q-${questionIndex}`}>
                  <div className='staff-lms__question-header'>
                    <strong>Вопрос {questionIndex + 1}</strong>
                    <select
                      className='staff-lms__select'
                      style={{ maxWidth: 240 }}
                      value={question.question_type}
                      onChange={(event) => {
                        const questionType = event.target.value as TQuestionType;
                        updateQuestion(questionIndex, {
                          question_type: questionType,
                          answers:
                            questionType === 'text'
                              ? []
                              : question.answers.length
                                ? question.answers
                                : [emptyAnswer(0)],
                        });
                      }}
                    >
                      {QUESTION_TYPE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <button
                      type='button'
                      className='staff-lms__ghost-btn'
                      onClick={() => moveQuestion(questionIndex, -1)}
                    >
                      ↑
                    </button>
                    <button
                      type='button'
                      className='staff-lms__ghost-btn'
                      onClick={() => moveQuestion(questionIndex, 1)}
                    >
                      ↓
                    </button>
                    <button
                      type='button'
                      className='staff-lms__ghost-btn staff-lms__danger'
                      onClick={() =>
                        setQuestions((prev) =>
                          prev.filter((_, index) => index !== questionIndex)
                        )
                      }
                    >
                      Удалить
                    </button>
                  </div>

                  <div className='staff-lms__field'>
                    <label className='staff-lms__label'>Текст вопроса</label>
                    <textarea
                      className='staff-lms__textarea'
                      value={question.text}
                      onChange={(event) =>
                        updateQuestion(questionIndex, { text: event.target.value })
                      }
                    />
                  </div>

                  {question.question_type === 'text' ? (
                    <p className='staff-lms__empty'>
                      Открытый ответ проверяется вручную — варианты не нужны.
                    </p>
                  ) : (
                    <div className='staff-lms__answers'>
                      {question.answers.map((answer, answerIndex) => (
                        <div
                          className='staff-lms__answer-row'
                          key={answer.id ?? `a-${questionIndex}-${answerIndex}`}
                        >
                          <input
                            className='staff-lms__input'
                            placeholder={
                              question.question_type === 'matching'
                                ? 'Левая часть'
                                : 'Вариант / элемент'
                            }
                            value={answer.text}
                            onChange={(event) =>
                              updateAnswer(questionIndex, answerIndex, {
                                text: event.target.value,
                              })
                            }
                          />
                          {question.question_type === 'matching' ? (
                            <input
                              className='staff-lms__input'
                              placeholder='Правая часть'
                              value={answer.match_text}
                              onChange={(event) =>
                                updateAnswer(questionIndex, answerIndex, {
                                  match_text: event.target.value,
                                })
                              }
                            />
                          ) : question.question_type === 'ordering' ? (
                            <span className='staff-lms__empty'>
                              Порядок: {answerIndex + 1}
                            </span>
                          ) : (
                            <label className='staff-lms__checkbox'>
                              <input
                                type='checkbox'
                                checked={answer.is_correct}
                                onChange={(event) =>
                                  updateAnswer(questionIndex, answerIndex, {
                                    is_correct: event.target.checked,
                                  })
                                }
                              />
                              Верный
                            </label>
                          )}
                          <button
                            type='button'
                            className='staff-lms__ghost-btn'
                            onClick={() =>
                              moveAnswer(questionIndex, answerIndex, -1)
                            }
                          >
                            ↑
                          </button>
                          <button
                            type='button'
                            className='staff-lms__ghost-btn'
                            onClick={() =>
                              moveAnswer(questionIndex, answerIndex, 1)
                            }
                          >
                            ↓
                          </button>
                          <button
                            type='button'
                            className='staff-lms__ghost-btn staff-lms__danger'
                            onClick={() =>
                              updateQuestion(questionIndex, {
                                answers: question.answers.filter(
                                  (_, index) => index !== answerIndex
                                ),
                              })
                            }
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                      <button
                        type='button'
                        className='staff-lms__ghost-btn'
                        onClick={() =>
                          updateQuestion(questionIndex, {
                            answers: [
                              ...question.answers,
                              emptyAnswer(question.answers.length),
                            ],
                          })
                        }
                      >
                        + Вариант
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {message && <p className='staff-lms__success'>{message}</p>}
              {error && <p className='staff-lms__error'>{error}</p>}
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default StaffLmsTestEditor;
