import type { FC } from 'react';
import type { IExpertProps } from '../interface/interface';
import type { INomination, IItemForm } from '../../Person/interface/interface';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import * as api from '../../../shared/utils/api';

import MainLayout from '../../../shared/components/Layout/ui/MainLayout';
import Preloader from '../../../shared/components/Preloader/ui/Preloader';
import PersonContainer from '../../Person/components/PersonContainer/ui/PersonContainer';
import SelectWithSearch from '../../../shared/components/Select/ui/SelectWithSearch';

import '../styles/style.css';

const Expert: FC<IExpertProps> = ({ windowWidth, onLogout }) => {

  const navigate = useNavigate();

  const [nominations, setNominations] = useState<INomination[]>([]);
  const [currentNomination, setCurrentNomination] = useState<INomination>({ name: 'Выберите номинацию..', id: 0 });
  const [isShowNominationData, setIsShowNominationData] = useState<boolean>(false);

  const [forms, setForms] = useState<IItemForm[]>([]);

  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);
  const [isLoadingForms, setIsLoadingForms] = useState<boolean>(true);

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

  const getNominationFormsData = (id: number) => {
    setIsLoadingForms(true);
    const token = localStorage.getItem('token');
    if (token) {
      api.getNominationForms(token, id)
      .then((res) => {
        setForms(res);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setIsLoadingForms(false));
    }
  };

  const handleChangeNomination = (option: INomination) => {
    setCurrentNomination(option);
    setIsShowNominationData(true);
    getNominationFormsData(option.id);
  };

  const handleOpenForm = (form: IItemForm) => {
    navigate(`/form/${form.id}`);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <MainLayout mainContainer={false} windowWidth={windowWidth} onLogout={onLogout} > 
      <div className='person'>
        <PersonContainer>
          {
            isLoadingData
            ?
            <Preloader />
            :
            <>
            <div className='expert'>
              <h2 className='expert__title'>Выберите номинацию для оценки анкет:</h2>
              <SelectWithSearch options={nominations} currentOption={currentNomination} onChooseOption={handleChangeNomination} />
              {
                isShowNominationData &&
                <>
                {
                  isLoadingForms
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
                }
                </>
              }
            </div>
            </>
          }
        </PersonContainer>
      </div>
    </MainLayout>
  );
};

export default Expert;
