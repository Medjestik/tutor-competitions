import type { FC, ChangeEvent } from 'react';

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

type TSaveSection = 'video' | 'presentation' | 'photo' | null;

const PersonStageSlides: FC = () => {
  const passedSecondStage = useSelector(
    (state) => state.user.user?.passed_second_stage === true,
  );

  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);
  const [savingSection, setSavingSection] = useState<TSaveSection>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

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

  const patchSection = async (
    section: Exclude<TSaveSection, null>,
    formData: FormData,
  ) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    setSaveError(null);
    setSaveMessage(null);
    setSavingSection(section);

    try {
      const res = await api.patchSecondStageMaterials(token, formData);
      if (section === 'presentation') {
        setPresentationFile(null);
      }
      if (section === 'photo') {
        setPhotoFile(null);
      }
      applyServerData(res);
      setSaveMessage('Сохранено.');
    } catch (err) {
      try {
        const body = await (err as Response).json();
        setSaveError(body.error || 'Не удалось сохранить материалы.');
      } catch {
        setSaveError('Не удалось сохранить материалы.');
      }
    } finally {
      setSavingSection(null);
    }
  };

  const savePracticeVideo = () => {
    const formData = new FormData();
    formData.append('practice_video_url', practiceVideoUrl.trim());
    void patchSection('video', formData);
  };

  const savePresentation = () => {
    const formData = new FormData();
    if (presentationFile) {
      formData.append('presentation_file', presentationFile);
    } else if (presentationLink.trim()) {
      formData.append('presentation_url', presentationLink.trim());
    } else {
      setSaveError('Выберите файл презентации или укажите ссылку.');
      setSaveMessage(null);
      return;
    }
    void patchSection('presentation', formData);
  };

  const savePhoto = () => {
    if (!photoFile) {
      setSaveError('Выберите файл фотографии.');
      setSaveMessage(null);
      return;
    }
    const formData = new FormData();
    formData.append('photo', photoFile);
    void patchSection('photo', formData);
  };

  if (!passedSecondStage) {
    return (
      <div className='person-stage'>
        <div className='person-stage__header'>
          <h2 className='person-stage__title'>Видеопрезентация</h2>
          <p className='person-stage__lead'>Этот этап вам недоступен</p>
        </div>
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

  const isBusy = savingSection !== null;

  return (
    <div className='person-stage'>
      <div className='person-stage__header'>
        <h2 className='person-stage__title'>Видеопрезентация</h2>
        <p className='person-stage__lead'>
          Ознакомьтесь с видео и подготовьте материалы второго этапа
        </p>
      </div>

      <div className='person-stage__grid'>
        <div className='person-stage__left'>
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

        <div className='person-stage__info person-stage__info_welcome'>
          <p className='person-stage__welcome-title'>
            Поздравляем с выходом в полуфинал!
          </p>
          <div className='person-stage__welcome-body'>
            <p>
              Вы успешно прошли отборочный этап Международного конкурса лучших
              педагогических практик «Лидеры транспортного образования» и вошли в
              число полуфиналистов конкурса 2026 года.
            </p>
            <p>
              На этом этапе вам предстоит подробнее представить свою педагогическую
              практику и показать её особенности, результаты и практическую ценность.
              Для этого необходимо подготовить видеопредставление практики и
              презентацию.
            </p>
            <p>
              Видеопрезентация — это возможность наглядно продемонстрировать, как
              работает ваша практика: показать фрагмент занятия или мероприятия,
              рассказать о подходе, продемонстрировать используемые инструменты,
              результаты или отзывы участников. Формат видео свободный, главное —
              помочь экспертам понять суть практики и увидеть её в работе.
            </p>
            <p>
              Презентация должна быть самостоятельным материалом, который позволяет
              понять содержание практики без дополнительного устного комментария.
              Используйте её, чтобы структурировано раскрыть ключевые особенности,
              механику реализации, роль студентов, результаты и возможности
              дальнейшего применения практики.
            </p>
            <p>
              Обратите особое внимание на результаты первого этапа. При подготовке
              материалов второго этапа рекомендуем прежде всего раскрыть те стороны
              практики, которые были представлены недостаточно подробно на первом.
            </p>
            <p>
              Желаем успешно представить свою практику и пройти в финал конкурса!
            </p>
          </div>
        </div>
      </div>

      <hr className='person-stage__divider' />

      <p className='person-stage__subtitle'>Загрузите материалы второго этапа.</p>

      <Button
        text='Скачать шаблон презентации'
        style={btnStyle}
        type='link'
        href={STAGE_2_TEMPLATE_HREF}
      />

      <div className='person-stage__form'>
        <div className='person-stage__field-block'>
          <label className='person-stage__subtitle' htmlFor='practice-video-url'>
            Ссылка на видеопредставление практики
          </label>
          <input
            id='practice-video-url'
            className='person-stage__input person-stage__input_full'
            type='url'
            value={practiceVideoUrl}
            onChange={(ev) => setPracticeVideoUrl(ev.target.value)}
            placeholder='https://'
          />
          <Button
            text={savingSection === 'video' ? 'Сохранение…' : 'Сохранить ссылку'}
            style={btnStyle}
            type='button'
            onClick={savePracticeVideo}
            disabled={isBusy}
          />
        </div>

        <div className='person-stage__field-block'>
          <p className='person-stage__subtitle person-stage__text-bold'>
            Презентация (файл до 30&nbsp;Мб или ссылка)
          </p>
          {savedPresentationFileUrl && !presentationFile && !presentationLink && (
            <p className='person-stage__subtitle'>
              Загружен файл:{' '}
              <a href={savedPresentationFileUrl} target='_blank' rel='noreferrer'>
                открыть
              </a>
            </p>
          )}
          <div className='person-stage__btn-container person-stage__btn-container_stack'>
            <Button
              text='Добавить файл'
              style={btnStyle}
              type='button'
              onClick={() => presentationInputRef.current?.click()}
              disabled={isBusy}
            />
            <input
              ref={presentationInputRef}
              type='file'
              accept='.ppt,.pptx,.pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/pdf'
              hidden
              onChange={handlePresentationFile}
            />
            <input
              className='person-stage__input person-stage__input_full'
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
          <Button
            text={savingSection === 'presentation' ? 'Сохранение…' : 'Сохранить презентацию'}
            style={btnStyle}
            type='button'
            onClick={savePresentation}
            disabled={isBusy}
          />
        </div>

        <div className='person-stage__field-block'>
          <p className='person-stage__subtitle person-stage__text-bold'>
            Фотография (до 10&nbsp;Мб, JPEG, PNG или WebP)
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
            disabled={isBusy}
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
          <Button
            text={savingSection === 'photo' ? 'Сохранение…' : 'Сохранить фото'}
            style={btnStyle}
            type='button'
            onClick={savePhoto}
            disabled={isBusy}
          />
        </div>

        {saveError && (
          <p className='person-stage__subtitle person-stage__text-bold'>{saveError}</p>
        )}
        {saveMessage && !saveError && (
          <p className='person-stage__subtitle person-stage__text-bold'>{saveMessage}</p>
        )}
      </div>
    </div>
  );
};

export default PersonStageSlides;
