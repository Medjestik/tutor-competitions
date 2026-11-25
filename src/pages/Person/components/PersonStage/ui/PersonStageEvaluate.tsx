import { useEffect, useState, type FC } from 'react';

import Link from '../../../../../shared/components/Link/ui/Link';
import { useSelector } from '../../../../../store/store';
import { API_URL } from '../../../../../shared/config';

import '../styles/style.css';

interface IPersonStageEvaluateProps {
  isPublished: boolean;
  maxChatLink: string;
}

const PersonStageEvaluate: FC<IPersonStageEvaluateProps> = ({
  isPublished,
  maxChatLink,
}) => {
  const passedFinal = useSelector(
    (state) => state.user.user?.passed_final === true,
  );

  const chatUrl = maxChatLink.trim();
  const [award, setAward] = useState<'winner' | 'prizewinner' | null>(null);
  const [names, setNames] = useState<string[]>(['', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!isPublished || !passedFinal) return;
    const token = localStorage.getItem('token');
    if (!token) return;
    let active = true;
    fetch(`${API_URL}/competition/forms/my-form/final-diplomas/`, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        if (response.status === 403) return null;
        if (!response.ok) throw new Error('Не удалось загрузить итоговый результат.');
        return response.json();
      })
      .then((data) => {
        if (!active || !data) return;
        setAward(data.award);
        setNames(Array.from({ length: 4 }, (_, index) => data.coauthors[index] || ''));
      })
      .catch(() => { if (active) setError('Не удалось загрузить итоговый результат. Обновите страницу.'); });
    return () => { active = false; };
  }, [isPublished, passedFinal, attempt]);

  const download = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/competition/forms/my-form/final-diplomas/`, {
        method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ coauthors: names.map((name) => name.trim()).filter(Boolean) }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.detail || 'Не удалось сформировать дипломы.');
      }
      const url = URL.createObjectURL(await response.blob());
      const link = document.createElement('a');
      link.href = url; link.download = 'final-diplomas.zip'; document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(url);
    } catch (e) { setError(e instanceof Error ? e.message : 'Не удалось скачать дипломы.'); }
    finally { setLoading(false); }
  };

  if (!isPublished) {
    return (
      <div className='person-stage'>
        <h2 className='person-stage__title'>Финал</h2>
        <p className='person-stage__lead'>Результаты ещё не опубликованы</p>
      </div>
    );
  }

  if (!passedFinal) {
    return (
      <div className='person-stage'>
        <h2 className='person-stage__title'>Финал</h2>
        <p className='person-stage__lead'>Этот этап вам недоступен</p>
      </div>
    );
  }

  if (error && !award) return (
    <div className='person-stage'>
      <h2 className='person-stage__title'>Итоги конкурса</h2>
      <p role='alert'>{error}</p>
      <button type='button' onClick={() => { setError(''); setAttempt((value) => value + 1); }}>Попробовать снова</button>
    </div>
  );

  if (award) return (
    <div className='person-stage'>
      <h2 className='person-stage__title'>Итоги конкурса</h2>
      <p className='person-stage__lead'>Поздравляем! Вы {award === 'winner' ? 'победитель' : 'призёр'} в своей номинации.</p>
      <p>Для каждого указанного соавтора будет сформирован отдельный именной диплом. Проверьте ФИО перед скачиванием.</p>
      <div className='person-stage__coauthor-form'>
        {names.map((name, index) => <label key={index}>ФИО соавтора {index + 1}
          <input value={name} maxLength={255} onChange={(event) => setNames((current) => current.map((item, i) => i === index ? event.target.value : item))} />
        </label>)}
        <button type='button' onClick={download} disabled={loading}>{loading ? 'Формирование…' : 'Скачать дипломы'}</button>
      </div>
      {error && <p role='alert'>{error}</p>}
    </div>
  );

  return (
    <div className='person-stage'>
      <h2 className='person-stage__title'>
        Поздравляем! Вы в финале конкурса «Лидеры транспортного образования»
      </h2>
      <div className='person-stage__welcome-body'>
        <p className='person-stage__subtitle'>
          Поздравляем: вы стали финалистом Международного конкурса лучших педагогических
          практик «Лидеры транспортного образования»!
        </p>
        <p className='person-stage__subtitle'>
          Финал состоится 17–19 ноября 2026 года. В программе – деловая программа по
          вопросам транспортного образования и финальное представление педагогических
          практик перед жюри.
        </p>
        <p className='person-stage__subtitle'>
          Мы уже готовим письмо-приглашение для оформления командировок. Направим его в
          ваши вузы и продублируем на адреса электронной почты финалистов.
        </p>
        <p className='person-stage__subtitle'>
          Чтобы не пропустить важные объявления и организационные детали, присоединяйтесь
          к чату финалистов в МАХ:
          {chatUrl ? (
            <>
              {' '}
              <Link text='перейти в чат' path={chatUrl} />
            </>
          ) : null}
        </p>
        <p className='person-stage__subtitle'>
          Желаем вам уверенности, вдохновения и успешной защиты педагогической практики.
          До встречи в финале!
        </p>
      </div>
    </div>
  );
};

export default PersonStageEvaluate;
