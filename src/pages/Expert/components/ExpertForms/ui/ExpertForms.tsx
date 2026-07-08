import type { FC } from 'react';
import type { IItemForm } from '../../../../Person/interface/interface';

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Preloader from '../../../../../shared/components/Preloader/ui/Preloader';
import Button from '../../../../../shared/components/Button/ui/Button';

import { nominationMap } from '../../../../../shared/utils/nominations';

import * as api from '../../../../../shared/utils/api';

const btnFilesStyle = {
  margin: '0',
  height: '32px',
  fontSize: '16px',
  lineHeight: '16px',
};

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
    navigate(`/person/nomination/${nominationId}/form/${form.id}`);
  };

  const backToNominations = () => {
    navigate('/person/menu/nominations');
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
    <div className='expert-form__data'> 
      <div className={`expert-form__img expert-form__img_type_${nominationId}`}></div>
      <div className='expert-form__info'>
        <h4 className='expert-form__name'>{nominationId ? nominationMap[Number(nominationId)] : ''}</h4>
        <p className='expert-form__score'>Количество анкет: {forms.length}</p>
        <div className='form__input-field'>
          <Button onClick={backToNominations} text='Вернуться к списку' style={btnFilesStyle} color='default' />
        </div>
      </div>
    </div>
    {
      forms.length > 0
      ?
      <ul className='expert__list'>
        {
          forms.map((elem, i) => (
            <li className='expert__item' key={i} onClick={() => handleOpenForm(elem)}>
              <span className='expert__item-count'>{i + 1}.</span>
              <div className='expert__item-info'>
                <div className='expert__item-tags'>
                  {
                    elem.total_evaluations === 0 
                    ?
                    <span className='expert__item-tag expert__item-tag_color_red'>Ожидает оценки</span>
                    :
                    elem.total_evaluations === 1
                    ?
                    <span className='expert__item-tag expert__item-tag_color_orange'>Требуется еще 1 оценка</span>
                    :
                    <span className='expert__item-tag expert__item-tag_color_green'>Анкета оценена</span>
                  }
                  {
                    elem.is_evaluated &&
                    <span className='expert__item-tag expert__item-tag_color_blue'>Оценена мной</span>
                  }
                </div>
                <h4 className='expert__item-name'>{elem.name}</h4>
              </div>
              <span className='expert__item-score'>{elem.average_score || ''}</span>
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
