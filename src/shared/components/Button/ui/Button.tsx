import type { FC } from 'react';
import type { IButtonProps } from '../interface/interface';

import '../styles/style.css';

const Button: FC<IButtonProps> = ({ text, color, width, style, type = 'button', link, onClick }) => {
  return (
    <>
    {
      type === 'link' 
      ?
      <a
        style={style} 
        className={`button ${color ? `button_color_${color}` : ''} ${width ? `button_width_${width}` : ''}`} 
        href={link || ''}
        target='_blank'
        rel='noreferrer'
      >
        {text}
      </a>
      :
      <button 
        style={style} 
        className={`button ${color ? `button_color_${color}` : ''} ${width ? `button_width_${width}` : ''}`} 
        type='button'
        onClick={onClick}
      >
        {text}
      </button>
    }
    </>
  );
};

export default Button;
