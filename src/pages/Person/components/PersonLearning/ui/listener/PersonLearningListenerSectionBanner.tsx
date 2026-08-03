import type { FC } from 'react';
import type { TListenerTab } from '../../interface/interface';

import { sectionConfirmedMessages } from '../../mock/listenerContent';

import '../../styles/listener.css';

interface IPersonLearningListenerSectionBannerProps {
  section: TListenerTab;
}

const PersonLearningListenerSectionBanner: FC<IPersonLearningListenerSectionBannerProps> = ({
  section,
}) => {
  return (
    <div className='person-learning-listener-section-banner' role='status'>
      <p className='person-learning-listener-section-banner__text'>
        {sectionConfirmedMessages[section]}
      </p>
    </div>
  );
};

export default PersonLearningListenerSectionBanner;
