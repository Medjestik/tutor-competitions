import type { FC } from 'react';

import { useNavigate } from 'react-router-dom';

import Button from '../../../../../shared/components/Button/ui/Button';
import { EROUTES, EROUTESSTAGES } from '../../../../../shared/utils/ERoutes';

import PersonVideo from '../../PersonVideo/ui/PersonVideo';
import PersonChannelBanner from './PersonChannelBanner';

import '../styles/style.css';

const PersonStageInitial: FC = () => {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate(`${EROUTES.PERSON}/${EROUTESSTAGES.PERSON_FORM}`);
  };

  return (
    <div className='person-stage person-stage_initial'>
      <div className='person-stage__header'>
        <h2 className='person-stage__title'>Начало</h2>
        <p className='person-stage__lead'>
          Ознакомьтесь с основной информацией о конкурсе
        </p>
      </div>

      <div className='person-stage__grid'>
        <div className='person-stage__left'>
          <div className='person-stage__video-wrap'>
            <PersonVideo url="" isEmpty />
          </div>
          <PersonChannelBanner />
        </div>

        <div className='person-stage__info person-stage__info_welcome'>
          <p className='person-stage__welcome-title'>
            Поздравляем с участием в Международном конкурсе лучших педагогических практик «Лидеры транспортного образования»!
          </p>
          <div className='person-stage__welcome-body'>
            <p>
              Конкурс направлен на выявление, поддержку и масштабирование лучших образовательных решений в системе транспортного образования, а также на распространение передового педагогического опыта и развитие профессионального сообщества преподавателей транспортной отрасли.
            </p>
            <p>
              В 2026 году конкурс проводится в два этапа: заполнение краткой анкеты педагогической практики и подготовка видеопрезентации, в которой участники смогут наглядно представить ключевые особенности, результаты и практическую значимость своих разработок. На каждом этапе конкурсные материалы будут оцениваться экспертным жюри. Актуальные сроки проведения этапов, требования к материалам и иная организационная информация размещены на основной странице конкурса.
            </p>
            <p>
              Для отдельных категорий участников также предусмотрена возможность бесплатно пройти программу повышения квалификации «Инженерная дидактика и образовательные технологии в транспортном образовании» с выдачей удостоверения установленного образца. Для начала обучения вам необходимо заполнить анкету и загрузить требуемые документы в разделе «Обучение» личного кабинета.
            </p>
            <p>
              Желаем вам успешного участия, вдохновения и больших достижений!
            </p>
          </div>
        </div>
      </div>

      <div className='person-stage__footer-actions'>
        <Button
          text='Продолжить'
          color='gradient'
          onClick={handleContinue}
          style={{
            margin: 0,
            fontSize: '16px',
            fontWeight: 500,
            height: '48px',
            minWidth: '141px',
            padding: '16px 24px',
            lineHeight: 1,
          }}
        />
      </div>
    </div>
  );
};

export default PersonStageInitial;
