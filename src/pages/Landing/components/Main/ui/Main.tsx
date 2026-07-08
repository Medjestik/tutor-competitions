import type { FC } from 'react';

import { useNavigate } from 'react-router-dom';

import Button from '../../../../../shared/components/Button/ui/Button';

import { EROUTES } from '../../../../../shared/utils/ERoutes';

import '../styles/style.css';

const btnMobileStyle = {
  margin: '0',
};

interface IMainProps {
  windowWidth: number;
}

const Main: FC<IMainProps> = ({ windowWidth }) => {

  const navigate = useNavigate();

  const btnRegStyle = {
    margin: '0',
    fontSize: windowWidth > 1000 ? '24px' : '18px',
    borderRadius: windowWidth > 1000 ? '50px' : '16px',
    height: windowWidth > 1000 ? '60px' : '40px',
    lineHeight: '1',
    padding: '8px 20px',
  };

  return (
    <main className='main' id='main'>
      {
        windowWidth > 1000
        ?
        <>
          <div className='main__tutor'></div>
          <span className='main__caption'>МЕЖДУНАРОДНЫЙ&nbsp;КОНКУРС ЛУЧШИХ&nbsp;ОБРАЗОВАТЕЛЬНЫХ&nbsp;ПРАКТИК</span>
          <div className='main__title-container'>
            <h1 className='main__title'>«ОПЫТ В </h1>
            <span className='main__title-stroke'></span>
            <h1 className='main__title main__title_color_transparent'>ДВИЖЕНИИ»</h1>
          </div>
          <div className='main__info'>
            <p className='main__subtitle'>Конкурс проводится в&nbsp;рамках реализации Концепции подготовки кадров для&nbsp;транспортного комплекса до&nbsp;2035 года и&nbsp;направлен на&nbsp;выявление, поддержку и&nbsp;масштабирование лучших решений в&nbsp;системе транспортного образования.</p>
            <div className='main__time'>
              <p className='main__timer'>ОТКРЫТ ПРИЁМ РАБОТ НА НОВЫЙ СЕЗОН!</p>
            </div>
          </div>
          <div className='main__buttons'>
            <Button text='Регистрация' onClick={() => navigate(EROUTES.REGISTRATION)} color='primary' style={btnRegStyle} />
            <Button text='Личный кабинет' onClick={() => navigate(EROUTES.LOGIN)} color='inherit' style={btnRegStyle} />
          </div>
        </>
        :
        <>
          <div className='main__tutor'></div>
          <span className='main__caption'>МЕЖДУНАРОДНЫЙ&nbsp;КОНКУРС ЛУЧШИХ&nbsp;ОБРАЗОВАТЕЛЬНЫХ&nbsp;ПРАКТИК</span>
          <div className='main__title-container'>
            <h1 className='main__title'>«ОПЫТ В </h1>
            <span className='main__title-stroke'></span>
            <h1 className='main__title main__title_color_transparent'>ДВИЖЕНИИ»</h1>
          </div>
          <p className='main__timer'>ОТКРЫТ ПРИЁМ РАБОТ НА НОВЫЙ СЕЗОН!</p>
          <p className='main__subtitle'>Конкурс проводится в&nbsp;рамках реализации Концепции подготовки кадров для&nbsp;транспортного комплекса до&nbsp;2035 года и&nbsp;направлен на&nbsp;выявление, поддержку и&nbsp;масштабирование лучших решений в&nbsp;системе транспортного образования.</p>
          <div className='main__buttons'>
            <Button text='Регистрация' onClick={() => navigate(EROUTES.REGISTRATION)} color='primary' style={btnMobileStyle} />
            <Button text='Личный кабинет' onClick={() => navigate(EROUTES.LOGIN)} color='inherit' style={btnMobileStyle} />
          </div>
        </>
      }
    </main>
  );
};

export default Main;
