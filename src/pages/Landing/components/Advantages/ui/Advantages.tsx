import type { FC } from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

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
              icon: '',
              title: 'Масштабирование опыта',
              text: 'Лучшие практики будут рекомендованы к\u00A0распространению в\u00A0других вузах страны',
            },
            {
              icon: '',
              title: 'Признание на\u00A0международном уровне',
              text: 'Продемонстрируйте свои методики ведущим экспертам отрасли и\u00A0коллегам со\u00A0всего мира',
            },
            {
              icon: '',
              title: 'Обмен опытом',
              text: 'Участие в\u00A0обсуждениях с\u00A0экспертами и\u00A0нетворкинг с\u00A0лучшими преподавателями транспортных вузов',
            },
            {
              icon: '',
              title: 'Денежный приз',
              text: 'Победители каждой номинации получат денежные призы. Призовой фонд конкурса – 1\u00A0000\u00A0000\u00A0рублей',
            },
            {
              icon: '',
              title: 'Повышение квалификации',
              text: 'Пройдите бесплатное повышение квалификации по\u00A0инженерной дидактике прямо в\u00A0личном кабинете участника конкурса',
            },
          ].map((item, index) => (
            <SwiperSlide style={{ display: 'flex' }} key={index}>
              <div className='advantages__item'>
                <img className='advantages__item-icon' src={item.icon} alt='icon' />
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
