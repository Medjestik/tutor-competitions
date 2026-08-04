import type { FC } from 'react';
import type { IListenerTabProps } from '../../interface/interface';

import PersonLearningListenerFooter from './PersonLearningListenerFooter';

import reviewHourglassImage from '../../../../../../shared/images/person-cabinet/review-hourglass.png';

import '../../styles/listener.css';

const PersonLearningListenerReviewTab: FC<IListenerTabProps> = ({
  onBack,
  onSubmit,
  isSaving,
  allSectionsConfirmed = false,
  isApplicationSubmitted = false,
  applicationStatus = 'filling',
  organizerComment = '',
}) => {
  const isSubmitDisabled = !allSectionsConfirmed || isApplicationSubmitted;
  const canResubmit =
    applicationStatus === 'correction_required' && allSectionsConfirmed;

  if (applicationStatus === 'approved') {
    return (
      <div className='person-learning-review-submitted'>
        <h3 className='person-learning-review-submitted__title'>
          <span>Заявка одобрена</span>
        </h3>
        <p className='person-learning-review-submitted__text'>
          Вы можете приступать к обучению. Дополнительная информация будет отправлена
          на электронную почту.
        </p>
      </div>
    );
  }

  if (applicationStatus === 'rejected') {
    return (
      <div className='person-learning-review-submitted'>
        <h3 className='person-learning-review-submitted__title'>
          <span>Заявка отклонена</span>
        </h3>
        {organizerComment && (
          <div className='person-learning-organizer-comment'>
            <p className='person-learning-organizer-comment__title'>
              Комментарий организатора
            </p>
            <p className='person-learning-organizer-comment__text'>{organizerComment}</p>
          </div>
        )}
      </div>
    );
  }

  if (applicationStatus === 'submitted') {
    return (
      <div className='person-learning-review-submitted'>
        <div className='person-learning-review-submitted__illustration'>
          <img
            className='person-learning-review-submitted__image'
            src={reviewHourglassImage}
            alt=''
            aria-hidden='true'
          />
        </div>

        <h3 className='person-learning-review-submitted__title'>
          <span>Ваши документы</span>
          <span>отправлены на проверку</span>
        </h3>

        <p className='person-learning-review-submitted__text'>
          В случае положительного решения организаторов обучения, вам придёт уведомление на
          электронную почту о зачислении в качестве слушателя.
        </p>

        <div className='person-learning-review-submitted__statuses'>
          <span className='person-learning-review-submitted__status person-learning-review-submitted__status_primary'>
            Документы отправлены
          </span>
          <span className='person-learning-review-submitted__status person-learning-review-submitted__status_secondary'>
            Ожидайте результатов
          </span>
        </div>
      </div>
    );
  }

  if (applicationStatus === 'correction_required') {
    return (
      <>
        <div className='person-learning-listener person-learning-listener_review'>
          <div className='person-learning-organizer-comment'>
            <p className='person-learning-organizer-comment__title'>
              Требуется исправление данных
            </p>
            {organizerComment && (
              <p className='person-learning-organizer-comment__text'>{organizerComment}</p>
            )}
            <p className='person-learning-listener__status person-learning-listener__status_warning'>
              Исправьте отмеченные разделы, подтвердите их снова и отправьте документы на
              повторную проверку.
            </p>
          </div>
          {!canResubmit && (
            <p className='person-learning-listener__status person-learning-listener__status_warning'>
              Для повторной отправки подтвердите все разделы.
            </p>
          )}
        </div>

        <PersonLearningListenerFooter
          variant='review'
          onBack={onBack}
          onSubmit={onSubmit}
          isSaving={isSaving}
          isSubmitDisabled={!canResubmit}
        />
      </>
    );
  }

  return (
    <>
      <div className='person-learning-listener person-learning-listener_review'>
        {allSectionsConfirmed ? (
          <p className='person-learning-listener__status'>
            Все разделы заполнены и подтверждены. Вы можете отправить документы на проверку.
          </p>
        ) : (
          <p className='person-learning-listener__status person-learning-listener__status_warning'>
            Для отправки документов на проверку необходимо заполнить и подтвердить все
            предыдущие разделы: «Информация о слушателе», «Обработка ПД», «СНИЛС» и «Диплом».
          </p>
        )}
      </div>

      <PersonLearningListenerFooter
        variant='review'
        onBack={onBack}
        onSubmit={onSubmit}
        isSaving={isSaving}
        isSubmitDisabled={isSubmitDisabled}
      />
    </>
  );
};

export default PersonLearningListenerReviewTab;
