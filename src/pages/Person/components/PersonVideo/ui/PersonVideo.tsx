import type { FC } from 'react';

import { useRef, useState } from 'react';

import poster from '../../../../../shared/images/poster.png';

import '../styles/style.css';

interface IPersonVideo {
  url: string;
}

const PersonVideo: FC<IPersonVideo> = ({ url }) => {

  const [isVideoPlay, setIsVideoPlay] = useState<boolean>(false);

  const vidRef = useRef<HTMLVideoElement>(null);

  const handlePlayVideo = () => {
    if (vidRef.current) {
      vidRef.current.play();
      setIsVideoPlay(true);
    }
  };

  return (
    <div className='person-video__container'>
      <video 
        className='person-video'
        ref={vidRef} 
        poster={poster}          
        controls={isVideoPlay}
        >
        <source src={url} type='video/mp4' />
      </video>
      {
        !isVideoPlay &&
        <>
          <div className='person-video__overlay'></div>
          {
            url &&
            <button className='person-video__play-btn' onClick={handlePlayVideo}></button>
          }
        </>
      }

    </div>
  );
};

export default PersonVideo;
