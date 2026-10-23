import type { FC } from 'react';
import type { IFormData, IFormFieldDef, IScoreItem } from '../../../../Person/interface/interface';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { getEvaluationStage } from '../../../evaluationStage';
import '../../../evaluation-stage.css';

import * as api from '../../../../../shared/utils/api';

import Button from '../../../../../shared/components/Button/ui/Button';
import Preloader from '../../../../../shared/components/Preloader/ui/Preloader';
import SetScorePopup from '../../../../../shared/components/Popup/ui/SetScorePopup';
import { FormField } from '../../../../../shared/components/Form/components/FormField/form-field';

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
  const [searchParams] = useSearchParams();
  const stage = getEvaluationStage(searchParams);
  const [error, setError] = useState('');
  const [scoreError, setScoreError] = useState('');
  const [form, setForm] = useState<IFormData | null>(null);
  const [isOpenSetScorePopup, setIsOpenSetScorePopup] = useState<boolean>(false);
  const [isLoadingScore, setIsLoadingScore] = useState<boolean>(false);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);

  const totalScore = useMemo(() => {
    if (!form?.evaluation_details) return 0;
    return form.evaluation_details.reduce((sum, criteria) => {
      return (
        sum +
        criteria.indicators.reduce((innerSum, indicator) => {
          return innerSum + (indicator.score ?? 0);
        }, 0)
      );
    }, 0);
  }, [form]);

  const openSetScorePopup = () => {
    setIsOpenSetScorePopup(true);
  };

  const closePopup = () => {
    setIsOpenSetScorePopup(false);
  };

  const backToForms = () => {
    navigate(`/person/nomination/${nominationId}?stage=${stage}`);
  };

  const handleScoreForm = (data: IScoreItem[]) => {
    setIsLoadingScore(true);
    setScoreError('');
    const token = localStorage.getItem('token');
    if (token) {
      api
        .scoreForm(token, data, stage)
        .then((res) => {
          setForm((prev) => (prev ? { ...prev, evaluation_details: res } : prev));
          closePopup();
        })
        .catch(() => {
          setScoreError('Не удалось сохранить оценку. Проверьте доступность практики и повторите попытку.');
        })
        .finally(() => setIsLoadingScore(false));
    } else {
      setScoreError('Для сохранения оценки необходимо войти в систему.');
      setIsLoadingScore(false);
    }
  };

  useEffect(() => {
    let active = true;
    setIsLoadingData(true);
    setForm(null);
    setError('');
    setScoreError('');
    setIsOpenSetScorePopup(false);
    const token = localStorage.getItem('token');
    if (token && formId) {
      api
        .getExpertForm(token, formId, stage)
        .then((res) => {
          if (active) setForm(res);
        })
        .catch(() => {
          if (active) setError('Практика недоступна на выбранном этапе или не удалось загрузить данные.');
        })
        .finally(() => { if (active) setIsLoadingData(false); });
    } else {
      setError('Для просмотра практики необходимо войти в систему.');
      setIsLoadingData(false);
    }
    return () => { active = false; };
  }, [formId, stage]);

  const renderSchemaField = (field: IFormFieldDef) => {
    const value = form?.answers?.[field.key] ?? '';
    const isNameField = field.key === 'name';

    return (
      <FormField
        key={field.key}
        title={field.title}
        caption={field.help_text || undefined}
      >
        {isNameField ? (
          <p className='form__text-view'>{value || form?.name || ''}</p>
        ) : (
          <>
            {field.hint && <p className='expert-form__field-hint'>{field.hint}</p>}
            <p className='form__text-view'>{value}</p>
          </>
        )}
      </FormField>
    );
  };

  return isLoadingData ? (
    <Preloader />
  ) : (
    <>
      {error && <>
        <p role='alert'>{error}</p>
        <Button onClick={backToForms} text='Вернуться к списку' color='default' />
      </>}
      {form && (
        <>
          <div className='expert-form__data'>
            <div
              className={`expert-form__img expert-form__img_type_${form.nomination}`}
            ></div>
            <div className='expert-form__info'>
              <span className='expert-form__nomination'>{form.nomination_name}</span>
              <h4 className='expert-form__name'>{form.name}</h4>
              <p className='expert-form__score'>Текущая оценка - {totalScore}</p>
              <p>{stage === 'semifinal' ? 'Полуфинал' : 'Отборочный'} · Оценка общая для обоих этапов</p>
              <div className='form__input-field'>
                <Button
                  onClick={backToForms}
                  text='Вернуться к списку'
                  style={btnFilesStyle}
                  color='default'
                />
                <Button
                  onClick={openSetScorePopup}
                  text='Оценить анкету'
                  style={btnFilesStyle}
                  color='primary'
                />
              </div>
            </div>
          </div>
          <div className='expert-form__container'>
            {stage === 'semifinal' && (
              <section className='expert-stage-materials' aria-label='Материалы полуфинала'>
                <h3>Материалы полуфинала</h3>
                <p>Материалы: {form.second_stage_materials?.count ?? 0}/3</p>
                <ul>
                  <li>Видео: {form.second_stage_materials?.has_video && form.second_stage_materials.practice_video_url
                    ? <a href={form.second_stage_materials.practice_video_url} target='_blank' rel='noreferrer'>Открыть видео</a>
                    : 'Не загружено'}</li>
                  <li>Презентация: {form.second_stage_materials?.has_presentation ? <>
                    {form.second_stage_materials.presentation_file_url && <a href={form.second_stage_materials.presentation_file_url} target='_blank' rel='noreferrer'>Открыть файл</a>}
                    {' '}
                    {form.second_stage_materials.presentation_url && <a href={form.second_stage_materials.presentation_url} target='_blank' rel='noreferrer'>Открыть презентацию</a>}
                  </> : 'Не загружено'}</li>
                  <li>Фото: {form.second_stage_materials?.has_photo && form.second_stage_materials.photo_url
                    ? <a href={form.second_stage_materials.photo_url} target='_blank' rel='noreferrer'>Открыть фото</a>
                    : 'Не загружено'}</li>
                </ul>
              </section>
            )}
            {form.educational_organization && (
              <FormField title='Образовательная организация'>
                <p className='form__text-view'>{form.educational_organization}</p>
              </FormField>
            )}
            {(form.schema ?? []).map(renderSchemaField)}
            <FormField title='Прикреплённые источники'>
              {form.resources.length > 0 ? (
                <ul className='expert-form__file-list'>
                  {form.resources.map((elem, i) => (
                    <li className='expert-form__file-item' key={elem.id ?? i}>
                      <span className='expert-form__file-count'>{i + 1}.</span>
                      <h4 className='expert-form__file-title'>{elem.description}</h4>
                      <Button
                        text='Ссылка'
                        type='link'
                        href={elem.type === 'link' ? elem.link : elem.file}
                        color='primary'
                        style={btnLinksStyle}
                      />
                    </li>
                  ))}
                </ul>
              ) : (
                <span className='expert-form__file-empty'>
                  Список источников пока пуст.
                </span>
              )}
            </FormField>
          </div>
        </>
      )}
      {isOpenSetScorePopup && form && (
        <SetScorePopup
          isOpen={isOpenSetScorePopup}
          onClose={closePopup}
          form={form}
          isLoading={isLoadingScore}
          onScore={handleScoreForm}
          error={scoreError}
        />
      )}
    </>
  );
};

export default ExpertFormPage;
