import type { FC } from 'react';

import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

import { ENAV } from '../../../../../shared/components/Navigation/interface/interface';

import '../styles/style.css';

interface IAdvantagesProps {
  windowWidth: number;
}

const Advantages: FC<IAdvantagesProps> = ({ windowWidth }) => {

  console.log(windowWidth);

  return (
    <div className='advantages' id={ENAV.ADVANTAGES}>
      <div className='advantages__container'>
        <h2 className='advantages__title'>ЗАЧЕМ УЧАСТВОВАТЬ</h2>
        <Carousel
          swipeable
          autoPlay={true}
          showThumbs={false}
          showStatus={false}
          showIndicators={false}
          showArrows={false}
          infiniteLoop
          centerMode
          centerSlidePercentage={30}
        >
          <div className='advantages__item'>
            <div className='advantages__item-icon'></div>
            <h4 className='advantages__item-title'>Масштабирование опыта</h4>
            <h4 className='advantages__item-text'>Лучшие практики будут рекомендованы к&nbsp;распространению в&nbsp;других вузах страны</h4>
          </div>
          <div className='advantages__item'>
            <div className='advantages__item-icon'></div>
            <h4 className='advantages__item-title'>Признание на&nbsp;федеральном уровне</h4>
            <h4 className='advantages__item-text'>Продемонстрируйте свои инновационные методики ведущим экспертам отрасли и&nbsp;коллегам со&nbsp;всей России</h4>
          </div>
          <div className='advantages__item'>
            <div className='advantages__item-icon'></div>
            <h4 className='advantages__item-title'>Профессиональный рост и&nbsp;обмен опытом</h4>
            <h4 className='advantages__item-text'> Участие в&nbsp;мастер-классах, обсуждениях с&nbsp;экспертами и&nbsp;нетворкинг с лучшими преподавателями транспортных вузов</h4>
          </div>
          <div className='advantages__item'>
            <div className='advantages__item-icon'></div>
            <h4 className='advantages__item-title'>Денежный приз</h4>
            <h4 className='advantages__item-text'>Победители каждой номинации получат денежные призы</h4>
          </div>
          <div className='advantages__item'>
            <div className='advantages__item-icon'></div>
            <h4 className='advantages__item-title'>Международная конференция</h4>
            <h4 className='advantages__item-text'>Выступите с&nbsp;презентацией своей практики на&nbsp;сессии Транспортной недели 2025 в&nbsp;Москве</h4>
          </div>
        </Carousel>
      </div>
    </div>
  );
};

export default Advantages;
