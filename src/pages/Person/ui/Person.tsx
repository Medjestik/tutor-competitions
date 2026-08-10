import type { FC } from 'react';
import type { IPersonProps, IStage, IStageNavItem, ILearningNavItem } from '../interface/interface';

import { useState, useEffect, useContext } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

import * as api from '../../../shared/utils/api';
import { CurrentUserContext } from '../../../shared/context/team';

import MainLayout from '../../../shared/components/Layout/ui/MainLayout';
import Preloader from '../../../shared/components/Preloader/ui/Preloader';
import PersonNavigation from '../components/PersonNavigation/ui/PersonNavigation';
import PersonContainer from '../components/PersonContainer/ui/PersonContainer';
import PersonStageInitial from '../components/PersonStage/ui/PersonStageInitial';
import PersonStageForm from '../components/PersonStage/ui/PersonStageForm';
import PersonStageSchedule from '../components/PersonStage/ui/PersonStageSchedule';
import PersonStageSlides from '../components/PersonStage/ui/PersonStageSlides';
import PersonStageWorkshop from '../components/PersonStage/ui/PersonStageWorkshop';
import PersonStageEvaluate from '../components/PersonStage/ui/PersonStageEvaluate';
import PersonLearningProgram from '../components/PersonLearning/ui/PersonLearningProgram';
import PersonLearningListener from '../components/PersonLearning/ui/PersonLearningListener';
import PersonLearningMaterials from '../components/PersonLearning/ui/PersonLearningMaterials';

import { EROUTES, EROUTESSTAGES, EROUTESLEARNING } from '../../../shared/utils/ERoutes';
import { personStages, personStagesClose, learningNavItems } from '../lib/stages';

import '../styles/style.css';

const Person: FC<IPersonProps> = ({ windowWidth, onLogout, onChangeStage }) => {

  const currentUser = useContext(CurrentUserContext);

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [stages, setStages] = useState<IStageNavItem[]>(currentUser.passed_second_stage ? personStages : personStagesClose);
  const [openStageId, setOpenStageId] = useState<number>(personStages[0].id);
  const [openLearningId, setOpenLearningId] = useState<string | null>(null);

  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);

  const toggleStage = (stage: IStageNavItem) => {
    setOpenLearningId(null);
    navigate(stage.route);
  };

  const toggleLearning = (item: ILearningNavItem) => {
    navigate(item.route);
  };

  const handleNextStage = () => {
    const token = localStorage.getItem('token');
    if (token) {
      api.nextStage(token)
      .then((res) => {
        onChangeStage(res.current_stage.id);
        const newStages = stages.map((elem: IStageNavItem) => ({ ...elem, type: res.current_stage.id >= elem.id ? 'default' : 'block' }));
        setStages(newStages);
        toggleStage(res.current_stage);
      })
      .catch((err) => {
        console.error(err);
      });
    }
  };

  const getData = () => {
    setIsLoadingData(true);
    const token = localStorage.getItem('token');
    if (token) {
      api.getStages(token)
      .then((res) => {
        const stageRouteMap: Record<number, string> = {
          1: `${EROUTES.PERSON}/${EROUTESSTAGES.PERSON_FORM}`,
          2: `${EROUTES.PERSON}/${EROUTESSTAGES.PERSON_RESULTS}`,
          3: `${EROUTES.PERSON}/${EROUTESSTAGES.PERSON_SCHEDULE}`,
          4: `${EROUTES.PERSON}/${EROUTESSTAGES.PERSON_SLIDES}`,
          5: `${EROUTES.PERSON}/${EROUTESSTAGES.PERSON_WORKSHOP}`,
          6: `${EROUTES.PERSON}/${EROUTESSTAGES.PERSON_EVALUATE}`,
        };
      
        const newStages = res.map((elem: IStage) => ({
          ...elem,
          route: stageRouteMap[elem.id] || `/person/stage-${elem.id}`,
          view: 'stage',
          type: currentUser.current_stage_id >= elem.id ? 'default' : 'block'
        }));
      
        setStages([...newStages]);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setIsLoadingData(false));
    }
  };

  useEffect(() => {
    const close = false;
    if (close) {
      getData();
    }
  }, []);

  useEffect(() => {
    const matchedLearning = learningNavItems.find((item) => pathname === item.route);

    if (matchedLearning) {
      setOpenLearningId(matchedLearning.id);
      setOpenStageId(-1);
      return;
    }

    setOpenLearningId(null);

    if (pathname === EROUTES.PERSON || pathname === `${EROUTES.PERSON}/`) {
      setOpenStageId(0);
      return;
    }
    const matched = stages.find(stage => stage.route !== EROUTES.PERSON && pathname.endsWith(stage.route));
    if (matched) {
      setOpenStageId(matched.id);
    }
  }, [pathname, stages]);

  return (
    isLoadingData
    ?
    <Preloader />
    :
    <MainLayout mainContainer={false} transparentMain windowWidth={windowWidth} onLogout={onLogout} > 
      <div className='person'>
        <PersonNavigation
          stages={stages}
          openStageId={openStageId}
          onChange={toggleStage}
          openLearningId={openLearningId}
          onLearningChange={toggleLearning}
        /> 
        <PersonContainer>
          {
            isLoadingData || !stages.length
            ?
            <Preloader />
            :
            <Routes>
              <Route index element={<PersonStageInitial />} />
              <Route path={EROUTESSTAGES.PERSON_FORM} element={<PersonStageForm onNextStage={handleNextStage} />} />
              <Route path={EROUTESSTAGES.PERSON_SCHEDULE} element={<PersonStageSchedule />} />
              <Route path={EROUTESSTAGES.PERSON_SLIDES} element={<PersonStageSlides />} />
              <Route path={EROUTESSTAGES.PERSON_WORKSHOP} element={<PersonStageWorkshop />} />
              <Route path={EROUTESSTAGES.PERSON_EVALUATE} element={<PersonStageEvaluate />} />
              <Route path={EROUTESLEARNING.PROGRAM} element={<PersonLearningProgram />} />
              <Route path={EROUTESLEARNING.LISTENER} element={<PersonLearningListener />} />
              <Route path={EROUTESLEARNING.MATERIALS} element={<PersonLearningMaterials />} />
            </Routes>
          }
        </PersonContainer>
      </div>
    </MainLayout>
  );
};

export default Person;
