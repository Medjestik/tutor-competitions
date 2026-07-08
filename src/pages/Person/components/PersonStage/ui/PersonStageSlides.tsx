/* eslint-disable @typescript-eslint/no-unused-vars */
import type { FC } from 'react';
import type { IUploadFile, IUploadLink } from '../../../../../shared/components/Popup/interface/interface';

import { useState, useEffect } from 'react';

import PersonVideo from '../../PersonVideo/ui/PersonVideo';

import Button from '../../../../../shared/components/Button/ui/Button';
import Link from '../../../../../shared/components/Link/ui/Link';
import Preloader from '../../../../../shared/components/Preloader/ui/Preloader';

import * as api from '../../../../../shared/utils/api';

import '../styles/style.css';

const btnStyle = {
  margin: '12px 0 0 0',
  fontSize: '18px',
  height: '40px',
  lineHeight: '18px',
  padding: '8px 20px',
};

const PersonStageSlides: FC = () => {

  const [isOpenUploadFilePopup, setIsOpenUploadFilePopup] = useState<boolean>(false);
  const [isOpenUploadLinkPopup, setIsOpenUploadLinkPopup] = useState<boolean>(false);

  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);
  const [isLoadingRequest, setIsLoadingRequest] = useState<boolean>(false);
  const [isShowRequestError, setIsShowRequestError] = useState<boolean>(false);
  const [isUploadSlides, setIsUploadSlides] = useState<boolean>(false);

  const handleUploadFile = (file: IUploadFile) => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsShowRequestError(false);
      setIsLoadingRequest(true);
      api.uploadFile(token, file)
      .then(() => {
        setIsUploadSlides(true);
        closePopup();
      })
      .catch((err) => {
        setIsShowRequestError(true);
        console.error(err);
      })
      .finally(() => setIsLoadingRequest(false));
    }
  };

  const handleUploadLink = (data: IUploadLink) => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsShowRequestError(false);
      setIsLoadingRequest(true);
      api.uploadLink(token, data)
      .then(() => {
        setIsUploadSlides(true);
        closePopup();
      })
      .catch((err) => {
        setIsShowRequestError(true);
        console.error(err);
      })
      .finally(() => setIsLoadingRequest(false));
    }
  };

  const getData = () => {
    setIsLoadingData(true);
    const token = localStorage.getItem('token');
    if (token) {
      api.getStage(token)
      .then((res) => {
        if (res.length > 0) {
          setIsUploadSlides(true);
        } else {
          setIsUploadSlides(false);
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setIsLoadingData(false));
    }
  };

  const openUploadFilePopup = () => {
    setIsOpenUploadFilePopup(true);
  };

  const openUploadLinkPopup = () => {
    setIsOpenUploadLinkPopup(true);
  };

  const closePopup = () => {
    setIsShowRequestError(false);
    setIsOpenUploadFilePopup(false);
    setIsOpenUploadLinkPopup(false);
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
          <h2 className='person-stage__title'>Сделайте презентацию</h2>
          <div className='person-stage__container'>
            <div className='person-stage__info'>
              <p className='person-stage__subtitle'>Мы подготовили шаблон презентации — он поможет вам структурировать выступление и&nbsp;не&nbsp;упустить самое важное. Рекомендуем использовать шаблон для&nbsp;проведения онлайн-мастер-класса!</p>
              <p className='person-stage__subtitle'>Ознакомьтесь с критериями, по&nbsp;которым выступление будут оценивать эксперты — <Link text='https://t.me/edtechmiit/5' path='https://t.me/edtechmiit/5' /></p>
              <Button text='Скачать шаблон' style={btnStyle} type='link' href='https://course.emiit.ru/webtutor/ivan/land/template/edtech/template.pptx' />
            </div>
            <PersonVideo url='https://course.emiit.ru/webtutor/ivan/land/video/edtech/video.mp4' />
          </div>
          {
            isUploadSlides
            ?
            <div>
              <p className='person-stage__subtitle person-stage__text-bold'>Презентация успешно загружена!</p>
              <p className='person-stage__subtitle'>Теперь можно переходить к&nbsp;следующему этапу — проведению онлайн-мастер-класса. Нажмите кнопку «04», чтобы получить ссылку для&nbsp;подключения к&nbsp;видеоконференции и&nbsp;узнать время выступления.</p>
            </div>
            :
            <>
            <p className='person-stage__subtitle'>Загрузите готовую презентацию до&nbsp;завершения этапа онлайн-мастер-классов.</p>
            <p className='person-stage__subtitle'>Размер файла — <span className='person-stage__text-bold'>не&nbsp;более 10&nbsp;Мб.</span> Если размер файла превышает 10&nbsp;Мб, прикрепите ссылку на&nbsp;него.</p>
            <div className='person-stage__btn-container'>
              <Button text='Добавить файл' style={btnStyle} onClick={openUploadFilePopup} />
              <Button text='Добавить ссылку' style={btnStyle} onClick={openUploadLinkPopup} />
            </div>
            </>
          }

        </>
      }
    </div>
  );
};

export default PersonStageSlides;
