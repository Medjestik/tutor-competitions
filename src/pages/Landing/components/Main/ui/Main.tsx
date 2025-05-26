import type { FC } from 'react';

import { useNavigate } from 'react-router-dom';

import Button from '../../../../../shared/components/Button/ui/Button';
import CountdownTimer from '../../../../../widgets/CountdownTimer/ui/CountdownTimer';

import { EROUTES } from '../../../../../shared/utils/ERoutes';
import { registrationOverDate } from '../../../../../shared/mock/dates';

import '../styles/style.css';

interface IMainProps {
  windowWidth: number;
}

const Main: FC<IMainProps> = ({ windowWidth }) => {

  const navigate = useNavigate();

  const openLoginPage = () => {
    navigate(EROUTES.LOGIN);
  };

  const openRegistrationPage = () => {
    navigate(EROUTES.REGISTRATION);
  };
  
  return (
    <main className='main' id='main'>
      {
        windowWidth > 1000
        ?
        <>
          <div className='main__drone'></div>
          <span className='main__caption'>ВСЕРОССИЙСКИЙ&nbsp;КОНКУРС ЛУЧШИХ&nbsp;ОБРАЗОВАТЕЛЬНЫХ&nbsp;ПРАКТИК</span>
          <div className='main__title-container'>
            <h1 className='main__title'>«ЛИДЕРЫ </h1>
            <span className='main__title-stroke'></span>
            <h1 className='main__title main__title_color_transparent'>ТРАНСПОРТНОГО ОБРАЗОВАНИЯ»</h1>
          </div>
          <div className='main__info'>
            <p className='main__subtitle'>Конкурс проводится в&nbsp;рамках реализации Концепции подготовки кадров для&nbsp;транспортного комплекса до&nbsp;2035 года и&nbsp;направлен на&nbsp;выявление, поддержку и&nbsp;масштабирование лучших решений в&nbsp;системе транспортного образования.</p>
            <div className='main__time'>
              <p className='main__timer-text'>ДО КОНЦА ПРИЕМА ЗАЯВОК</p>
              <div className='main__timer'>
                <CountdownTimer targetDate={registrationOverDate} />
              </div>
            </div>
          </div>
          <div className='main__buttons'>
            <Button text='Регистрация' onClick={openRegistrationPage} />
            <Button text='Личный кабинет' onClick={openLoginPage} color='inherit' />
          </div>
        </>
        :
        <> 
        </>
      }
    </main>
  );
};

export default Main;
