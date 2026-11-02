import type { FC } from 'react';

import Link from '../../../../../shared/components/Link/ui/Link';
import { useSelector } from '../../../../../store/store';

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
