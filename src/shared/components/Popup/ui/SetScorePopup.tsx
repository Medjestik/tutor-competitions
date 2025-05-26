import { useEffect, useState, type FC, FormEvent } from 'react';
import type { ISetScorePopupProps } from '../interface/interface';

import Popup from './Popup';
import Button from '../../Button/ui/Button';
import Form from '../../Form/ui/Form';
import FormField from '../../Form/components/FormField/ui/FormField';
import FormFieldError from '../../Form/components/FormField/ui/FormFieldError';
import FormInputString from '../../Form/components/FormInput/ui/FormInputString';
import FormSubmit from '../../Form/components/FormSubmit/ui/FormSubmit';

import '../styles/style.css';

const btnStyle = {
  width: '100%',
  borderRadius: '12px',
  height: '40px',
  fontSize: '20px',
  lineHeight: '1',
};

const SetScorePopup: FC<ISetScorePopupProps> = ({ isOpen, onClose, form, isLoading, onScore }) => {
  const [scores, setScores] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (form?.criteria_with_evaluations) {
      setScores(form.criteria_with_evaluations.map(c => String(c.expert_score ?? '')));
      setErrors(form.criteria_with_evaluations.map(() => ''));
    }
  }, [form]);

  const handleChange = (value: string, index: number) => {
    const newScores = [...scores];
    newScores[index] = value;
  
    const newErrors = [...errors];
  
    const num = Number(value);
    if (value.trim() === '') {
      newErrors[index] = 'Поле не может быть пустым';
    } else if (isNaN(num)) {
      newErrors[index] = 'Введите число';
    } else if (num < 0 || num > 3) {
      newErrors[index] = 'Оценка должна быть от 0 до 3';
    } else {
      newErrors[index] = '';
    }
  
    setScores(newScores);
    setErrors(newErrors);
  
    const allFieldsFilled = newScores.every((score) => score.trim() !== '');
    const noErrors = newErrors.every((err) => err === '');
  
    setIsValid(allFieldsFilled && noErrors);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isValid) return;

    const evaluatedCriteria = form.criteria_with_evaluations.map((c, i) => ({
      ...c,
      expert_score: Number(scores[i])
    }));

    onScore(evaluatedCriteria);
  };

  return (
    <Popup isOpen={isOpen} onClose={onClose} popupWidth='medium' closeOutside>
      <h2 className='popup__title'>Оценка анкеты</h2>
      <p className='popup__subtitle'>Введите оценки по каждому критерию:</p>
      <Form formName='set-score' type='popup' onSubmit={handleSubmit}>
        {
          form.criteria_with_evaluations.map((criteria, index) => (
            <FormField key={index} title={`${index + 1}. ${criteria.name}`}>
              <FormInputString 
                value={scores[index] ?? ''}
                placeholder='Введите оценку от 0 до 3'
                onChange={(e) => handleChange(e, index)}
              />
              <FormFieldError isShow={!!errors[index]} text={errors[index]} />
            </FormField>
          ))
        }
        <div className='form__buttons'>
          <Button style={btnStyle} text='Отменить' color='cancel' onClick={onClose} />
          <FormSubmit text='Сохранить' isLoading={isLoading} isBlock={!isValid} />
        </div>
      </Form>
    </Popup>
  );
};

export default SetScorePopup;
