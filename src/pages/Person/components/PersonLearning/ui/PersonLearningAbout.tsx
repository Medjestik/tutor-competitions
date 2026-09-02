import type { FC } from 'react';
import type { IPersonLearningAboutProps } from '../interface/interface';

import Button from '../../../../../shared/components/Button/ui/Button';

import { programContent } from '../mock/programContent';

import '../styles/style.css';

const PersonLearningAbout: FC<IPersonLearningAboutProps> = ({ onContinue }) => {
  return (
    <>
      <div className='person-learning__grid'>
        {
          /*

                  <div className='person-learning__left'>
          <div className='person-learning__video-wrap'>
            <PersonVideo url='' isEmpty />
          </div>
          <PersonLearningDownload
            title={programContent.downloadTitle}
            description={programContent.downloadDescription}
            href={programContent.pdfUrl}
          />
        </div>
          */
        }


        <div className='person-learning__info'>
          <p className='person-learning__info-title'>{programContent.aboutTitle}</p>
          <p className='person-learning__info-text'>{programContent.aboutText}</p>
        </div>
      </div>

      <div className='person-learning__footer'>
        <Button
          text='Продолжить'
          color='gradient'
          onClick={onContinue}
          style={{
            margin: 0,
            fontSize: '16px',
            fontWeight: 500,
            height: '48px',
            minWidth: '141px',
            padding: '16px 24px',
            lineHeight: 1,
          }}
        />
      </div>
    </>
  );
};

export default PersonLearningAbout;
