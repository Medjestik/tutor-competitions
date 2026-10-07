import type { FC } from 'react';

import { useEffect, useState } from 'react';

import Button from '../../../../../shared/components/Button/ui/Button';
import Preloader from '../../../../../shared/components/Preloader/ui/Preloader';
import { PROTOCOL_LINK } from '../../../../../shared/lib/lib';
import * as api from '../../../../../shared/utils/api';
import { useSelector } from '../../../../../store/store';

import '../styles/style.css';

interface IPersonStageResultsProps {
  isPublished: boolean;
}

const btnStyle = {
  margin: '24px 0 0 0',
  fontSize: '18px',
  height: '40px',
  lineHeight: '18px',
  padding: '8px 20px',
};

const PersonStageResults: FC<IPersonStageResultsProps> = ({ isPublished }) => {
  const passedSecondStage = useSelector(
    (state) => state.user.user?.passed_second_stage === true,
  );

  const [isLoading, setIsLoading] = useState(isPublished);
  const [formStatus, setFormStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!isPublished) {
      setIsLoading(false);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setFormStatus('draft');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    api
      .getFormData(token)
      .then((form) => {
        setFormStatus(form.status ?? 'draft');
      })
      .catch((err) => {
        console.error(err);
        setFormStatus('draft');
      })
      .finally(() => setIsLoading(false));
  }, [isPublished]);

  if (isLoading) {
    return (
      <div className='person-stage'>
        <Preloader />
      </div>
    );
  }

  if (!isPublished) {
    return (
      <div className='person-stage'>
        <h2 className='person-stage__title'>Результаты 1 этапа</h2>
        <p className='person-stage__lead'>Результаты ещё не опубликованы</p>
      </div>
    );
  }

  const isSubmitted = formStatus === 'submitted';
  const verdict = passedSecondStage
    ? 'Работа прошла в полуфинал'
    : 'Работа не прошла в полуфинал';

  return (
    <div className='person-stage'>
      <h2 className='person-stage__title'>Результаты 1 этапа</h2>
      {isSubmitted ? (
        <p className='person-stage__subtitle person-stage__text-bold'>{verdict}</p>
      ) : (
        <p className='person-stage__subtitle person-stage__text-bold'>
          Вы не отправляли анкету
        </p>
      )}
      <Button
        text='Скачать протокол'
        type='link'
        href={PROTOCOL_LINK}
        style={btnStyle}
      />
    </div>
  );
};

export default PersonStageResults;
