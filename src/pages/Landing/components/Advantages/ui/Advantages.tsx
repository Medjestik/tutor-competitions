import type { FC } from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import icon1 from '../../../../../shared/icons/advantages/1.svg';
import icon2 from '../../../../../shared/icons/advantages/2.svg';
import icon3 from '../../../../../shared/icons/advantages/3.svg';
import icon4 from '../../../../../shared/icons/advantages/4.svg';
import icon5 from '../../../../../shared/icons/advantages/5.svg';
import icon6 from '../../../../../shared/icons/advantages/6.svg';

import { ENAV } from '../../../../../shared/components/Navigation/interface/interface';

import '../styles/style.css';

interface IAdvantagesProps {
  windowWidth: number;
}

export const Advantages: FC<IAdvantagesProps> = ({ windowWidth }) => {

  return (
    <div className='advantages' id={ENAV.ADVANTAGES}>
      <div className='advantages__container'>
        <h2 className='advantages__title'>ЗАЧЕМ УЧАСТВОВАТЬ</h2>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          slidesPerView={windowWidth > 1440 ? 3 : windowWidth > 1000 ? 2 : 1}
          spaceBetween={20}
          loop
          autoplay={{ delay: 4000 }}
        >
          {[
            {
              icon: icon1,
              title: 'Масштабирование опыта',
              text: 'Лучшие практики будут рекомендованы к\u00A0распространению в\u00A0других вузах страны',
            },
            {
              icon: icon2,
              title: 'Признание на\u00A0федеральном уровне',
              text: 'Продемонстрируйте свои инновационные методики ведущим экспертам отрасли и\u00A0коллегам со\u00A0всей России',
            },
            {
              icon: icon3,
              title: 'Профессиональный рост',
              text: 'Финалисты конкурса получат уникальные консультации по\u00A0профессиональному росту',
            },
            {
              icon: icon4,
              title: 'Обмен опытом',
              text: 'Участие в\u00A0мастер-классах, обсуждениях с\u00A0экспертами и\u00A0нетворкинг с\u00A0лучшими преподавателями транспортных вузов',
            },
            {
              icon: icon5,
              title: 'Денежный приз',
              text: 'Победители каждой номинации получат денежные призы. Призовой фонд конкурса – 1\u00A0000\u00A0000\u00A0рублей',
            },
            {
              icon: icon6,
              title: 'Международная конференция',
              text: 'Победители представят свой университет на\u00A0Международном форуме в\u00A0рамках Транспортной недели',
            },
          ].map((item, index) => (
            <SwiperSlide style={{ display: 'flex' }} key={index}>
              <div className='advantages__item'>
                <img className='advantages__item-icon' src={item.icon} alt='иконка' />
                <h4 className='advantages__item-title'>{item.title}</h4>
                <h4 className='advantages__item-text'>{item.text}</h4>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Advantages;
