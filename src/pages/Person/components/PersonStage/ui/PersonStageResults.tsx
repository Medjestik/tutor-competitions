import type { FC } from 'react';

import { useEffect, useState } from 'react';

import Button from '../../../../../shared/components/Button/ui/Button';
import Preloader from '../../../../../shared/components/Preloader/ui/Preloader';
import { PROTOCOL_LINK } from '../../../../../shared/lib/lib';
import * as api from '../../../../../shared/utils/api';
import { useSelector } from '../../../../../store/store';
import MissedPracticeIllustration from './MissedPracticeIllustration';
import CoauthorCertificate from './CoauthorCertificate';

import '../styles/style.css';

interface IPersonStageResultsProps {
  isPublished: boolean;
}

const btnStyle = {
  margin: 0,
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
  const [hasError, setHasError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [certificateError, setCertificateError] = useState(false);
  const [certificateLoading, setCertificateLoading] = useState(false);

  const downloadCertificate = async () => {
    setCertificateError(false);
    setCertificateLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Missing token');
      const blob = await api.downloadParticipantCertificate(token);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'participant-certificate.pdf';
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch {
      setCertificateError(true);
    } finally {
      setCertificateLoading(false);
    }
  };

  useEffect(() => {
    if (!isPublished) {
      setIsLoading(false);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setHasError(true);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setHasError(false);
    api
      .getFormData(token)
      .then((form) => {
        setFormStatus(form.status ?? 'draft');
      })
      .catch((err) => {
        console.error(err);
        setHasError(true);
      })
      .finally(() => setIsLoading(false));
  }, [isPublished, attempt]);

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

  if (hasError) {
    return (
      <div className='person-stage'>
        <h2 className='person-stage__title'>Результаты 1 этапа</h2>
        <p className='person-stage__lead' role='alert'>Не удалось загрузить статус анкеты. Попробуйте ещё раз.</p>
        <div className='person-stage__missed-action'>
          <Button text='Повторить' onClick={() => setAttempt((value) => value + 1)} />
        </div>
      </div>
    );
  }

  const isSubmitted = formStatus === 'submitted';
  return (
    <div className='person-stage person-stage_missed'>
      <h2 className='person-stage__title'>Результаты 1 этапа</h2>
      {isSubmitted ? (
        passedSecondStage ? (
          <p className='person-stage__missed-message'>Ваша работа вышла в полуфинал</p>
        ) : (
          <div className='person-stage__missed-message'>
            <p>К сожалению, ваша работа не вышла в полуфинал.</p>
          </div>
        )
      ) : (
        <p className='person-stage__missed-message'>
          Вы не отправили анкету педагогической практики в установленный срок. К сожалению, получение сертификата участника конкурса вам недоступно.
        </p>
      )}
      <div className='person-stage__results-actions'>
      {isSubmitted && !passedSecondStage && (
        <div>
          <Button text={certificateLoading ? 'Загрузка...' : 'Скачать сертификат'} onClick={downloadCertificate} disabled={certificateLoading} style={btnStyle} />
          {certificateError && <p role='alert'>Не удалось скачать сертификат. Попробуйте ещё раз.</p>}
        </div>
      )}
      {isSubmitted && !passedSecondStage && <CoauthorCertificate />}
      <Button
        text='Скачать протокол'
        type='link'
        href={PROTOCOL_LINK}
        style={btnStyle}
      />
      </div>
      <MissedPracticeIllustration kind={isSubmitted && passedSecondStage ? 'stars' : 'sad'} />
    </div>
  );
};

export default PersonStageResults;
