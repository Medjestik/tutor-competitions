import type { FC } from 'react';

import { Link } from 'react-scroll';

import Section from '../../../../../shared/components/Section/ui/Section';
import Button from '../../../../../shared/components/Button/ui/Button';
import { ENAV } from '../../../../../shared/components/Navigation/interface/interface';

import '../styles/style.css';

interface IDescriptionProps {
  windowWidth: number;
}

const Description: FC<IDescriptionProps> = ({ windowWidth }) => {

  const btnStyle = {
    margin: '50px 0 0',
  };

  const mobileBtnStyle = {
    margin: '20px 0 0',
  };

  return (
    <div className='description' id={ENAV.DESCRIPTION}>
      <div className='description__img-container'>
        <div className='description__img'></div>
      </div>
      <Section>
        <div className='description__section'>
          <h2 className='section__title'>Что такое проектные соревнования?</h2>
          <p className='section__subtitle'>Это новый формат студенческих соревнований. Каждая команда получит реальный кейс с описанием действительно существующей проблемы в транспортной отрасли. Следуя шаг за шагом по этапам в личном кабинете вы сможете придумать, как решить описанные проблемы.</p>
          <p className='section__subtitle'>Вам нужно будет разобраться в предложенной ситуации, провести небольшое исследование, предложить новое решение и представить его прототип экспертам.  Это интенсивная, но очень полезная практика, которая готовит к вызовам будущей профессии, помогает лучше понять отрасль и получить востребованный у работодателей опыт.</p>
          <Link to='stages' smooth={true} offset={0} duration={750} spy={true}><Button text='подробнее' width='default' style={windowWidth > 1000 ? btnStyle : mobileBtnStyle} /></Link>
        </div>
      </Section>
    </div>

  );
};

export default Description;
