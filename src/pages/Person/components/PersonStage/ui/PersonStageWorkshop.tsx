import type { FC } from 'react';

import { useEffect, useState } from 'react';

import Button from '../../../../../shared/components/Button/ui/Button';
import Preloader from '../../../../../shared/components/Preloader/ui/Preloader';
import { PROTOCOL_SEMIFINAL_LINK } from '../../../../../shared/lib/lib';
import * as api from '../../../../../shared/utils/api';
import { useSelector } from '../../../../../store/store';
import MissedPracticeIllustration from './MissedPracticeIllustration';
import CoauthorCertificate from './CoauthorCertificate';

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
  const [loadError, setLoadError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [downloadError, setDownloadError] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const download = async () => {
    setDownloadError(false);
    setDownloading(true);
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
      setDownloadError(true);
    } finally {
      setDownloading(false);
    }
  };

  useEffect(() => {
    if (!isPublished) {
      setIsLoading(false);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setLoadError(true);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setLoadError(false);
    api
      .getFormData(token)
      .then((form) => {
        setFormStatus(form.status ?? 'draft');
      })
      .catch((err) => {
        console.error(err);
        setLoadError(true);
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

  if (loadError) {
    return <div className='person-stage'>
      <h2 className='person-stage__title'>Результаты 2 этапа</h2>
      <p role='alert'>Не удалось загрузить статус анкеты. Попробуйте ещё раз.</p>
      <Button text='Повторить' onClick={() => setAttempt((value) => value + 1)} />
    </div>;
  }

  const isSubmitted = formStatus === 'submitted';
  const verdict = passedFinal
    ? 'Работа прошла в финал'
    : 'Работа не прошла в финал';

  if (isSubmitted && !passedFinal) {
    return <div className='person-stage person-stage_missed'>
      <h2 className='person-stage__title'>Результаты 2 этапа</h2>
      <p className='person-stage__missed-message'>К сожалению, ваша работа не вышла в финал.</p>
      <div className='person-stage__results-actions'>
        <div>
          <Button text={downloading ? 'Загрузка...' : 'Скачать сертификат'} onClick={download} disabled={downloading} style={{ ...btnStyle, margin: 0 }} />
          <CoauthorCertificate />
          {downloadError && <p role='alert'>Не удалось скачать сертификат. Попробуйте ещё раз.</p>}
        </div>
        <Button text='Скачать протокол' type='link' href={PROTOCOL_SEMIFINAL_LINK} style={{ ...btnStyle, margin: 0 }} />
      </div>
      <MissedPracticeIllustration kind='sad' />
    </div>;
  }

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
