/* eslint-disable @typescript-eslint/no-unused-vars */
import type { FC} from 'react';
import type { IFormData, IScoreItem } from '../../../../Person/interface/interface';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import * as api from '../../../../../shared/utils/api';

import Button from '../../../../../shared/components/Button/ui/Button';
import Preloader from '../../../../../shared/components/Preloader/ui/Preloader';
import SetScorePopup from '../../../../../shared/components/Popup/ui/SetScorePopup';

import { nominationFieldTexts } from '../../../../Person/components/PersonStage/utils/nominationFields';

import '../styles/style.css';

const btnFilesStyle = {
  margin: '0',
  height: '32px',
  fontSize: '16px',
  lineHeight: '16px',
};

const btnLinksStyle = {
  margin: '0 0 0 auto',
  fontSize: '18px',
  height: '40px',
  borderRadius: '12px',
  lineHeight: '18px',
  padding: '8px 20px',
};

const ExpertFormPage: FC = () => {

  const navigate = useNavigate();

  const { nominationId, formId } = useParams();
  const [form, setForm] = useState<IFormData | null>(null);

  const [isOpenSetScorePopup, setIsOpenSetScorePopup] = useState<boolean>(false);

  const [isLoadingScore, setIsLoadingScore] = useState<boolean>(false);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);

  const texts = useMemo(() => {
    return nominationFieldTexts[form?.nomination ?? 1];
  }, [form?.nomination]);

  const totalScore = useMemo(() => {
    if (!form) return 0;
    return form.evaluation_details.reduce((sum, criteria) => {
      return sum + criteria.indicators.reduce((innerSum, indicator) => {
        return innerSum + (indicator.score ?? 0);
      }, 0);
    }, 0);
  }, [form]);

  const openSetScorePopup = () => {
    setIsOpenSetScorePopup(true);
  };

  const closePopup = () => {
    setIsOpenSetScorePopup(false);
  };

  const backToForms = () => {
    navigate(`/person/nomination/${nominationId}`);
  };

  const handleScoreForm = (data: IScoreItem[]) => {
    setIsLoadingScore(true);
    const token = localStorage.getItem('token');
    if (token) {
      api.scoreForm(token, data)
      .then((res) => {
        setForm(prev => prev ? { ...prev, evaluation_details: res } : prev);
        closePopup();
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setIsLoadingScore(false));
    }
  };

  const getData = () => {
    setIsLoadingData(true);
    const token = localStorage.getItem('token');
    if (token && formId) {
      api.getExpertForm(token, formId)
      .then((res) => {
        console.log(res);
        setForm(res);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setIsLoadingData(false));
    }
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
        form &&
        <>
        <div className='expert-form__data'> 
          <div className={`expert-form__img expert-form__img_type_${form.nomination}`}></div>
          <div className='expert-form__info'>
            <span className='expert-form__nomination'>{form.nomination_name}</span>
            <h4 className='expert-form__name'>{form.name}</h4>
            <p className='expert-form__score'>Текущая оценка - {totalScore}</p>
            <div className='form__input-field'>
              <Button onClick={backToForms} text='Вернуться к списку' style={btnFilesStyle} color='default' />
              <Button onClick={openSetScorePopup} text='Оценить анкету' style={btnFilesStyle} color='primary' />
            </div>
          </div>
        </div>
        <div className='expert-form__container'>
        {
          /*
          <FormField title='Образовательная организация'>
            <p className='form__text-view'>{form.educational_organization}</p>
          </FormField>

          <FormField title={texts.task.title}>
            <p className='form__text-view'>{form.task}</p>
          </FormField>

          <FormField title={texts.description.title}>
            <p className='form__text-view'>{form.description}</p>
          </FormField>

          <FormField title={texts.originality.title}>
            <p className='form__text-view'>{form.originality}</p>
          </FormField>

          <FormField title={texts.text.title}>
            <p className='form__text-view'>{form.text}</p>
          </FormField>

          <FormField title={texts.usability.title}>
            <p className='form__text-view'>{form.usability}</p>
          </FormField>

          <FormField title={texts.files.title}>
            <h3 className='person-stage__title-row'>Прикрепленные источники:</h3>
            {
              form && form.resources.length > 0
              ?
              <ul className='person-stage__file-list'>
                { form.resources.map((elem, i) => (
                  <li className='person-stage__file-item' key={i}>
                    <span className='person-stage__file-count'>{i + 1}.</span>
                    <h4 className='person-stage__file-title'>{elem.description}</h4>
                    <Button 
                      text='Ссылка' 
                      type='link' 
                      href={elem.type === 'link' ? elem.link : elem.file} 
                      color='primary'
                      style={btnLinksStyle}
                    />
                  </li>
                ))
                }
              </ul>
              :
              <span className='person-stage__file-empty'>Список источников пока пуст.</span>
            }
          </FormField>
          */
        }


        </div>
        </>
      }
      {
        isOpenSetScorePopup && form &&
        <SetScorePopup 
          isOpen={isOpenSetScorePopup}
          onClose={closePopup}
          form={form}
          isLoading={isLoadingScore}
          onScore={handleScoreForm}
        />
      }
    </>
  );
};

export default ExpertFormPage;
