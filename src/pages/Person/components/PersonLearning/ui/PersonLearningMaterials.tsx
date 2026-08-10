import type { FC } from 'react';
import type { ILmsMaterialsPart, ILmsMaterialsResponse } from '../../../../../shared/utils/api';

import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import Preloader from '../../../../../shared/components/Preloader/ui/Preloader';
import { getMyLmsMaterials } from '../../../../../shared/utils/api';
import { EROUTES, EROUTESLEARNING } from '../../../../../shared/utils/ERoutes';

import './person-learning-materials.css';

const buildTreeOrder = (parts: ILmsMaterialsPart[]): ILmsMaterialsPart[] => {
  const byParent = new Map<number | null, ILmsMaterialsPart[]>();
  parts.forEach((part) => {
    const key = part.parent_id ?? null;
    const list = byParent.get(key) || [];
    list.push(part);
    byParent.set(key, list);
  });
  byParent.forEach((list) =>
    list.sort((a, b) => a.position - b.position || a.id - b.id)
  );

  const result: ILmsMaterialsPart[] = [];
  const walk = (parentId: number | null) => {
    const children = byParent.get(parentId) || [];
    children.forEach((child) => {
      result.push(child);
      walk(child.id);
    });
  };
  walk(null);
  return result;
};

const PersonLearningMaterials: FC = () => {
  const [data, setData] = useState<ILmsMaterialsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Требуется авторизация');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    getMyLmsMaterials(token)
      .then((response) => setData(response))
      .catch(() => setError('Не удалось загрузить материалы обучения'))
      .finally(() => setIsLoading(false));
  }, []);

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
                <span className='person-learning-materials__tree-name'>{part.name}</span>
                <span className='person-learning-materials__tree-type'>
                  {part.part_type.name}
                  {!part.is_mandatory ? ' · необязательно' : ''}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PersonLearningMaterials;
