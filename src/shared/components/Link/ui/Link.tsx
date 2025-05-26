import type { FC } from 'react';
import type { ILinkProps } from '../interface/interface';

import '../styles/style.css';

const Link: FC<ILinkProps> = ({ text, path, target = true }) => {
  return (
    <>
    {
      target
      ?
      <a 
        className='link'
        target='_blank'
        rel='norefferer'
        href={path}
      >
        {text}
      </a>
      :
      <a 
        className='link'
        href={path}
      >
        {text}
      </a>
      }
    </>

  );
};

export default Link;
