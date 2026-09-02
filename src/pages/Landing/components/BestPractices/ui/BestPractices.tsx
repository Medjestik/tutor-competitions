import type { FC } from 'react';

import { useState } from 'react';

import Button from '../../../../../shared/components/Button/ui/Button';
import { ENAV } from '../../../../../shared/components/Navigation/interface/interface';

import '../styles/style.css';

const slides = [
  {
    id: 1,
    title: 'Педагогический приём',
    caption: 'Лучшие практики сезона 2025',
  },
  {
    id: 2,
    title: 'Партнёрство и инновации',
    caption: 'Лучшие практики сезона 2025',
  },
  {
    id: 3,
    title: 'Территория роста',
    caption: 'Лучшие практики сезона 2025',
  },
];

const BestPractices: FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slide = slides[currentIndex];

  const showPrev = () => {
    setCurrentIndex((index) => (index === 0 ? slides.length - 1 : index - 1));
  };

  const showNext = () => {
    setCurrentIndex((index) => (index === slides.length - 1 ? 0 : index + 1));
  };

  return (
    <section className='best-practices' id={ENAV.BEST_PRACTICES}>
      <h2 className='best-practices__title'>ЛУЧШИЕ ПРАКТИКИ 2025 ГОДА</h2>
      <div className='best-practices__slider'>
        <button
          type='button'
          className='best-practices__arrow best-practices__arrow_prev'
          onClick={showPrev}
          aria-label='Предыдущий слайд'
        >
          ‹
        </button>
        <div className='best-practices__slide'>
          <p className='best-practices__slide-caption'>{slide.caption}</p>
          <p className='best-practices__slide-title'>{slide.title}</p>
        </div>
        <button
          type='button'
          className='best-practices__arrow best-practices__arrow_next'
          onClick={showNext}
          aria-label='Следующий слайд'
        >
          ›
        </button>
      </div>
      <div className='best-practices__footer'>
        <p className='best-practices__text'>
          Хотите ознакомиться с результатами подробнее? Скачайте итоги конкурса в удобном формате.
        </p>
        <Button
          text='Скачать итоги конкурса'
          type='link'
          href='https://cloud.mail.ru/public/K46H/qmUUPH3Wz'
          color='gradient'
        />
      </div>
    </section>
  );
};

export default BestPractices;
