import type { FC } from 'react';

import { useEffect, useState } from 'react';

import Button from '../../../../../shared/components/Button/ui/Button';
import Preloader from '../../../../../shared/components/Preloader/ui/Preloader';
import { PROTOCOL_SEMIFINAL_LINK } from '../../../../../shared/lib/lib';
import * as api from '../../../../../shared/utils/api';
import { useSelector } from '../../../../../store/store';

import '../styles/style.css';

interface IPersonStageWorkshopProps {
  isPublished: boolean;
}

const btnStyle = {
  margin: '24px 0 0 0',
  fontSize: '18px',
  height: '40px',
  lineHeight: '18px',
  padding: '8px 20px',
};

const PersonStageWorkshop: FC<IPersonStageWorkshopProps> = ({ isPublished }) => {
  const passedSecondStage = useSelector(
    (state) => state.user.user?.passed_second_stage === true,
  );
  const passedFinal = useSelector(
    (state) => state.user.user?.passed_final === true,
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
        <h2 className='person-stage__title'>Результаты 2 этапа</h2>
        <p className='person-stage__lead'>Результаты ещё не опубликованы</p>
      </div>
    );
  }

  if (!passedSecondStage) {
    return (
      <div className='person-stage'>
        <h2 className='person-stage__title'>Результаты 2 этапа</h2>
        <p className='person-stage__lead'>Этот этап вам недоступен</p>
      </div>
    );
  }

  const isSubmitted = formStatus === 'submitted';
  const verdict = passedFinal
    ? 'Работа прошла в финал'
    : 'Работа не прошла в финал';

  return (
    <div className='person-stage'>
      <h2 className='person-stage__title'>Результаты 2 этапа</h2>
      {isSubmitted ? (
        <p className='person-stage__subtitle person-stage__text-bold'>{verdict}</p>
      ) : (
        <p className='person-stage__lead'>
          Вы не отправили анкету педагогической практики в установленный срок. К сожалению, получение сертификата участника конкурса вам недоступно.
        </p>
      )}
      <Button
        text='Скачать протокол'
        type='link'
        href={PROTOCOL_SEMIFINAL_LINK}
        style={btnStyle}
      />
    </div>
  );
};

export default PersonStageWorkshop;
