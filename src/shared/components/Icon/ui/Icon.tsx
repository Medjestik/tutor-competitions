import type { FC } from 'react';
import type { IIconProps } from '../interface/interface';

import '../styles/style.css';

const Icon: FC<IIconProps> = ({ type, color = 'primary', width = '24', style, onClick }) => {
  return (
    <div
      style={style} 
      className={
        `icon 
        ${color ? `icon_color_${color}` : ''} 
        ${width ? `icon_width_${width}` : ''} 
        ${type ? `icon_type_${type}` : ''}
        ${onClick ? 'icon_active' : ''}
        `
      } 
      onClick={onClick}
    >
    </div>
  );
};

export default Icon; 
