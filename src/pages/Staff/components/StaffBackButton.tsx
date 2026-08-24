import type { FC } from 'react';

import { useNavigate } from 'react-router-dom';

import './staff-back-button.css';

interface IStaffBackButtonProps {
  fallbackTo: string;
  text?: string;
}

const StaffBackButton: FC<IStaffBackButtonProps> = ({
  fallbackTo,
  text = 'Назад',
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate(fallbackTo);
  };

  return (
    <button type='button' className='staff-back-button' onClick={handleBack}>
      ← {text}
    </button>
  );
};

export default StaffBackButton;
