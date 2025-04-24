import type { FC } from 'react';

import { Link } from 'react-scroll';
import Button from '../../../../../shared/components/Button/ui/Button';

import '../styles/style.css';

interface IMainProps {
  windowWidth: number;
  onLogin: () => void;
}

const btnStyle = {
  margin: '40px 0 0',
};

const mobileBtnStyle = {
  margin: '20px auto',
  width: '100%',
};

const Main: FC<IMainProps> = ({ windowWidth }) => {

  return (
    <div className='main'>
      {
        windowWidth > 1000
        ?
        <>
        <div className='main__column'>
          <div className='main__section main__section-registration'>
            <h3 className='main__timer-title'>Отбор команд завершен!</h3>
            <p className='main__timer-text'>Мы благодарим все команды за участие!</p>
            <p className='main__timer-text'>Наши эксперты оценили ваши работы и вы можете ознакомиться с результатами.</p>
            <Link to='leaderboard' smooth={true} offset={0} duration={750} spy={true}><Button text='Результаты' width='default' style={windowWidth > 1000 ? btnStyle : mobileBtnStyle} /></Link>
          </div>
        </div>
        <div className='main__column'>
          <div className='main__section main__section-img'> 
            <h1 className='main__title'>Межвузовские&nbsp;транспортные проектные&nbsp;соревнования</h1>
            <div className='main__img'></div>
          </div>
        </div>
        </>
        :
        <> 
          <div className='main__img'>
            <h3 className='main__timer-title'>Отбор команд завершен</h3>
            <h1 className='main__title'>Межвузовские транспортные проектные&nbsp;cоревнования</h1>
          </div>
          <div className='main__section'>
            <h3 className='main__section-title'>Мы благодарим все команды за участие!</h3>
            <p className='main__section-text'>Наши эксперты оценили ваши работы и вы можете ознакомиться с результатами.</p>
            <Link to='leaderboard' smooth={true} offset={0} duration={750} spy={true}><Button text='Результаты' width='default' style={windowWidth > 1000 ? btnStyle : mobileBtnStyle} /></Link>
          </div>
          
        </>
      }
    </div>
  );
};

export default Main;
