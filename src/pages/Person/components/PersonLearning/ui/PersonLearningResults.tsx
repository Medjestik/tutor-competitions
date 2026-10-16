import type { FC } from 'react';
import type { ILearningOutcomeResponse } from '../../../../../shared/utils/api';

import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import Preloader from '../../../../../shared/components/Preloader/ui/Preloader';
import Button from '../../../../../shared/components/Button/ui/Button';
import {
  downloadMyCertificateScan,
  getMyLearningOutcome,
  patchMyLearningOutcome,
} from '../../../../../shared/utils/api';
import { EROUTES, EROUTESLEARNING } from '../../../../../shared/utils/ERoutes';

import '../styles/style.css';
import './person-learning-results.css';

const SUCCESS_WAITING_TEXT =
  'Поздравляем! Вы успешно завершили обучение по программе повышения квалификации.\nМы уже готовим удостоверения о повышении квалификации. Скан-копия вашего удостоверения будет доступна на этой странице в ближайшее время.\nПожалуйста, ожидайте уведомления о готовности документа.';

const FAILURE_TEXT =
  'К сожалению, вы не завершили обучение в установленный срок, поэтому мы не можем выдать вам удостоверение о повышении квалификации.\nЕсли вы считаете, что это уведомление получено по ошибке или данные об окончании обучения отображаются некорректно, пожалуйста, обратитесь в оргкомитет конкурса «Лидеры транспортного образования» по электронной почте: edtech@rut-miit.ru.';

const WAITING_TEXT =
  'Оргкомитет формирует итоги обучения. Когда решение будет принято, на этой странице появится информация о результате и удостоверении.';

const PersonLearningResults: FC = () => {
  const [data, setData] = useState<ILearningOutcomeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSavingOriginal, setIsSavingOriginal] = useState(false);

  const load = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Требуется авторизация');
      setIsLoading(false);
      return Promise.resolve();
    }
    setIsLoading(true);
    return getMyLearningOutcome(token)
      .then((response) => {
        setData(response);
        setError('');
      })
      .catch(() => setError('Не удалось загрузить итоги обучения'))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleOriginalToggle = async (checked: boolean) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }
    setIsSavingOriginal(true);
    try {
      const updated = await patchMyLearningOutcome(token, {
        wantsOriginalCertificate: checked,
      });
      setData(updated);
    } catch {
      setError('Не удалось сохранить запрос на оригинал');
    } finally {
      setIsSavingOriginal(false);
    }
  };

  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <div className='person-learning-results'>
        <p className='person-learning-results__error'>{error}</p>
      </div>
    );
  }

  if (!data?.resultsAvailable) {
    return (
      <div className='person-learning-results'>
        <div className='person-learning-results__card'>
          <h2 className='person-learning-results__title'>Итоги обучения</h2>
          <p className='person-learning-results__text'>
            Раздел «Итоги» откроется после окончания срока обучения
            {data?.streamEndsAt ? ` (${data.streamEndsAt})` : ''}. Пока вы можете
            продолжать курс в разделе «Обучение».
          </p>
          <Link
            className='person-learning-results__link'
            to={`${EROUTES.PERSON}/${EROUTESLEARNING.MATERIALS}`}
          >
            Перейти к материалам
          </Link>
        </div>
      </div>
    );
  }

  let cardTitle = 'Итоги обучения';
  let cardText = WAITING_TEXT;
  let variant: 'waiting' | 'success' | 'failure' = 'waiting';

  if (data.outcome === 'passed') {
    variant = 'success';
    cardTitle = 'Обучение завершено успешно';
    cardText = data.hasCertificateScan
      ? 'Поздравляем! Вы успешно завершили обучение. Скан-копия удостоверения доступна для скачивания ниже.'
      : SUCCESS_WAITING_TEXT;
  } else if (data.outcome === 'failed') {
    variant = 'failure';
    cardTitle = 'Обучение не завершено';
    cardText = FAILURE_TEXT;
  }

  return (
    <div className='person-learning-results'>
      <div
        className={`person-learning-results__card person-learning-results__card_${variant}`}
      >
        <h2 className='person-learning-results__title'>{cardTitle}</h2>
        <p className='person-learning-results__text'>
          {cardText.split('\n').map((line, index) => (
            <span key={index}>
              {line}
              {index < cardText.split('\n').length - 1 ? <br /> : null}
            </span>
          ))}
        </p>

        {data.outcome === 'passed' && data.hasCertificateScan ? (
          <div className='person-learning-results__actions'>
            <Button
              text='Скачать скан удостоверения'
              onClick={() => {
                const token = localStorage.getItem('token');
                if (!token) {
                  return;
                }
                void downloadMyCertificateScan(token).then((blob) => {
                  const url = window.URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = 'certificate_scan.pdf';
                  document.body.appendChild(link);
                  link.click();
                  link.remove();
                  window.URL.revokeObjectURL(url);
                });
              }}
            />
          </div>
        ) : null}

        {data.outcome === 'passed' ? (
          <label className='person-learning-results__checkbox'>
            <input
              type='checkbox'
              checked={data.wantsOriginalCertificate}
              disabled={isSavingOriginal}
              onChange={(event) => void handleOriginalToggle(event.target.checked)}
            />
            <span>Мне нужен оригинал удостоверения</span>
          </label>
        ) : null}
      </div>
    </div>
  );
};

export default PersonLearningResults;
