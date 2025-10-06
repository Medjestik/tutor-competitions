import { FC, useState } from 'react';
import '../styles/style.css';

interface IRatingStarsProps {
  value: number; // выбранный рейтинг (1–5)
  onChange: (value: number) => void; // callback при выборе
}

const RatingStars: FC<IRatingStarsProps> = ({ value, onChange }) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const handleMouseEnter = (index: number) => {
    setHoverValue(index);
  };

  const handleMouseLeave = () => {
    setHoverValue(null);
  };

  const handleClick = (index: number) => {
    onChange(index);
  };

  return (
    <div className="rating-stars">
      {[1, 2, 3, 4, 5].map((index) => (
        <span
          key={index}
          className={`rating-star ${
            (hoverValue ?? value) >= index ? 'rating-star_active' : ''
          }`}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(index)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default RatingStars;
