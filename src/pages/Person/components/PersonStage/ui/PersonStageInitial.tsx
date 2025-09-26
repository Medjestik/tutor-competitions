import type { FC } from 'react';

import { useContext } from 'react';

import { CurrentUserContext } from '../../../../../shared/context/team';

import PersonVideo from '../../PersonVideo/ui/PersonVideo';
import Link from '../../../../../shared/components/Link/ui/Link';

import '../styles/style.css';

const PersonStageInitial: FC = () => {

  const currentUser = useContext(CurrentUserContext);

  return (
    <div className='person-stage'>
      <h2 className='person-stage__title'>Начало</h2>
      <div className='person-stage__container'>
        {
          currentUser.passed_second_stage
          ?
          <div className='person-stage__info'>
            <p className='person-stage__subtitle'><span className='person-stage__text-bold'>Поздравляем с&nbsp;выходом в&nbsp;полуфинал!</span> Вы прошли в&nbsp;следующий этап Всероссийского конкурса лучших педагогических практик «Лидеры транспортного образования».</p>
            <p className='person-stage__subtitle'>Чтобы продолжить участие, выполните следующие шаги:</p>
            <p className='person-stage__subtitle'>1. Выберите удобное время для проведения онлайн-мастер-класса (кнопка «02»);</p>
            <p className='person-stage__subtitle'>2. Скачайте шаблон презентации, подготовьте материал и загрузите его в личный кабинет (кнопка «03»);</p>
            <p className='person-stage__subtitle'>3. Проведите свой мастер-класс в выбранное время (кнопка «04»).</p>
            <p className='person-stage__subtitle'>Желаем удачи!</p>
          </div>
          :
          <div className='person-stage__info'>
            <p className='person-stage__subtitle person-stage__text-bold'>Спасибо за участие!</p>
            <p className='person-stage__subtitle'>К сожалению, в этом сезоне конкурса ваша практика не прошла в полуфинал. Мы благодарим вас за ценный вклад и надеемся увидеть вас среди участников конкурса в следующем году.</p>
            <p className='person-stage__subtitle'>Приглашаем вас продолжить участие в жизни конкурса — посмотреть онлайн-презентации коллег и вдохновиться их подходами. В <Link text='Telegram-канале' path='https://t.me/edtechmiit' /> конкурса будут опубликованы ссылки на подключение к вебинарам.</p>
            <p className='person-stage__subtitle'>Если вы хотите представить свою практику в деловой программе финала вне конкурсной программы, отправьте заявку на почту edtech@emiit.ru до 31 сентября 2025 года. Укажите название практики или мастер-класса, краткое описание и свои контактные данные — организаторы свяжутся с вами для уточнения деталей.</p>
          </div>
        }
        <PersonVideo url='https://course.emiit.ru/webtutor/ivan/land/video/video1.mp4' />
      </div>
    </div>
  );
};

export default PersonStageInitial;
