import type { FC } from 'react';
import type { INomination } from '../../../../Person/interface/interface';

import * as api from '../../../../../shared/utils/api';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Preloader from '../../../../../shared/components/Preloader/ui/Preloader';
import Button from '../../../../../shared/components/Button/ui/Button';

import '../styles/style.css';

const btnStyle = {
  width: '100%',
  margin: 'auto 0 0 0',
  fontSize: '16px',
  height: '40px',
  borderRadius: '12px',
  lineHeight: '16px',
  padding: '6px 14px',
};


const ExpertNominations: FC = () => {

  const navigate = useNavigate();

  const [nominations, setNominations] = useState<INomination[]>([]);

  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);

  const getData = () => {
    setIsLoadingData(true);
    const token = localStorage.getItem('token');
    if (token) {
      api.getNominations(token)
      .then((res) => {
        setNominations(res);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setIsLoadingData(false));
    }
  };

    const handleOpenNomination = (nomination: INomination) => {
      navigate(`/person/nomination/${nomination.id}`);
    };

  useEffect(() => {
    getData();
  }, []);

  return (
    isLoadingData 
    ?
    <Preloader />
    :
    <>
      <h2 className='expert__title'>Выберите номинацию для оценки анкет</h2>
      <ul className='expert-nominations__list'>
        {nominations.map((elem, i) => (
          <li className='expert-nominations__item' key={i}>
            <div className={`expert-nomination__item-icon expert-nomination__item-icon_type_${elem.id}`}></div>
            <h4 className='expert-nomination__item-text'>{elem.name}</h4>
            <p className='expert-nomination__item-caption'>Количество анкет: {elem.total_forms}</p>
            <Button text='Выбрать' onClick={() => handleOpenNomination(elem)} style={btnStyle} />
          </li>
        ))}
      </ul>
    </>
  );
};

export default ExpertNominations;
