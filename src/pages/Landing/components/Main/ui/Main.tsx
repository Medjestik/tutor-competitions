import type { FC } from 'react';

import { useNavigate } from 'react-router-dom';

import Button from '../../../../../shared/components/Button/ui/Button';

import { EROUTES } from '../../../../../shared/utils/ERoutes';

import '../styles/style.css';

interface IMainProps {
  windowWidth: number;
}

const Main: FC<IMainProps> = ({ windowWidth }) => {

  const navigate = useNavigate();

  const btnRegStyle = {
    margin: '0',
    fontSize: windowWidth > 1440 ? '24px' : '18px',
    borderRadius: windowWidth > 1440 ? '50px' : '16px',
    height: windowWidth > 1440 ? '60px' : '40px',
    lineHeight: '1',
    padding: '8px 20px',
  };

  return (
    <main className='main' id='main'>
      <div className='main__hero'>
        <div className='main__tutor'></div>
        <span className='main__caption'>
          МЕЖДУНАРОДНЫЙ&nbsp;КОНКУРС ЛУЧШИХ&nbsp;ОБРАЗОВАТЕЛЬНЫХ&nbsp;ПРАКТИК
        </span>

        <div className='main__title-container'>
          <div className='main__title-row'>
            <h1 className='main__title'>«ЛИДЕРЫ</h1>

            <span className='main__title-stroke'></span>

            <h1 className='main__title main__title_color_transparent'>
              ТРАНСПОРТНОГО
            </h1>
          </div>

          <h1 className='main__title main__title_color_transparent main__title_education'>
            ОБРАЗОВАНИЯ»
          </h1>
        </div>

        <div className='main__row'>
          <div className='main__row-content'>
            <div className='main__info'>
              <p className='main__subtitle'>
                Конкурс проводится в&nbsp;рамках реализации Концепции подготовки
                кадров для&nbsp;транспортного комплекса до&nbsp;2035 года и&nbsp;направлен
                на&nbsp;выявление, поддержку и&nbsp;масштабирование лучших решений в&nbsp;системе
                транспортного образования.
              </p>
            </div>

            <div className='main__buttons'>
              <Button
                text='Зарегистрироваться'
                onClick={() => navigate(EROUTES.REGISTRATION)}
                color='primary'
                style={btnRegStyle}
              />

              <Button
                text='Личный кабинет'
                onClick={() => navigate(EROUTES.LOGIN)}
                color='inherit'
                style={btnRegStyle}
              />
            </div>
          </div>
        </div>

        <p className='main__timer'>
          ОТКРЫТ&nbsp;ПРИЁМ&nbsp;РАБОТ&nbsp;НА&nbsp;СЕЗОН&nbsp;2026&nbsp;ГОДА
        </p>
      </div>
    </main>
  );
};

export default Main;
