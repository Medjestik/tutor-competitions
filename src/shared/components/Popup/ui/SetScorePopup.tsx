/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState, type FC, FormEvent } from 'react';
import type { ISetScorePopupProps } from '../interface/interface';

import Popup from './Popup';
import Button from '../../Button/ui/Button';

import '../styles/style.css';
import '../styles/score-popup.css';

const btnStyle = {
  width: '100%',
  borderRadius: '12px',
  height: '40px',
  fontSize: '20px',
  lineHeight: '1',
};

const SetScorePopup: FC<ISetScorePopupProps> = ({ isOpen, onClose, form, isLoading, onScore }) => {
  const [scores, setScores] = useState<Record<number, number | null>>({});

  const calculateTotalScore = () => {
    return Object.values(scores)
      .filter((v): v is number => v !== null && v !== undefined)
      .reduce((sum, score) => sum + score, 0);
  };
  
  const totalScore = calculateTotalScore();

  const handleChange = (indicatorId: number, value: number) => {
    setScores(prev => ({
      ...prev,
      [indicatorId]: value,
    }));
  };

  const isFormValid = (): boolean => {
    return form.evaluation_details.every(criteria =>
      criteria.indicators.every(ind => scores[ind.id] !== null)
    );
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid()) return;
  
    const evaluations = form.evaluation_details.flatMap(criteria =>
      criteria.indicators.map(indicator => ({
        participant_form: form.id,
        indicator: indicator.id,
        score: scores[indicator.id] ?? 0,
        comment: '',
      }))
    );
  
    onScore(evaluations);
  };

  useEffect(() => {
    if (form?.evaluation_details) {
      const initialScores: Record<number, number | null> = {};
      form.evaluation_details.forEach(criteria => {
        criteria.indicators.forEach(ind => {
          initialScores[ind.id] = ind.score ?? null;
        });
      });
      setScores(initialScores);
    }
  }, [form]);


  return (
    <Popup isOpen={isOpen} onClose={onClose} popupWidth='large' closeOutside>
      <h2 className='popup__title'>Оценка анкеты</h2>
      <p className='popup__subtitle'>Выберите оценку для каждого индикатора:</p>
      {
        /*
      <Form formName='set-score' type='popup' onSubmit={handleSubmit}>
        {form.evaluation_details.map((criteria, cIdx) => (
          <FormField key={criteria.criteria_id} title={`${cIdx + 1}. ${criteria.criteria_name}`}>
            {criteria.indicators.map((indicator, iIdx) => (
              <div key={indicator.id} className='indicator-score-block'>
                <p className='indicator-name'>{`${cIdx + 1}.${iIdx + 1} ${indicator.name}`}</p>
                <div className='score-buttons'>
                  {[0, 0.5, 1].map(value => (
                    <button
                      key={value}
                      type='button'
                      className={`score-button score-button-${String(value).replace('.', '-')} ${scores[indicator.id] === value ? 'selected' : ''}`}
                      onClick={() => handleChange(indicator.id, value)}
                    >
                      {value === 0 ? 'Нет' : value === 0.5 ? 'Частично' : 'Да'}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </FormField>
        ))}
        <p className='score-caption'> Итоговый балл: {totalScore}</p>
        <div className='form__buttons'>
          <Button style={btnStyle} text='Отменить' color='default' onClick={onClose} />
          <FormSubmit text='Сохранить' isLoading={isLoading} isBlock={!isFormValid()} />
        </div>
      </Form>
      */
      }
    </Popup>
  );
};

export default SetScorePopup;
