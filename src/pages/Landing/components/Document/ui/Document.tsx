import type { FC } from 'react';

import Button from '../../../../../shared/components/Button/ui/Button';
import { ENAV } from '../../../../../shared/components/Navigation/interface/interface';

import '../styles/style.css';

interface IDocumentProps {
  windowWidth: number;
}

const Document: FC<IDocumentProps> = ({ windowWidth }) => {

  const btnLinksStyle = {
    margin: '0',
    width: '100%',
    fontSize: windowWidth > 1000 ? '24px' : '18px',
    height: windowWidth > 1000 ? '60px' : '40px',
    lineHeight: '1',
    padding: '8px 20px',
  };
  
  const btnRegStyle = {
    margin: '0',
    width: '100%',
    fontSize: windowWidth > 1000 ? '24px' : '18px',
    height: windowWidth > 1000 ? '60px' : '40px',
    borderRadius: windowWidth > 1000 ? '20px' : '12px',
    lineHeight: '1',
    padding: '8px 20px',
  };
  
  return (
    <div className='document' id={ENAV.DOCUMENT}>
      <h2 className='document__title'>ДОКУМЕНТЫ</h2>
      <div className='document__buttons'>
        <Button 
          text='СКАЧАТЬ ПОЛОЖЕНИЕ' 
          type='link' 
          link='https://cloud.mail.ru/public/D2WW/96UszWzkP'
          style={btnLinksStyle} 
        />
        <Button 
          text='СКАЧАТЬ РЕГЛАМЕНТ' 
          type='link' 
          link='https://cloud.mail.ru/public/krgk/cMSykKYCT'
          style={btnLinksStyle} 
        />
        <Button 
          text='ВЕБИНАР "ЭТАПЫ КОНКУРСА"' 
          type='link' 
          link='https://course.emiit.ru/webtutor/ivan/land/video/video3.mp4'
          color='registration'
          style={btnRegStyle} 
        />
      </div>
    </div>
  );
};

export default Document;
