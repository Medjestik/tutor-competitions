import type { FC, ChangeEvent, FormEvent } from 'react';

import { useState, useEffect, useRef } from 'react';

import Button from '../../../../../shared/components/Button/ui/Button';
import Preloader from '../../../../../shared/components/Preloader/ui/Preloader';

import { useSelector } from '../../../../../store/store';

import * as api from '../../../../../shared/utils/api';

import '../styles/style.css';

const ORGANIZER_VIDEO_URL =
  'https://runtime.video.cloud.yandex.net/player/video/vplvizgnahys4zwqjc3s?autoplay=0&mute=0';
const STAGE_2_TEMPLATE_HREF = '/stage-2-template.ppt';

const btnStyle = {
  margin: '12px 0 0 0',
  fontSize: '18px',
  height: '40px',
  lineHeight: '18px',
  padding: '8px 20px',
};

const PersonStageSlides: FC = () => {
  const passedSecondStage = useSelector(
    (state) => state.user.user?.passed_second_stage === true,
  );

  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const [practiceVideoUrl, setPracticeVideoUrl] = useState('');
  const [presentationLink, setPresentationLink] = useState('');
  const [presentationFile, setPresentationFile] = useState<File | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [savedPresentationFileUrl, setSavedPresentationFileUrl] = useState<
    string | null
  >(null);
  const [savedPhotoUrl, setSavedPhotoUrl] = useState<string | null>(null);

  const presentationInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const applyServerData = (data: api.ISecondStageMaterials) => {
    setPracticeVideoUrl(data.practice_video_url || '');
    setPresentationLink(data.presentation_url || '');
    setSavedPresentationFileUrl(data.presentation_file_url);
    setSavedPhotoUrl(data.photo_url);
    const complete =
      Boolean(data.practice_video_url) &&
      (Boolean(data.presentation_url) || Boolean(data.presentation_file_url)) &&
      Boolean(data.photo_url);
    setIsSaved(complete);
  };

  const loadData = () => {
    const token = localStorage.getItem('token');
    if (!token || !passedSecondStage) {
      setIsLoadingData(false);
      return;
    }
    setIsLoadingData(true);
    api
      .getSecondStageMaterials(token)
      .then((res) => {
        applyServerData(res);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setIsLoadingData(false));
  };

  useEffect(() => {
    loadData();
  }, [passedSecondStage]);

  const handlePresentationFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPresentationFile(file);
      setPresentationLink('');
    }
    e.target.value = '';
  };

  const handlePhotoFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
    }
    e.target.value = '';
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    setSaveError(null);
    setIsSaving(true);

    const formData = new FormData();
    formData.append('practice_video_url', practiceVideoUrl.trim());

    if (presentationFile) {
      formData.append('presentation_file', presentationFile);
    } else if (presentationLink.trim()) {
      formData.append('presentation_url', presentationLink.trim());
    }

    if (photoFile) {
      formData.append('photo', photoFile);
    }

    api
      .patchSecondStageMaterials(token, formData)
      .then((res) => {
        setPresentationFile(null);
        setPhotoFile(null);
        applyServerData(res);
      })
      .catch(async (err: Response) => {
        try {
          const body = await err.json();
          setSaveError(body.error || 'Не удалось сохранить материалы.');
        } catch {
          setSaveError('Не удалось сохранить материалы.');
        }
      })
      .finally(() => setIsSaving(false));
  };

  if (!passedSecondStage) {
    return (
      <div className='person-stage'>
        <h2 className='person-stage__title'>Видеопрезентация</h2>
        <p className='person-stage__subtitle'>Этот этап вам недоступен</p>
      </div>
    );
  }

  if (isLoadingData) {
    return (
      <div className='person-stage'>
        <Preloader />
      </div>
    );
  }

  return (
    <div className='person-stage'>
      <h2 className='person-stage__title'>Видеопрезентация</h2>

      <div className='person-stage__container'>
        <div className='person-stage__info'>
          <p className='person-stage__subtitle'>
            Ознакомьтесь с видео и подготовьте материалы второго этапа.
          </p>
          <Button
            text='Скачать шаблон'
            style={btnStyle}
            type='link'
            href={STAGE_2_TEMPLATE_HREF}
          />
        </div>
        <div className='person-stage__video-wrap'>
          <div className='person-stage__video-embed'>
            <iframe
              title='Видео организатора'
              src={ORGANIZER_VIDEO_URL}
              width={560}
              height={315}
              allow='autoplay; fullscreen; accelerometer; gyroscope; picture-in-picture; encrypted-media'
              allowFullScreen
            />
          </div>
        </div>
      </div>

      <form className='person-stage__form' onSubmit={handleSubmit}>
        <label className='person-stage__subtitle'>
          Ссылка на видеопредставление практики *
          <input
            className='person-stage__input'
            type='url'
            value={practiceVideoUrl}
            onChange={(ev) => setPracticeVideoUrl(ev.target.value)}
            placeholder='https://'
            required
          />
        </label>

        <p className='person-stage__subtitle person-stage__text-bold'>
          Презентация * (файл до 30&nbsp;Мб или ссылка)
        </p>
        {savedPresentationFileUrl && !presentationFile && !presentationLink && (
          <p className='person-stage__subtitle'>
            Загружен файл:{' '}
            <a href={savedPresentationFileUrl} target='_blank' rel='noreferrer'>
              открыть
            </a>
          </p>
        )}
        <div className='person-stage__btn-container'>
          <Button
            text='Добавить файл'
            style={btnStyle}
            type='button'
            onClick={() => presentationInputRef.current?.click()}
          />
          <input
            ref={presentationInputRef}
            type='file'
            accept='.ppt,.pptx,.pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/pdf'
            hidden
            onChange={handlePresentationFile}
          />
          <input
            className='person-stage__input'
            type='url'
            value={presentationLink}
            onChange={(ev) => {
              setPresentationLink(ev.target.value);
              if (ev.target.value) {
                setPresentationFile(null);
              }
            }}
            placeholder='Или ссылка на презентацию'
          />
        </div>
        {presentationFile && (
          <p className='person-stage__subtitle'>Выбран файл: {presentationFile.name}</p>
        )}

        <p className='person-stage__subtitle person-stage__text-bold'>
          Фотография * (до 10&nbsp;Мб, JPEG, PNG или WebP)
        </p>
        {savedPhotoUrl && !photoFile && (
          <p className='person-stage__subtitle'>
            Загружено фото:{' '}
            <a href={savedPhotoUrl} target='_blank' rel='noreferrer'>
              открыть
            </a>
          </p>
        )}
        <Button
          text='Добавить фото'
          style={btnStyle}
          type='button'
          onClick={() => photoInputRef.current?.click()}
        />
        <input
          ref={photoInputRef}
          type='file'
          accept='image/jpeg,image/png,image/webp'
          hidden
          onChange={handlePhotoFile}
        />
        {photoFile && (
          <p className='person-stage__subtitle'>Выбрано фото: {photoFile.name}</p>
        )}

        {saveError && (
          <p className='person-stage__subtitle person-stage__text-bold'>{saveError}</p>
        )}

        {isSaved && !saveError && (
          <p className='person-stage__subtitle person-stage__text-bold'>
            Материалы сохранены. При необходимости вы можете заменить их и сохранить снова.
          </p>
        )}

        <Button
          text={isSaving ? 'Сохранение…' : 'Сохранить'}
          style={btnStyle}
          type='submit'
          disabled={isSaving}
        />
      </form>
    </div>
  );
};

export default PersonStageSlides;
