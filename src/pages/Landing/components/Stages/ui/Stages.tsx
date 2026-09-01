import { type FC } from 'react';

import { ENAV } from '../../../../../shared/components/Navigation/interface/interface';
import { EROUTES } from '../../../../../shared/utils/ERoutes';

import Button from '../../../../../shared/components/Button/ui/Button';

import '../styles/style.css';

interface IStagesProps {
  windowWidth: number;
}

const btnStubStyle = {
  margin: '0',
  fontSize: '24px',
  lineHeight: '24px',
};

const btnMobileStyle = {
  margin: '0',
  fontSize: '18px',
  height: '40px',
  lineHeight: '18px',
  padding: '8px 20px',
};

const Stages: FC<IStagesProps> = ({ windowWidth }) => {

  return (
    <div className='stages' id={ENAV.STAGES}>
      <div className='stages__container'>
        <h2 className='stages__title'>ЭТАПЫ </h2>
        <ul className='stages__list'>
          <li className='stages__item'>
            <div className='stages__dates'>
              <span className='stages__date'>с&nbsp;1&nbsp;сентября</span>
              <h4 className='stages__item-title'>РЕГИСТРАЦИЯ</h4>
            </div>
            <div className='stages__separate'></div>
            <div className='stages__description'>
              <p className='stages__item-text'>Зарегистрируйтесь на&nbsp;сайте, чтобы стать участником конкурса или&nbsp;бесплатно пройти повышение квалификации</p>
              <Button text='Регистрация' type='link' href={EROUTES.LOGIN} color='gradient' style={windowWidth > 1280 ? btnStubStyle : btnMobileStyle} />
            </div>
          </li>
          <li className='stages__item'>
            <div className='stages__dates'>
              <span className='stages__date'>с&nbsp;1&nbsp;по&nbsp;25&nbsp;сентября</span>
              <h4 className='stages__item-title'>АНКЕТА ПРАКТИКИ</h4>
            </div>
            <div className='stages__separate'></div>
            <div className='stages__description'>
              <p className='stages__item-text'>Опишите практику в&nbsp;личном кабинете, чтобы пройти в&nbsp;следующий этап</p>
              <Button text='Личный кабинет' type='link' href={EROUTES.LOGIN} color='inherit' style={windowWidth > 1280 ? btnStubStyle : btnMobileStyle} />
            </div>
          </li>
          <li className='stages__item'>
            <div className='stages__dates'>
              <span className='stages__date'>с&nbsp;1&nbsp;сентября</span>
              <h4 className='stages__item-title'>ПОВЫШЕНИЕ КВАЛИФИКАЦИИ</h4>
            </div>
            <div className='stages__separate'></div>
            <div className='stages__description'>
              <p className='stages__item-text'>Загрузите необходимые документы и&nbsp;бесплатно пройдите программу повышения квалификации по&nbsp;инженерной дидактике с&nbsp;выдачей удостоверения установленного образца — курс доступен в&nbsp;личном кабинете участника</p>
            </div>
          </li>
          <li className='stages__item'>
            <div className='stages__dates'>
              <span className='stages__date'>с&nbsp;26&nbsp;по&nbsp;30&nbsp;сентября</span>
              <h4 className='stages__item-title'>ИТОГИ 1&nbsp;ЭТАПА</h4>
            </div>
            <div className='stages__separate'></div>
            <div className='stages__description'>
              <p className='stages__item-text'>Эксперты оценят анкеты и&nbsp;отберут лучших</p>
            </div>
          </li>
          <li className='stages__item'>
            <div className='stages__dates'>
              <span className='stages__date'>с&nbsp;1&nbsp;по&nbsp;14&nbsp;октября</span>
              <h4 className='stages__item-title'>ПРЕЗЕНТАЦИЯ ПРАКТИКИ</h4>
            </div>
            <div className='stages__separate'></div>
            <div className='stages__description'>
              <p className='stages__item-text'>Запишите и&nbsp;загрузите в&nbsp;личный кабинет короткую видеопрезентацию своей практики. В&nbsp;зависимости от&nbsp;формата работы это может быть краткая демонстрация занятия со&nbsp;студентами, мастер-класс по&nbsp;применению педагогического инструмента или&nbsp;презентация реализуемого подхода и&nbsp;достигнутых результатов.</p>
            </div>
          </li>
          <li className='stages__item'>
            <div className='stages__dates'>
              <span className='stages__date'>с&nbsp;14&nbsp;по&nbsp;21&nbsp;октября</span>
              <h4 className='stages__item-title'>ИТОГИ 2&nbsp;ЭТАПА</h4>
            </div>
            <div className='stages__separate'></div>
            <div className='stages__description'>
              <p className='stages__item-text'>Дождитесь результатов отбора и&nbsp;готовьтесь к&nbsp;выступлению на&nbsp;финале. Если не&nbsp;прошли в&nbsp;финал — подайте заявку на&nbsp;участие в&nbsp;деловой программе</p>
            </div>
          </li>
          <li className='stages__item'>
            <div className='stages__dates'>
              <span className='stages__date'>с&nbsp;17&nbsp;по&nbsp;19&nbsp;ноября</span>
              <h4 className='stages__item-title'>ФИНАЛ В&nbsp;МОСКВЕ</h4>
            </div>
            <div className='stages__separate'></div>
            <div className='stages__description'>
              <p className='stages__item-text'>Приезжайте на&nbsp;трехдневный финал для&nbsp;лучших из&nbsp;лучших. Получите шанс представить свою практику на&nbsp;международном уровне в&nbsp;рамках Транспортной недели 2026</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Stages;
