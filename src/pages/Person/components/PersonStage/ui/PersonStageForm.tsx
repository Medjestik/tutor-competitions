import type { FC, FormEvent } from 'react';
import type { IUploadLink, IUploadFile } from '../../../../../shared/components/Popup/interface/interface';
import type { IStageFormProps, INomination, IFormData } from '../../../interface/interface';

import { useState, useEffect } from 'react';

import * as api from '../../../../../shared/utils/api';

import PersonVideo from '../../PersonVideo/ui/PersonVideo';
import SelectWithSearch from '../../../../../shared/components/Select/ui/SelectWithSearch';
import Form from '../../../../../shared/components/Form/ui/Form';
import FormField from '../../../../../shared/components/Form/components/FormField/ui/FormField';
import FormFieldButton from '../../../../../shared/components/Form/components/FormField/ui/FormFieldButton';
import FormFieldError from '../../../../../shared/components/Form/components/FormField/ui/FormFieldError';
import FormTextArea from '../../../../../shared/components/Form/components/FormTextArea/ui/FormTextArea';
import FormInputString from '../../../../../shared/components/Form/components/FormInput/ui/FormInputString';
import FormSubmit from '../../../../../shared/components/Form/components/FormSubmit/ui/FormSubmit';
import Preloader from '../../../../../shared/components/Preloader/ui/Preloader';
import Button from '../../../../../shared/components/Button/ui/Button';
import UploadLinkPopup from '../../../../../shared/components/Popup/ui/UploadLinkPopup';
import UploadFilePopup from '../../../../../shared/components/Popup/ui/UploadFilePopup';

import { useFormInput } from '../../../../../shared/hooks/useFormInput';
import { nominationFieldTexts } from '../utils/nominationFields';

import '../styles/style.css';

const btnFilesStyle = {
  margin: '0',
  height: '40px',
  fontSize: '20px',
  lineHeight: '20px',
};

const btnLinksStyle = {
  margin: '0 0 0 auto',
  fontSize: '18px',
  height: '40px',
  borderRadius: '12px',
  lineHeight: '18px',
  padding: '8px 20px',
};

const btnNextStageStyle = {
  margin: '20px 0 0 0',
  fontSize: '24px',
  lineHeight: '24px',
  padding: '8px 20px',
};

const PersonStageForm: FC<IStageFormProps> = ({ onNextStage }) => {
  const nameInput = useFormInput('', api.saveFormName, 200);
  const taskInput = useFormInput('', api.saveFormTask, 2000);
  const descriptionInput = useFormInput('', api.saveFormDescription, 2000);
  const originalityInput = useFormInput('', api.saveFormOriginality, 2000);
  const textInput = useFormInput('', api.saveFormText, 2000);
  const usabilityInput = useFormInput('', api.saveFormUsability, 2000);

  const [formData, setFormData] = useState<IFormData | null>(null);
  const [nominations, setNominations] = useState<INomination[]>([]);
  const [currentNomination, setCurrentNomination] = useState<INomination>({ name: 'Выберите номинацию..', id: 0 });
  const [isBlockButtonNomination, setIsBlockButtonNomination] = useState<boolean>(true);

  const texts = nominationFieldTexts[currentNomination.id] || nominationFieldTexts[1];

  const [isOpenUploadLinkPopup, setIsOpenUploadLinkPopup] = useState<boolean>(false);
  const [isOpenUploadFilePopup, setIsOpenUploadFilePopup] = useState<boolean>(false);

  const [isLoadingRequest, setIsLoadingRequest] = useState<boolean>(false);
  const [isShowRequestError, setIsShowRequestError] = useState<boolean>(false);
  const [isBlockSubmitButton, setIsBlockSubmitButton] = useState<boolean>(false);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState<boolean>(false);

  const [isShowForm, setIsShowForm] = useState<boolean>(false);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);

  const handleChangeNomination = (option: INomination) => {
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

  const closePopup = () => {
    setIsOpenUploadLinkPopup(false);
    setIsOpenUploadFilePopup(false);
    setIsShowRequestError(false);
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    setIsLoadingSubmit(true);
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (token) {
      api.submitForm(
        token,
        nameInput.value,
        taskInput.value,
        descriptionInput.value,
        originalityInput.value,
        textInput.value,
        usabilityInput.value
      )
      .then((res) => {
        setFormData(res);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsLoadingSubmit(false);
      });
    }
  };

  const getData = () => {
    setIsLoadingData(true);
    const token = localStorage.getItem('token');
  
    if (token) {
      Promise.all([
        api.getNominations(token),
        api.getFormData(token),
      ])
        .then(([nominationsRes, formDataRes]) => {
          const foundNomination = nominationsRes.find((elem: INomination  ) => elem.id === formDataRes.nomination);
          if (foundNomination) {
            setCurrentNomination(foundNomination);
            setIsShowForm(true);
          }
          setNominations(nominationsRes);
          setFormData(formDataRes);
          nameInput.setValue(formDataRes.name || '');
          taskInput.setValue(formDataRes.task || '');
          descriptionInput.setValue(formDataRes.description || '');
          originalityInput.setValue(formDataRes.originality || '');
          textInput.setValue(formDataRes.text || '');
          usabilityInput.setValue(formDataRes.usability || '');
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => setIsLoadingData(false));
    }
  };

  useEffect(() => {
    const isValid = [
      nameInput,
      taskInput,
      descriptionInput,
      originalityInput,
      textInput,
      usabilityInput
    ].every((input) =>
      input.value.trim() !== '' &&
      !input.error.isShow
    );
  
    setIsBlockSubmitButton(!isValid);
  }, [
    nameInput.value, nameInput.error.isShow, nameInput.isBlocked,
    taskInput.value, taskInput.error.isShow, taskInput.isBlocked,
    descriptionInput.value, descriptionInput.error.isShow, descriptionInput.isBlocked,
    originalityInput.value, originalityInput.error.isShow, originalityInput.isBlocked,
    textInput.value, textInput.error.isShow, textInput.isBlocked,
    usabilityInput.value, usabilityInput.error.isShow, usabilityInput.isBlocked
  ]);

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
              <PersonVideo url='' isEmpty={true} />
            </div>
            {
              formData.status === 'draft'
              ?
              <Form formName={'stage-form'} onSubmit={onSubmit}>
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
                      <Button onClick={openUploadLinkPopup} text='Прикрепить ссылку' style={btnFilesStyle} color='secondary' />
                      <Button onClick={openUploadFilePopup} text='Добавить файл' style={btnFilesStyle} color='secondary' />
                    </div>
                    <h3 className='person-stage__title-row'>Прикрепленные источники:</h3>
                    {
                      formData && formData.resources.length > 0
                      ?
                      <ul className='person-stage__file-list'>
                        { formData.resources.map((elem, i) => (
                          <li className='person-stage__file-item' key={i}>
                            <span className='person-stage__file-count'>{i + 1}.</span>
                            <h4 className='person-stage__file-title'>{elem.description}</h4>
                            <Button 
                              text='Ссылка' 
                              type='link' 
                              link={elem.type === 'link' ? elem.link : elem.file} 
                              color='secondary'
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
                  <FormSubmit text='Отправить анкету' isBlock={isBlockSubmitButton} loadingText='Отправка..' isLoading={isLoadingSubmit} />
                  </>
                }
              </Form>
              :
              <>
              <div className='person-stage__row-title '>Спасибо! Анкета практики успешно отправлена.</div>
              <Button text='Перейти к следующему этапу' onClick={onNextStage} style={btnNextStageStyle} />
              </>
            }
            </>
          )
        }
        </>
      }
      {
        isOpenUploadLinkPopup &&
        <UploadLinkPopup 
          isOpen={isOpenUploadLinkPopup}
          onClose={closePopup}
          onUpload={handleUploadLink} 
          isLoading={isLoadingRequest} 
          isShowRequestError={isShowRequestError}
        />
      }
      {
        isOpenUploadFilePopup &&
        <UploadFilePopup 
          isOpen={isOpenUploadFilePopup}
          onClose={closePopup}
          onUpload={handleUploadFile} 
          isLoading={isLoadingRequest} 
          isShowRequestError={isShowRequestError}
        />
      }
    </div>
  );
};

export default PersonStageForm;
