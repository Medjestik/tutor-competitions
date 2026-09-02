import type { FC } from 'react';
import type { ILmsMaterialsResponse } from '../../../../../shared/utils/api';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import Preloader from '../../../../../shared/components/Preloader/ui/Preloader';
import { getMyLmsMaterials } from '../../../../../shared/utils/api';
import { EROUTES, EROUTESLEARNING } from '../../../../../shared/utils/ERoutes';
import PersonLearningCoursePlayer from './player/PersonLearningCoursePlayer';
import {
  buildTreeOrder,
  getPartIcon,
} from '../lib/coursePlayer';

import './person-learning-materials.css';

const PersonLearningMaterials: FC = () => {
  const [data, setData] = useState<ILmsMaterialsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPartId, setSelectedPartId] = useState<number | null>(null);

  const loadMaterials = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Требуется авторизация');
      setIsLoading(false);
      return Promise.resolve();
    }

    setIsLoading(true);
    return getMyLmsMaterials(token)
      .then((response) => {
        setData(response);
        setError('');
      })
      .catch(() => setError('Не удалось загрузить материалы обучения'))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    void loadMaterials();
  }, [loadMaterials]);

  const handleClosePlayer = () => {
    setSelectedPartId(null);
    void loadMaterials();
  };

  const orderedParts = useMemo(
    () => (data?.course?.parts ? buildTreeOrder(data.course.parts) : []),
    [data]
  );

  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <div className='person-learning-materials'>
        <p className='person-learning-materials__error'>{error}</p>
      </div>
    );
  }

  if (!data || data.access !== 'granted' || !data.course) {
    return (
      <div className='person-learning-materials'>
        <div className='person-learning-materials__card'>
          <h2 className='person-learning-materials__title'>Материалы обучения</h2>
          {data?.statusDisplay && (
            <p className='person-learning-materials__status'>
              Статус заявки: {data.statusDisplay}
            </p>
          )}
          <p className='person-learning-materials__message'>
            {data?.message || 'Материалы курса пока недоступны.'}
          </p>
          {data?.organizerComment ? (
            <p className='person-learning-materials__comment'>
              Комментарий организатора: {data.organizerComment}
            </p>
          ) : null}
          <Link
            className='person-learning-materials__link'
            to={`${EROUTES.PERSON}/${EROUTESLEARNING.LISTENER}`}
          >
            Перейти к данным слушателя
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='person-learning-materials'>
      <PersonLearningCoursePlayer
        isOpen={selectedPartId !== null}
        partId={selectedPartId}
        onClose={handleClosePlayer}
        onSelectPart={setSelectedPartId}
      />
      <div className='person-learning-materials__header'>
        <h2 className='person-learning-materials__title'>{data.course.name}</h2>
        {data.course.description ? (
          <p className='person-learning-materials__lead'>{data.course.description}</p>
        ) : null}
      </div>

      <div className='person-learning-materials__card'>
        <h3 className='person-learning-materials__subtitle'>Структура курса</h3>
        {orderedParts.length === 0 ? (
          <p className='person-learning-materials__message'>
            В курсе пока нет материалов.
          </p>
        ) : (
          <ul className='person-learning-materials__tree'>
            {orderedParts.map((part) => (
              <li
                key={part.id}
                className='person-learning-materials__tree-item'
                style={{ paddingLeft: 12 + part.level * 20 }}
              >
                <div className='person-learning-materials__tree-main'>
                  <img
                    className='person-learning-materials__tree-icon'
                    src={getPartIcon(part.part_type.code)}
                    alt={part.part_type.name}
                  />
                  <span className='person-learning-materials__tree-name'>{part.name}</span>
                </div>
                {part.part_type.code !== 'folder' ? (
                  <div className='person-learning-materials__tree-meta'>
                    <span className='person-learning-materials__tree-badge'>
                      {part.is_mandatory ? 'Обязательный' : 'Необязательный'}
                    </span>
                    {part.progress_status_display ? (
                      <span className='person-learning-materials__tree-badge'>
                        {part.progress_status_display}
                      </span>
                    ) : null}
                    <button
                      type='button'
                      className='person-learning-materials__tree-action'
                      onClick={() => setSelectedPartId(part.id)}
                    >
                      {part.progress_status ? 'Продолжить' : 'Начать'}
                    </button>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PersonLearningMaterials;
