import type { FC } from 'react';
import type { IItemForm } from '../../../../Person/interface/interface';

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Preloader from '../../../../../shared/components/Preloader/ui/Preloader';

import * as api from '../../../../../shared/utils/api';

const ExpertForms: FC = () => {

  const navigate = useNavigate();
  const { nominationId } = useParams();

  const [forms, setForms] = useState<IItemForm[]>([]);

  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);

  const getData = () => {
    setIsLoadingData(true);
    const token = localStorage.getItem('token');
    if (token && nominationId) {
      api.getNominationForms(token, nominationId)
      .then((res) => {
        setForms(res);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setIsLoadingData(false));
    }
  };

  const handleOpenForm = (form: IItemForm) => {
    navigate(`/form/${form.id}`);
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
    {
      forms.length > 0
      ?
      <ul className='expert__list'>
        {
          forms.map((elem, i) => (
            <li className='expert__item' key={i} onClick={() => handleOpenForm(elem)}>
              <span className='expert__item-count'>{i + 1}.</span>
              <div className='expert__item-info'>
                {
                  elem.is_evaluated
                  ?
                    <span className='expert__item-tag'>Оценена</span>
                  :
                    <span className='expert__item-tag expert__item-tag_type_wait'>Ожидает оценки</span>
                }
                <h4 className='expert__item-name'>{elem.name}</h4>
              </div>
              {
                elem.is_evaluated &&
                <span className='expert__item-score'>{elem.average_score}</span>
              }
            </li>
          ))
        }
      </ul>
      :
      <p className='expert__empty'>Список анкет пуст.</p>
    }
    </>
  );
};

export default ExpertForms;
