import type { FC } from 'react';
import { useState, useEffect } from 'react';

import Preloader from '../../../../../shared/components/Preloader/ui/Preloader';
import Link from '../../../../../shared/components/Link/ui/Link';
import Form from '../../../../../shared/components/Form/ui/Form';
import FormField from '../../../../../shared/components/Form/components/FormField/ui/FormField';
import FormTextArea from '../../../../../shared/components/Form/components/FormTextArea/ui/FormTextArea';
import FormSubmit from '../../../../../shared/components/Form/components/FormSubmit/ui/FormSubmit';
import SelectWithSearch from '../../../../../shared/components/Select/ui/SelectWithSearch';
import RatingStars from '../../../../../widgets/RatingStars/ui/RatingStars';

import * as api from '../../../../../shared/utils/api';

import '../styles/style.css';

interface IWebinarData {
  id: number;
  user_info: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    educational_organization: string;
  };
  name: string;
  date: string;
  time: string;
  recording_link: string;
  category_name: number;
  user_rating: IScore | null;
}

interface IScore {
  id: number;
  rating: number;
  comment: string;
  name: string;
}

const PersonStageEvaluate: FC = () => {
  const [scores, setScores] = useState<IScore[]>([]);
  const [webinarData, setWebinarData] = useState<IWebinarData[]>([]);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);
  const [isLoadingRequest, setIsLoadingRequest] = useState<boolean>(false);

  const [currentPractice, setCurrentPractice] = useState<IWebinarData | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');

  const getData = () => {
    setIsLoadingData(true);
    const token = localStorage.getItem('token');
    if (token) {
      api
        .getCompletedWebinars(token)
        .then((res: IWebinarData[]) => {
          setWebinarData(res);

          // Собираем массив оценок из user_rating
          const rated = res
            .filter((item) => item.user_rating)
            .map((item) => {
              const ratingData = item.user_rating;
              return {
                id: ratingData?.id ?? item.id,
                name: item.name,
                rating: ratingData?.rating ?? 0,
                comment: ratingData?.comment ?? '',
              };
            });
          setScores(rated);
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

  const handleChangePractice = (practice: IWebinarData) => {
    setCurrentPractice(practice);
    if (practice.user_rating) {
      setRating(practice.user_rating.rating);
      setComment(practice.user_rating.comment);
    } else {
      setRating(0);
      setComment('');
    }
  };

  const handleChangeComment = (value: string) => {
    setComment(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPractice) return;
    const token = localStorage.getItem('token');
    if (!token) return;

    setIsLoadingRequest(true);
    try {
      const res = await api.scoreWebinar(token, currentPractice.id, rating, comment);

      // Обновляем user_rating у оценённой практики
      setWebinarData((prev) =>
        prev.map((w) =>
          w.id === currentPractice.id
            ? { ...w, user_rating: { id: res.rating.id, rating, comment, name: w.name } }
            : w
        )
      );

      // Добавляем запись в список оценённых
      setScores((prev) => [
        ...prev,
        { id: res.rating.id, name: currentPractice.name, rating, comment },
      ]);

      // Обнуляем форму
      setCurrentPractice(null);
      setRating(0);
      setComment('');
    } catch (err) {
      console.error('Ошибка при отправке оценки:', err);
    } finally {
      setIsLoadingRequest(false);
    }
  };

  const isFormValid = () =>
    currentPractice !== null && rating > 0 && comment.trim().length >= 250;

  // Только неопубликованные оценки попадают в список выбора
  const availableOptions = webinarData.filter(
    (item) => !scores.some((s) => s.id === item.user_rating?.id)
  );

  return (
    <div className="person-stage">
      {isLoadingData ? (
        <Preloader />
      ) : (
        <>
          <h2 className="person-stage__title">Оценка работ других участников</h2>
          <p className="person-stage__subtitle">
            Записи вебинаров доступны для просмотра на отдельной странице. Чем больше практик вы оцените,
            тем больше дополнительных баллов сможете получить — не упустите эту возможность повысить свой рейтинг
            в конкурсе. После оценки 10 и более практик Вам будут начислены дополнительные баллы.
          </p>
          <p className="person-stage__subtitle">
            <Link text="Перейти к вебинарам →" path="https://edtech.rut-miit.ru/records" />
          </p>

          <p className="person-stage__subtitle person-stage__text-bold">Мои оценки:</p>
          {scores.length > 0 ? (
          <ul className="person-stage__scores-list">
            {scores.map((s, i) => (
              <li key={s.id} className="person-stage__score-item">
                <p className="person-stage__score-text">{i + 1}. {s.name}</p>
                <div className='person-stage__score-stars'>{'⭐'.repeat(s.rating)}</div>
              </li>
            ))}
          </ul>
          ) : (
            <p className="person-stage__subtitle person-stage__text-grey">
              Список оценок пока пуст.
            </p>
          )}

          <Form formName="evaluate-form" onSubmit={handleSubmit}>
            <FormField
              title="1. Выберите практику"
              subtitle="Просмотрите запись вебинара и выберите практику для оценки в раскрывающемся списке."
            >
              <SelectWithSearch
                options={availableOptions.map((item) => ({
                  id: item.id,
                  name: `${item.name || 'Без названия'} — ${item.user_info?.last_name || ''} ${item.user_info?.first_name || ''}`.trim(),
                }))}
                currentOption={
                  currentPractice
                    ? {
                        id: currentPractice.id,
                        name: `${currentPractice.name || 'Без названия'} — ${currentPractice.user_info?.last_name || ''} ${currentPractice.user_info?.first_name || ''}`.trim(),
                      }
                    : { id: 0, name: 'Выберите практику' }
                }
                onChooseOption={(option) => {
                  const selected = webinarData.find((w) => w.id === option.id);
                  if (selected) handleChangePractice(selected);
                }}
              />
            </FormField>

            <FormField
              title="2. Оценка практики"
              subtitle="Выберите оценку для практики от 1 до 5 звёзд."
            >
              <RatingStars value={rating} onChange={setRating} />
            </FormField>

            <FormField
              title="3. Комментарий"
              subtitle="Объем комментария должен составлять не менее 300 знаков — это поможет экспертам и участникам получить ценную обратную связь и сделать конкурс еще более полезным и интересным."
            >
              <FormTextArea
                value={comment}
                placeholder="Введите текст..."
                onChange={handleChangeComment}
              />
            </FormField>

            <FormSubmit
              text="Сохранить"
              isBlock={!isFormValid()}
              isLoading={isLoadingRequest}
              loadingText="Сохранение..."
            />
          </Form>
        </>
      )}
    </div>
  );
};

export default PersonStageEvaluate;
