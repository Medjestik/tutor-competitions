/* eslint-disable @typescript-eslint/no-unused-vars */
import type { FC } from 'react';
import type { IUploadLink, IUploadFile } from '../../../../../shared/components/Popup/interface/interface';
import type { IStageFormProps, ISelectNomination, IFormData } from '../../../interface/interface';

import { useState, useEffect } from 'react';

import * as api from '../../../../../shared/utils/api';

import PersonVideo from '../../PersonVideo/ui/PersonVideo';
import SelectWithSearch from '../../../../../shared/components/Select/ui/SelectWithSearch';
import Preloader from '../../../../../shared/components/Preloader/ui/Preloader';
import Button from '../../../../../shared/components/Button/ui/Button';
import { nominationFieldTexts } from '../utils/nominationFields';

import '../styles/style.css';

const btnFilesStyle = {
  margin: '0',
  height: '40px',
  fontSize: '18px',
  lineHeight: '18px',
  borderRadius: '12px',
};

const btnLinksStyle = {
  margin: '0 0 0 auto',
  fontSize: '16px',
  height: '40px',
  borderRadius: '12px',
  lineHeight: '16px',
  padding: '6px 14px',
};

const btnRemoveStyle = {
  margin: '0 0 0 8px',
  fontSize: '16px',
  height: '40px',
  borderRadius: '12px',
  lineHeight: '16px',
  padding: '6px 14px',
  backgroundColor: '#E5A100',
  border: '1px solid #E5A100',
};


const PersonStageForm: FC<IStageFormProps> = ({ onNextStage }) => {

  const [formData, setFormData] = useState<IFormData | null>(null);
  const [nominations, setNominations] = useState<ISelectNomination[]>([]);
  const [currentNomination, setCurrentNomination] = useState<ISelectNomination>({ name: 'Выберите номинацию..', id: 0 });
  const [isBlockButtonNomination, setIsBlockButtonNomination] = useState<boolean>(true);

  const texts = nominationFieldTexts[currentNomination.id] || nominationFieldTexts[1];

  const [isOpenUploadLinkPopup, setIsOpenUploadLinkPopup] = useState<boolean>(false);
  const [isOpenUploadFilePopup, setIsOpenUploadFilePopup] = useState<boolean>(false);

  const [isLoadingRequest, setIsLoadingRequest] = useState<boolean>(false);
  const [isShowRequestError, setIsShowRequestError] = useState<boolean>(false);

  const [isShowForm, setIsShowForm] = useState<boolean>(false);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);

  const handleChangeNomination = (option: ISelectNomination) => {
    setCurrentNomination(option);
    setIsShowForm(false);
    setIsBlockButtonNomination(false);
  };

  const handleSaveNomination = () => {
    const token = localStorage.getItem('token');
    if (token) {
      api.setNomination(token, currentNomination.id)
      .then((res) => {
        setFormData(res);
        setIsShowForm(true);
        setIsBlockButtonNomination(true);
      })
      .catch((err) => {
        console.error(err);
      });
    }
  };

  const handleUploadLink = (data: IUploadLink) => {
    setIsShowRequestError(false);
    setIsLoadingRequest(true);
    const token = localStorage.getItem('token');
    if (token) {
      api.uploadLink(token, data)
      .then((res) => {
        if (formData) {
          setFormData({...formData, resources: [...formData.resources, res]});
        }
        closePopup();
      })
      .catch((err) => {
        console.error(err);
        setIsShowRequestError(true);
        console.log(onNextStage);
      })
      .finally(() => {
        setIsLoadingRequest(false);
      });
    }
  };

  const openUploadLinkPopup = () => {
    setIsOpenUploadLinkPopup(true);
  };

  const handleUploadFile = (data: IUploadFile) => {
    setIsShowRequestError(false);
    setIsLoadingRequest(true);
    const token = localStorage.getItem('token');
    if (token) {
      api.uploadFile(token, data)
      .then((res) => {
        if (formData) {
          setFormData({...formData, resources: [...formData.resources, res]});
        }
        closePopup();
      })
      .catch((err) => {
        console.error(err);
        setIsShowRequestError(true);
      })
      .finally(() => {
        setIsLoadingRequest(false);
      });
    }
  };

  const openUploadFilePopup = () => {
    setIsOpenUploadFilePopup(true);
  };

  const handleRemoveMaterial = (id: string) => {
    const token = localStorage.getItem('token');
    if (token && formData) {
      api.removeMaterial(token, id)
        .then(() => {
          console.log(id);
          console.log(formData);
          const updatedResources = formData.resources.filter((res) => res.id.toString() !== id);
          setFormData({ ...formData, resources: updatedResources });
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const closePopup = () => {
    setIsOpenUploadLinkPopup(false);
    setIsOpenUploadFilePopup(false);
    setIsShowRequestError(false);
  };

  const getData = () => {
    setIsLoadingData(true);
    const token = localStorage.getItem('token');
  
    if (token) {
      Promise.all([
        api.getNominations(),
        api.getFormData(token),
      ])
        .then(([nominationsRes, formDataRes]) => {
          const foundNomination = nominationsRes.find((elem: ISelectNomination  ) => elem.id === formDataRes.nomination);
          if (foundNomination) {
            setCurrentNomination(foundNomination);
            setIsShowForm(true);
          }
          setNominations(nominationsRes);
          setFormData(formDataRes);
          // nameInput.setValue(formDataRes.name || '');
          // taskInput.setValue(formDataRes.task || '');
          // descriptionInput.setValue(formDataRes.description || '');
          // originalityInput.setValue(formDataRes.originality || '');
          // textInput.setValue(formDataRes.text || '');
          // usabilityInput.setValue(formDataRes.usability || '');
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
    <div className='person-stage'>
      {
        isLoadingData
        ?
        <Preloader />
        :
        <>
        {
          formData &&
          (
            <>
            <h2 className='person-stage__title'>Анкета практики</h2>
            <div className='person-stage__container'>
              <div className='person-stage__info'>
                <p className='person-stage__subtitle'>Для описания практики заполните анкету. Перед этим рекомендуем посмотреть видеоинструкцию.</p>
                <p className='person-stage__subtitle'>Если у вас нет вопросов или трудностей, можете сразу приступать к заполнению.</p>
              </div>
              <PersonVideo url='https://course.emiit.ru/webtutor/ivan/land/video/video2.mp4' />
            </div>
            {
              formData.status === 'draft'
              ?
              {
                /*
                              <Form formName={'stage-form'}>
                <FormField title='1. Выбор номинации' subtitle='Выберите номинацию и нажмите кнопку "Сохранить".'>
                  <div className='form__input-field'>
                    <SelectWithSearch options={nominations} currentOption={currentNomination} onChooseOption={handleChangeNomination} />
                    <FormFieldButton onClick={handleSaveNomination} isBlock={isBlockButtonNomination} />
                  </div>
                </FormField>
                {
                  isShowForm &&
                  <>
                  <FormField title={texts.name.title} subtitle={texts.name.subtitle}>
                    <div className='form__input-field'>
                      <FormInputString 
                        value={nameInput.value}
                        placeholder='Введите название практики..'
                        onChange={nameInput.handleChange}
                      />
                      <FormFieldButton onClick={nameInput.handleSave} isBlock={nameInput.isBlocked} />
                    </div>
                    <FormFieldError isShow={nameInput.error.isShow} text={nameInput.error.text} type={nameInput.error.type} />
                  </FormField>

                  <FormField title={texts.task.title} subtitle={texts.task.subtitle}>
                    <div className='form__input-field'>
                      <FormTextArea 
                        value={taskInput.value}
                        placeholder='Введите текст..'
                        onChange={taskInput.handleChange}
                      />
                      <FormFieldButton onClick={taskInput.handleSave} isBlock={taskInput.isBlocked} />
                    </div>
                    <FormFieldError isShow={taskInput.error.isShow} text={taskInput.error.text} type={taskInput.error.type} />
                  </FormField>

                  <FormField title={texts.description.title} subtitle={texts.description.subtitle}>
                    <div className='form__input-field'>
                      <FormTextArea 
                        value={descriptionInput.value}
                        placeholder='Введите текст..'
                        onChange={descriptionInput.handleChange}
                      />
                      <FormFieldButton onClick={descriptionInput.handleSave} isBlock={descriptionInput.isBlocked} />
                    </div>
                    <FormFieldError isShow={descriptionInput.error.isShow} text={descriptionInput.error.text} type={descriptionInput.error.type} />
                  </FormField>

                  <FormField title={texts.originality.title} subtitle={texts.originality.subtitle}>
                    <div className='form__input-field'>
                      <FormTextArea 
                        value={originalityInput.value}
                        placeholder='Введите текст..'
                        onChange={originalityInput.handleChange}
                      />
                      <FormFieldButton onClick={originalityInput.handleSave} isBlock={originalityInput.isBlocked} />
                    </div>
                    <FormFieldError isShow={originalityInput.error.isShow} text={originalityInput.error.text} type={originalityInput.error.type} />
                  </FormField>

                  <FormField title={texts.text.title} subtitle={texts.text.subtitle}>
                    <div className='form__input-field'>
                      <FormTextArea 
                        value={textInput.value}
                        placeholder='Введите текст..'
                        onChange={textInput.handleChange}
                      />
                      <FormFieldButton onClick={textInput.handleSave} isBlock={textInput.isBlocked} />
                    </div>
                    <FormFieldError isShow={textInput.error.isShow} text={textInput.error.text} type={textInput.error.type} />
                  </FormField>

                  <FormField title={texts.usability.title} subtitle={texts.usability.subtitle}>
                    <div className='form__input-field'>
                      <FormTextArea 
                        value={usabilityInput.value}
                        placeholder='Введите текст..'
                        onChange={usabilityInput.handleChange}
                      />
                      <FormFieldButton onClick={usabilityInput.handleSave} isBlock={usabilityInput.isBlocked} />
                    </div>
                    <FormFieldError isShow={usabilityInput.error.isShow} text={usabilityInput.error.text} type={usabilityInput.error.type} />
                  </FormField>

                  <FormField title={texts.files.title} subtitle={texts.files.subtitle}>
                    <div className='form__input-field'>
                      <Button onClick={openUploadLinkPopup} text='Прикрепить ссылку' style={btnFilesStyle} color='primary' />
                      <Button onClick={openUploadFilePopup} text='Добавить файл' style={btnFilesStyle} color='primary' />
                    </div>
                    <h3 className='person-stage__title-row'>Прикрепленные источники:</h3>
                    {
                      formData.resources && formData.resources.length > 0
                      ?
                      <ul className='person-stage__file-list'>
                        { formData.resources.map((elem, i) => (
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
                            <Button 
                              text='Удалить' 
                              style={btnRemoveStyle} 
                              onClick={() => handleRemoveMaterial(elem.id.toString())}
                            />
                          </li>
                        ))
                        }
                      </ul>
                      :
                      <span className='person-stage__file-empty'>Список источников пока пуст.</span>
                    }
                  </FormField>
                  </>
                }
              </Form>
              */
              }

              :
              <>
              <h4 className='person-stage__row-title'>Спасибо! Анкета практики успешно отправлена.</h4>
              <p className='person-stage__row-subtitle'>Вы прошли в следующий этап Всероссийского конкурса лучших педагогических практик «Лидеры транспортного образования».</p>
              <p className='person-stage__row-subtitle'>Выберите удобное время для проведения онлайн-мастер-класса (кнопка «02»).</p>
              </>
            }
            </>
          )
        }
        </>
      }
    </div>
  );
};

export default PersonStageForm;
