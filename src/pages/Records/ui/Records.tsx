import type { FC } from 'react';
import type { ISelectNomination } from '../../Person/interface/interface';

import { useState, useEffect } from 'react';

import MainLayout from '../../../shared/components/Layout/ui/MainLayout';
import Preloader from '../../../shared/components/Preloader/ui/Preloader';

import * as api from '../../../shared/utils/api';

import '../styles/style.css';

interface IRecordsProps {
  windowWidth: number;
}

const cards = [
  { name: 'Северные конвои – патриотическое воспитание в курсе ESP', id: 1, nominationId : 1, organization: 'ГУМРФ им.адм. С.О. Макарова', category: 1, link: 'https://pruffme.com/landing/u2634840/1', },
  { name: 'Игра‑тренажёр «Повышение эффективности ремонта подвижного состава»', id: 2, nominationId : 3, organization: 'РУТ (МИИТ)', category: 2, link: 'https://pruffme.com/landing/u2634840/1', },
  { name: 'Игра‑тренажёр «Повышение эффективности ремонта подвижного состава»', id: 2, nominationId : 3, organization: 'РУТ (МИИТ)', category: 3, link: 'https://pruffme.com/landing/u2634840/1', },
  { name: 'Северные конвои – патриотическое воспитание в курсе ESP', id: 3, nominationId : 1, organization: 'ГУМРФ им.адм. С.О. Макарова', category: 4, link: 'https://pruffme.com/landing/u2634840/1', },
  { name: 'Игра‑тренажёр «Повышение эффективности ремонта подвижного состава»', id: 4, nominationId : 3, organization: 'РУТ (МИИТ)', category: 5, link: 'https://pruffme.com/landing/u2634840/1', },
  { name: 'Северные конвои – патриотическое воспитание в курсе ESP', id: 5, nominationId : 1, organization: 'ГУМРФ им.адм. С.О. Макарова', category: 6, link: 'https://pruffme.com/landing/u2634840/1', },
  { name: 'Игра‑тренажёр «Повышение эффективности ремонта подвижного состава»', id: 6, nominationId : 3, organization: 'РУТ (МИИТ)', category: 7, link: 'https://pruffme.com/landing/u2634840/1', },
];

const Records: FC<IRecordsProps> = ({ windowWidth }) => {

  const [nominations, setNominations] = useState<ISelectNomination[]>([]);
  const [currentNomination, setCurrentNomination] = useState<ISelectNomination | null>(null);

  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);

  const getData = () => {
    setIsLoadingData(true);
    Promise.all([
      api.getNominations(),
    ])
      .then(([nominationsRes]) => {
        setNominations(nominationsRes);
        setCurrentNomination(null);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setIsLoadingData(false));
  };

  const handleSelectNomination = (elem: ISelectNomination) => {
    if (currentNomination?.id === elem.id) {
      setCurrentNomination(null);
    } else {
      setCurrentNomination(elem);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
    <MainLayout windowWidth={windowWidth} isLoggedIn={false} >
      {
        isLoadingData
        ?
        <Preloader />
        :
        <>
        <h1 className='records__title'>Каталог лучших педагогических практик</h1>
        <p className='records__subtitle'>Полуфинал «Лидеров транспортного образования» — это результат большой и кропотливой работы талантливых преподавателей из разных вузов страны. Каждый участник тщательно готовил анкету своей педагогической практики, детально описывая оригинальные подходы и методы, которые применяет в своей профессиональной деятельности. Эти практики были представлены в формате онлайн-мастер-классов, для того, чтобы коллеги из разных регионов могли познакомиться с уникальным опытом, обсудить идеи и задать вопросы.</p>
        <p className='records__subtitle'>На этой странице собраны лучшие работы полуфиналистов — уникальные и вдохновляющие примеры современной педагогики в транспортной отрасли. Мы приглашаем всех заинтересованных ознакомиться с этими материалами, почерпнуть новые знания и вдохновение для собственной работы.</p>
        
        {
          nominations.length > 0 &&
          <ul className='records__nomination-list'>
            {
              nominations.map((elem) => (
                <li className={`records__nomination-item ${currentNomination?.id === elem.id ? 'records__nomination-item_type_active': ''}`} onClick={() => handleSelectNomination(elem)} key={elem.id}>{elem.name}</li>
              ))
            }
          </ul>
        }

        {
          (() => {
            const filteredCards = currentNomination
              ? cards.filter((card) => card.nominationId === currentNomination.id)
              : cards;

            return filteredCards.length > 0 ? (
              <div className='records__card-list'>
                {filteredCards.map((card) => (
                  <a className='records__card-item' key={card.id} href={card.link} target='_blank' rel='noreferrer'>
                    <div className={`records__card-item-img records__card-item-img_type_${card.category}`}></div>
                    <p className='records__card-item-caption'>{card.organization}</p>
                    <h4 className='records__card-item-title'>{card.name}</h4>
                  </a>
                ))}
              </div>
            ) : (
              <p className='records__card-empty'>Список пока пуст</p>
            );
          })()
        }

        </>
      }
    </MainLayout>
    </>
  );
};

export default Records; 
