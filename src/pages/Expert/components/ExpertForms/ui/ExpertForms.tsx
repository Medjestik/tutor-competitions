import type { FC } from 'react';
import type { IItemForm } from '../../../../Person/interface/interface';

import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { getEvaluationStage, materialNames } from '../../../evaluationStage';
import '../../../evaluation-stage.css';

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
  const [searchParams, setSearchParams] = useSearchParams();
  const stage = getEvaluationStage(searchParams);
  const [error, setError] = useState('');

  const [forms, setForms] = useState<IItemForm[]>([]);

  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);

  useEffect(() => {
    let active = true;
    setIsLoadingData(true);
    setForms([]);
    setError('');
    const token = localStorage.getItem('token');
    if (token && nominationId) {
      api.getNominationForms(token, nominationId, stage)
      .then((res) => {
        if (active) setForms(res);
      })
      .catch(() => {
        if (active) setError('Не удалось загрузить практики. Попробуйте выбрать этап ещё раз.');
      })
      .finally(() => { if (active) setIsLoadingData(false); });
    } else {
      setError('Для просмотра практик необходимо войти в систему.');
      setIsLoadingData(false);
    }
    return () => { active = false; };
  }, [nominationId, stage]);

  const handleOpenForm = (form: IItemForm) => {
    navigate(`/person/nomination/${nominationId}/form/${form.id}?stage=${stage}`);
  };

  const backToNominations = () => {
    navigate('/person/menu/nominations');
  };

  return (
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
    <label className='expert-stage-filter'>
      Этап
      <select value={stage} onChange={(event) => {
        const next = new URLSearchParams(searchParams);
        next.set('stage', event.target.value);
        setSearchParams(next);
      }}>
        <option value='qualifying'>Отборочный</option>
        <option value='semifinal'>Полуфинал</option>
      </select>
    </label>
    {error && <p role='alert'>{error}</p>}
    {
      isLoadingData ? <Preloader /> : error ? null : forms.length > 0
      ?
      <ul className='expert__list'>
        {
          forms.map((elem, i) => (
            <li className='expert__item' key={elem.id} onClick={() => handleOpenForm(elem)}>
              <span className='expert__item-count'>{i + 1}.</span>
              <div className='expert__item-info'>
                <div className='expert__item-tags'>
                  {
                    elem.total_evaluations === 0
                    ?
                    <span className='expert__item-tag expert__item-tag_color_red'>Ожидает оценки</span>
                    :
                    <span
                      className={`expert__item-tag ${
                        elem.total_evaluations === 1
                          ? 'expert__item-tag_color_orange'
                          : 'expert__item-tag_color_green'
                      }`}
                    >
                      {`Анкета оценена (${elem.total_evaluations})`}
                    </span>
                  }
                  {
                    elem.is_evaluated &&
                    <span className='expert__item-tag expert__item-tag_color_blue'>Оценена мной</span>
                  }
                </div>
                <h4 className='expert__item-name'>{elem.name}</h4>
                {stage === 'semifinal' && (
                  <p className='expert-material-summary'>
                    Материалы: {elem.second_stage_materials?.count ?? 0}/3
                    {materialNames(elem.second_stage_materials) && ` · ${materialNames(elem.second_stage_materials)}`}
                  </p>
                )}
              </div>
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
