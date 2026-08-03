import type { FC } from 'react';
import type { IPersonLearningListenerFieldProps } from '../../interface/interface';

import { Tooltip } from '../../../../../../shared/components/Tooltip/ui/tooltip';
import { getListenerFieldNameAttribute } from '../../lib/listenerValidation';

import '../../styles/listener.css';

const PersonLearningListenerField: FC<IPersonLearningListenerFieldProps> = ({
  title,
  withInfo = false,
  infoText = '',
  caption = '',
  titleColor = 'default',
  fieldError,
  fieldKey,
  children,
  className = '',
}) => {
  const hasError = Boolean(fieldError?.isShow && fieldError.text);

  return (
    <div
      className={`person-learning-listener-field${hasError ? ' person-learning-listener-field_has-error' : ''} ${className}`.trim()}
      data-listener-field={fieldKey ? getListenerFieldNameAttribute(fieldKey) : undefined}
    >
      <div className='person-learning-listener-field__header'>
        <p
          className={`person-learning-listener-field__title${
            titleColor === 'primary' ? ' person-learning-listener-field__title_primary' : ''
          }`}
        >
          {title}
        </p>
        {withInfo && infoText && (
          <Tooltip
            content={
              <p className='person-learning-listener-field__tooltip-text'>{infoText}</p>
            }
          >
            <div className='person-learning-listener-field__info' />
          </Tooltip>
        )}
      </div>
      {children}
      {hasError ? (
        <p className='person-learning-listener-field__error'>{fieldError?.text}</p>
      ) : (
        caption && (
          <p className='person-learning-listener-field__caption'>{caption}</p>
        )
      )}
    </div>
  );
};

export default PersonLearningListenerField;
