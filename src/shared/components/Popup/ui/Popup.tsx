import type { FC } from 'react';
import type { IPopupProps } from '../interface/interface';

import { useRef } from 'react';
import useOnClickOutside from '../../../hooks/useOnClickOutside';

import '../styles/style.css';

const Popup: FC<IPopupProps> = ({
  isOpen,
  onClose,
  popupWidth,
  closeOutside = false,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(containerRef, (event) => {
    if (!closeOutside || !isOpen) {
      return;
    }
    onClose();
    event.stopPropagation();
  });

  return (
    <div className={`popup ${isOpen ? 'popup_opened' : ''}`}>
      <div
        ref={containerRef}
        className={`popup__container popup__form_container_${popupWidth}`}
      >
        {children}
      </div>
    </div>
  );
};

export default Popup;
