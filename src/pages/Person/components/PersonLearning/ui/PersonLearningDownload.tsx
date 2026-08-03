import type { FC } from 'react';
import type { IPersonLearningDownloadProps } from '../interface/interface';

import Button from '../../../../../shared/components/Button/ui/Button';

import '../styles/style.css';

const PersonLearningDownload: FC<IPersonLearningDownloadProps> = ({
  title,
  description,
  href,
}) => {
  return (
    <div className='person-learning-download'>
      <div className='person-learning-download__text'>
        <p className='person-learning-download__title'>{title}</p>
        <p className='person-learning-download__desc'>{description}</p>
      </div>
      <div className='person-learning-download__btn'>
        <Button
          text='Скачать'
          type='link'
          href={href}
          color='default'
          style={{
            margin: 0,
            fontSize: '16px',
            fontWeight: 500,
            height: '48px',
            minWidth: '111px',
            padding: '16px 24px',
            lineHeight: 1,
          }}
        />
      </div>
    </div>
  );
};

export default PersonLearningDownload;
