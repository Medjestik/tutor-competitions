import { useState, type FC } from 'react';

import { ENAV } from '../../../../../shared/components/Navigation/interface/interface';
import { EROUTES } from '../../../../../shared/utils/ERoutes';

import Button from '../../../../../shared/components/Button/ui/Button';
import InfoPopup from '../../../../../shared/components/Popup/ui/InfoPopup';

import '../styles/style.css';

const Stages: FC = () => {

  const [isOpenPreparationInfoPopup, setIsOpenPreparationInfoPopup] = useState<boolean>(false);
  const [isOpenFinalInfoPopup, setIsOpenFinalInfoPopup] = useState<boolean>(false);

  const openPreparationInfoPopup = () => {
    setIsOpenPreparationInfoPopup(true);
  };

  const openFinalInfoPopup = () => {
    setIsOpenFinalInfoPopup(true);
  };

  const closePopup = () => {
    setIsOpenPreparationInfoPopup(false);
    setIsOpenFinalInfoPopup(false);
  };

  return (
    <div className='stages' id={ENAV.STAGES}>
      <div className='stages__container'>
        <h2 className='stages__title'>ЭТАПЫ </h2>
        <ul className='stages__list'>
          <li className='stages__item'>
            <div className='stages__dates'>
              <span className='stages__date'>до&nbsp;10&nbsp;сентября 2025&nbsp;года</span>
              <h4 className='stages__item-title'>РЕГИСТРАЦИЯ</h4>
            </div>
            <div className='stages__separate'></div>
            <div className='stages__description'>
              <p className='stages__item-text'>Зарегистрируйтесь на&nbsp;сайте, чтобы стать участником конкурса</p>
              <Button text='Регистрация' type='link' link={EROUTES.REGISTRATION} color='inherit' />
            </div>
          </li>
          <li className='stages__item'>
            <div className='stages__dates'>
              <span className='stages__date'>до&nbsp;10&nbsp;сентября 2025&nbsp;года</span>
              <h4 className='stages__item-title'>АНКЕТА ПРАКТИКИ</h4>
            </div>
            <div className='stages__separate'></div>
            <div className='stages__description'>
              <p className='stages__item-text'>Опишите практику в&nbsp;личном кабинете, чтобы претендовать на&nbsp;выход в&nbsp;следующий этап</p>
              <Button text='Личный кабинет' type='link' link={EROUTES.LOGIN} color='inherit' />
            </div>
          </li>
          <li className='stages__item'>
            <div className='stages__dates'>
              <span className='stages__date'>до&nbsp;24&nbsp;сентября 2025&nbsp;года</span>
              <h4 className='stages__item-title'>ИТОГИ 1&nbsp;ЭТАПА</h4>
            </div>
            <div className='stages__separate'></div>
            <div className='stages__description'>
              <p className='stages__item-text'>Эксперты оценят анкеты и&nbsp;отберут лучших</p>
            </div>
          </li>
          <li className='stages__item'>
            <div className='stages__dates'>
              <span className='stages__date'>c&nbsp;01&nbsp;по&nbsp;15&nbsp;октября 2025&nbsp;года</span>
              <h4 className='stages__item-title'>ОНЛАЙН- МАСТЕР-КЛАССЫ</h4>
            </div>
            <div className='stages__separate'></div>
            <div className='stages__description'>
              <p className='stages__item-text'>Проведите короткий мастер-класс онлайн — поделитесь своей практикой с&nbsp;другими участниками и&nbsp;оцените мастер-классы других участников, чтобы получить дополнительные баллы</p>
            </div>
          </li>
          <li className='stages__item'>
            <div className='stages__dates'>
              <span className='stages__date'>до&nbsp;19&nbsp;октября 2025&nbsp;года</span>
              <h4 className='stages__item-title'>ПОДГОТОВКА К&nbsp;ФИНАЛУ</h4>
            </div>
            <div className='stages__separate'></div>
            <div className='stages__description'>
              <p className='stages__item-text'>Дождитесь результатов отбора и&nbsp;готовьтесь к&nbsp;выступлению на&nbsp;финале. Если не&nbsp;прошли в&nbsp;финал — подайте заявку на&nbsp;проведение своей лаборатории или&nbsp;события в&nbsp;рамках финала</p>
              <Button onClick={openPreparationInfoPopup} text='Подробнее' color='inherit' />
            </div>
          </li>
          <li className='stages__item'>
            <div className='stages__dates'>
              <span className='stages__date'>с&nbsp;17&nbsp;по&nbsp;19&nbsp;ноября 2025 года</span>
              <h4 className='stages__item-title'>ФИНАЛ В&nbsp;МОСКВЕ</h4>
            </div>
            <div className='stages__separate'></div>
            <div className='stages__description'>
              <p className='stages__item-text'>Приезжайте на&nbsp;трехдневный финал для&nbsp;лучших из&nbsp;лучших. Примите участие в&nbsp;специальном обучении и&nbsp;получите шанс представить свою практику на&nbsp;международном уровне в&nbsp;рамках Транспортной недели 2025</p>
              <Button onClick={openFinalInfoPopup} text='Подробнее' color='inherit' />
            </div>
          </li>
        </ul>
        <div className='stages__background'></div>
      </div>
      {
        isOpenPreparationInfoPopup &&
        <InfoPopup
          isOpen={isOpenPreparationInfoPopup}
          onClose={closePopup}
          title='ПОДГОТОВКА К ФИНАЛУ'
          text='По завершении этапа отбора жюри определит лучшие практики, авторы которых будут приглашены к участию в финале конкурса. Участникам финала предстоит выступить перед экспертами, представить свою практику и ответить на вопросы жюри. Если ваша заявка не прошла в финал — это ещё не конец пути. Вы можете предложить проведение собственной образовательной лаборатории, мастер-класса или другого события в рамках программы финала. Это отличная возможность поделиться своим опытом, обсудить его с коллегами и экспертами, а также расширить профессиональные связи. Подать заявку на организацию события можно будет после публикации итогов отбора. Мы приветствуем инициативу и готовы поддерживать качественные идеи, даже если они не попали в основной список финалистов.'
        />
      }
      {
        isOpenFinalInfoPopup &&
        <InfoPopup
          isOpen={isOpenFinalInfoPopup}
          onClose={closePopup}
          title='ФИНАЛ В МОСКВЕ'
          text='Финал конкурса — это трехдневное очное мероприятие для участников, чьи практики признаны лучшими. Вас ждет насыщенная программа: защита практик перед экспертным жюри, участие в образовательных сессиях и обсуждениях с лидерами инженерного и педагогического сообществ. Отдельное внимание будет уделено профессиональному развитию финалистов. Мы подготовим специальные обучающие модули, которые помогут развить навыки презентации, публичных выступлений и продвижения собственных образовательных решений. Самые сильные и значимые практики будут отобраны для презентации на международной сессии в рамках Транспортной недели — 2025. Это уникальная возможность заявить о себе и масштабировать свою работу на всю страну и за её пределы.'
        />
      }
    </div>
  );
};

export default Stages;
