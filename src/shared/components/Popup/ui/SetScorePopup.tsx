import { useEffect, useMemo, useState, type FC, type FormEvent } from 'react';
import type { ISetScorePopupProps } from '../interface/interface';

import Popup from './Popup';
import Button from '../../Button/ui/Button';
import { Form } from '../../Form/ui/Form';
import { FormField } from '../../Form/components/FormField/form-field';
import { FormButtons } from '../../Form/components/FormButtons/form-buttons';

import '../styles/style.css';
import '../styles/score-popup.css';

const btnStyle = {
  width: '100%',
  borderRadius: '12px',
  height: '40px',
  fontSize: '20px',
  lineHeight: '1',
};

/** Rubric text under the criteria title — drop duplicated first line. */
const getIndicatorRubric = (
  indicatorName: string,
  criteriaName: string,
): string => {
  const trimmed = indicatorName.trim();
  const lines = trimmed.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (lines.length > 1 && lines[0] === criteriaName.trim()) {
    return lines.slice(1).join('\n');
  }
  if (trimmed.startsWith(criteriaName.trim())) {
    return trimmed.slice(criteriaName.trim().length).replace(/^[\s.:—-]+/, '').trim();
  }
  return trimmed;
};

const SetScorePopup: FC<ISetScorePopupProps> = ({
  isOpen,
  onClose,
  form,
  isLoading,
  onScore,
}) => {
  const [scores, setScores] = useState<Record<number, number | null>>({});

  const indicatorsCount = useMemo(() => {
    if (!form.evaluation_details) return 0;
    return form.evaluation_details.reduce(
      (sum, criteria) => sum + criteria.indicators.length,
      0,
    );
  }, [form.evaluation_details]);

  const hasIndicators = indicatorsCount > 0;

  const calculateTotalScore = () => {
    return Object.values(scores)
      .filter((v): v is number => typeof v === 'number')
      .reduce((sum, score) => sum + score, 0);
  };

  const totalScore = calculateTotalScore();

  const handleChange = (indicatorId: number, value: number) => {
    setScores((prev) => ({
      ...prev,
      [indicatorId]: value,
    }));
  };

  const isFormValid = (): boolean => {
    if (!hasIndicators || !form.evaluation_details) {
      return false;
    }
    return form.evaluation_details.every((criteria) =>
      criteria.indicators.every((ind) => typeof scores[ind.id] === 'number'),
    );
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.evaluation_details || !isFormValid()) return;

    const evaluations = form.evaluation_details.flatMap((criteria) =>
      criteria.indicators.map((indicator) => ({
        participant_form: form.id,
        indicator: indicator.id,
        score: scores[indicator.id] ?? 0,
        comment: '',
      })),
    );

    onScore(evaluations);
  };

  useEffect(() => {
    if (form?.evaluation_details) {
      const initialScores: Record<number, number | null> = {};
      form.evaluation_details.forEach((criteria) => {
        criteria.indicators.forEach((ind) => {
          initialScores[ind.id] = ind.score ?? null;
        });
      });
      setScores(initialScores);
    }
  }, [form]);

  return (
    <Popup isOpen={isOpen} onClose={onClose} popupWidth='large' closeOutside>
      <h2 className='popup__title'>Оценка анкеты</h2>
      <p className='popup__subtitle'>Выберите балл 0, 1 или 2 для каждого индикатора:</p>
      {!hasIndicators ? (
        <p className='score-empty'>
          Для этой номинации пока не заданы критерии оценки. Обратитесь к
          организаторам.
        </p>
      ) : (
        <Form name='set-score' onSubmit={handleSubmit}>
          {form.evaluation_details!.map((criteria, cIdx) => (
            <div key={criteria.criteria_id} className='score-criteria-block'>
              <FormField
                title={`Индикатор ${cIdx + 1}. ${criteria.criteria_name}`}
              >
                {criteria.indicators.map((indicator) => {
                  const rubric = getIndicatorRubric(
                    indicator.name,
                    criteria.criteria_name,
                  );
                  return (
                    <div key={indicator.id} className='indicator-score-block'>
                      {rubric ? (
                        <p className='indicator-name'>{rubric}</p>
                      ) : null}
                      <div className='score-buttons'>
                        {([0, 1, 2] as const).map((value) => {
                          const selectedClass =
                            scores[indicator.id] === value ? 'selected' : '';
                          return (
                            <button
                              key={value}
                              type='button'
                              className={`score-button score-button-${value} ${selectedClass}`}
                              onClick={() => handleChange(indicator.id, value)}
                            >
                              {value}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </FormField>
            </div>
          ))}
          <p className='score-caption'>Итоговый балл: {totalScore}</p>
          <FormButtons withMargin>
            <Button
              style={btnStyle}
              text='Отменить'
              color='default'
              onClick={onClose}
              disabled={isLoading}
            />
            <Button
              style={btnStyle}
              text={isLoading ? 'Сохранение…' : 'Сохранить'}
              type='submit'
              color='primary'
              isBlock={!isFormValid() || isLoading}
            />
          </FormButtons>
        </Form>
      )}
    </Popup>
  );
};

export default SetScorePopup;
