import type { FC } from 'react';
import type { CountdownRenderProps } from 'react-countdown';

import Countdown from 'react-countdown';

import { ICountdownTimerProps } from '../interface/interface';

import '../styles/style.css';

const CountdownTimer: FC<ICountdownTimerProps> = ({ targetDate }) => {
  const renderer = ({ days, hours, minutes, seconds }: CountdownRenderProps) => {
    const pad = (num: number) => String(num).padStart(2, '0');
    return (
      <>
        {pad(days)}<span className='countdown-days'>дн.</span> {pad(hours)}:{pad(minutes)}:{pad(seconds)}
      </>
    );
  };

  return <Countdown date={new Date(targetDate)} renderer={renderer} />;
};

export default CountdownTimer;
