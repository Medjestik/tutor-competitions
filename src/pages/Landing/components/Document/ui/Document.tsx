import type { FC } from 'react';

import Button from '../../../../../shared/components/Button/ui/Button';
import { ENAV } from '../../../../../shared/components/Navigation/interface/interface';

import '../styles/style.css';

interface IDocumentProps {
  windowWidth: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Document: FC<IDocumentProps> = ({ windowWidth }) => {


  return (
    <div className='document' id={ENAV.DOCUMENT}>
      <h2 className='document__title'>ДОКУМЕНТЫ</h2>
      <div className='document__info'>
        <p className='document__text'>Ознакомьтесь с основными документами конкурса и условиями участия перед регистрацией.</p>
        <div className='document__buttons'>
          <Button 
            text='СКАЧАТЬ ПОЛОЖЕНИЕ' 
            type='link' 
            href='https://cloud.mail.ru/public/D2WW/96UszWzkP'
            width='full'
          />
          <Button 
            text='СКАЧАТЬ РЕГЛАМЕНТ' 
            type='link' 
            href='https://cloud.mail.ru/public/krgk/cMSykKYCT'
            width='full'
          />
          <Button 
            text='ИТОГИ ФИНАЛА' 
            type='link' 
            href='https://cloud.mail.ru/public/K46H/qmUUPH3Wz'
            color='gradient'
            width='full'
          />
        </div>
      </div>
    </div>
  );
};

export default Document;
