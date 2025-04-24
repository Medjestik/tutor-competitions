import type { FC } from 'react';
import type { IPopupProps } from '../interface/interface';

import { createRef } from 'react';
import useOnClickOutside from '../../../hooks/useOnClickOutside';

import '../styles/style.css';

const Popup: FC<IPopupProps> = ({ isOpen, onClose, popupWidth, closeOutside = false, children }) => {

  const containerRef = createRef<HTMLDivElement>();

  if (closeOutside) {
    useOnClickOutside(containerRef, onClose);
  }

  return (
    <div className={`popup ${isOpen ? 'popup_opened' : ''}`}>
      <div ref={containerRef} className={`popup__container popup__form_container_${popupWidth}`}>
        {children}
      </div>
    </div>
  );
};

export default Popup;
