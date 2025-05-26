import type { FC} from 'react';
import type { IFormData, ICriteria } from '../../../../Person/interface/interface';
import type { IExpertFormPageProps } from '../../../interface/interface';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import * as api from '../../../../../shared/utils/api';

import MainLayout from '../../../../../shared/components/Layout/ui/MainLayout';
import PersonContainer from '../../../../Person/components/PersonContainer/ui/PersonContainer';
import FormField from '../../../../../shared/components/Form/components/FormField/ui/FormField';
import Button from '../../../../../shared/components/Button/ui/Button';
import Preloader from '../../../../../shared/components/Preloader/ui/Preloader';
import SetScorePopup from '../../../../../shared/components/Popup/ui/SetScorePopup';

import { nominationFieldTexts } from '../../../../Person/components/PersonStage/utils/nominationFields';

import '../styles/style.css';

const btnFilesStyle = {
  margin: '0',
  height: '40px',
  fontSize: '20px',
  lineHeight: '20px',
};

const ExpertFormPage: FC<IExpertFormPageProps> = ({ windowWidth, onLogout }) => {

  const navigate = useNavigate();

  const { formId } = useParams();
  const [form, setForm] = useState<IFormData | null>(null);

  const [isOpenSetScorePopup, setIsOpenSetScorePopup] = useState<boolean>(false);

  const [isLoadingScore, setIsLoadingScore] = useState<boolean>(false);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);

  const texts = useMemo(() => {
    return nominationFieldTexts[form?.nomination ?? 1];
  }, [form?.nomination]);

  const openSetScorePopup = () => {
    setIsOpenSetScorePopup(true);
  };

  const closePopup = () => {
    setIsOpenSetScorePopup(false);
  };

  const backToNominations = () => {
    navigate('/person');
  };

  const handleScoreForm = (data: ICriteria[]) => {
    setIsLoadingScore(true);
    const token = localStorage.getItem('token');
    if (token) {
      const evaluations = data.map((elem) => ({
        score: elem.expert_score.toString(),
        criteria: elem.id,
        participant_form: formId,
        comment: ''
      }));
  
      api.scoreForm(token, evaluations)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setIsLoadingData(false));
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
    <MainLayout mainContainer={false} windowWidth={windowWidth} onLogout={onLogout} > 
      <div className='person'>
        <PersonContainer>
        {
            form &&
            <>
              <FormField title='1. Номинация'>
                <p className='form__text-view'>{form.nomination}</p>
              </FormField>

              <FormField title={texts.name.title} subtitle={texts.name.subtitle}>
                <p className='form__text-view'>{form.name}</p>
              </FormField>
    
              <FormField title={texts.task.title} subtitle={texts.task.subtitle}>
                <p className='form__text-view'>{form.task}</p>
              </FormField>
    
              <FormField title={texts.description.title} subtitle={texts.description.subtitle}>
                <p className='form__text-view'>{form.description}</p>
              </FormField>
    
              <FormField title={texts.originality.title} subtitle={texts.originality.subtitle}>
                <p className='form__text-view'>{form.originality}</p>
              </FormField>

              <FormField title={texts.text.title} subtitle={texts.text.subtitle}>
                <p className='form__text-view'>{form.text}</p>
              </FormField>

              <FormField title={texts.usability.title} subtitle={texts.usability.subtitle}>
                <p className='form__text-view'>{form.usability}</p>
              </FormField>
    
    
              <FormField title={texts.files.title} subtitle={texts.files.subtitle}>
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
                          link={elem.type === 'link' ? elem.link : elem.file} 
                          color='secondary'
                        />
                      </li>
                    ))
                    }
                  </ul>
                  :
                  <span className='person-stage__file-empty'>Список источников пока пуст.</span>
                }
              </FormField>
              <div className='form__input-field'>
                <Button onClick={backToNominations} text='Вернуть к номинациям' style={btnFilesStyle} color='cancel' />
                <Button onClick={openSetScorePopup} text='Оценить анкету' style={btnFilesStyle} color='secondary' />
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
        </PersonContainer>
      </div>
    </MainLayout>
  );
};

export default ExpertFormPage;
