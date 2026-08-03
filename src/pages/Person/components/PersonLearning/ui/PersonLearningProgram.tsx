import type { FC } from 'react';
import type { TLearningTab } from '../interface/interface';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { EROUTES, EROUTESLEARNING } from '../../../../../shared/utils/ERoutes';

import PersonLearningTabs from './PersonLearningTabs';
import PersonLearningAbout from './PersonLearningAbout';
import PersonLearningFaq from './PersonLearningFaq';

import { programContent } from '../mock/programContent';

import '../styles/style.css';

const PersonLearningProgram: FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TLearningTab>('about');

  const goToListener = () => {
    navigate(`${EROUTES.PERSON}/${EROUTESLEARNING.LISTENER}`);
  };

  return (
    <div className='person-learning'>
      <div className='person-learning__header'>
        <h2 className='person-learning__title'>{programContent.title}</h2>
        <p className='person-learning__lead'>{programContent.lead}</p>
      </div>

      <PersonLearningTabs activeTab={activeTab} onChange={setActiveTab} />

      <div className='person-learning__body'>
        {activeTab === 'about' ? (
          <PersonLearningAbout onContinue={goToListener} />
        ) : (
          <PersonLearningFaq onBack={() => setActiveTab('about')} onUpload={goToListener} />
        )}
      </div>
    </div>
  );
};

export default PersonLearningProgram;
