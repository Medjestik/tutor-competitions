import type { FC } from 'react';
import type { IStage, IStageNavItem, ILearningNavItem } from '../interface/interface';

import { useState, useEffect, useCallback } from 'react';
import { Navigate, Routes, Route, useNavigate, useLocation } from 'react-router-dom';

import * as api from '../../../shared/utils/api';
import { useSelector } from '../../../store/store';

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
import { getSettings } from '../../../shared/api/user';

import { EROUTES, EROUTESSTAGES, EROUTESLEARNING } from '../../../shared/utils/ERoutes';
import { personStages, buildPersonStages, learningNavItems } from '../lib/stages';
import {
  PRACTICE_FORM_STAGE_ID,
  getClosedPracticeFormMessage,
} from '../lib/practiceFormClosed';

import '../styles/style.css';

const Person: FC = () => {

  const currentUser = useSelector((state) => state.user.user)!;

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [stages, setStages] = useState<IStageNavItem[]>(() =>
    buildPersonStages(
      currentUser.current_stage_id,
      currentUser.passed_second_stage,
    ),
  );
  const [openStageId, setOpenStageId] = useState<number>(personStages[0].id);
  const [openLearningId, setOpenLearningId] = useState<string | null>(null);
  /** null = settings not loaded yet; avoid treating as disabled before resolve */
  const [isEducationEnabled, setIsEducationEnabled] = useState<boolean | null>(null);
  const [isPracticeFormOpen, setIsPracticeFormOpen] = useState<boolean>(true);
  const [practiceFormStatus, setPracticeFormStatus] = useState<string | null>(null);

  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);
  const educationOn = isEducationEnabled === true;
  const onLearningPath = pathname.includes('/learning/');
  const waitingEducationForLearning =
    isEducationEnabled === null && onLearningPath;

  const withClosedFormNav = useCallback(
    (baseStages: IStageNavItem[], formStatus: string | null, formOpen: boolean) => {
      if (formOpen) {
        return baseStages;
      }
      return baseStages.map((stage) =>
        stage.id === PRACTICE_FORM_STAGE_ID
          ? {
              ...stage,
              description: getClosedPracticeFormMessage(formStatus),
              type: 'default' as const,
            }
          : stage,
      );
    },
    [],
  );

  const toggleStage = (stage: IStageNavItem) => {
    setOpenLearningId(null);
    navigate(stage.route);
  };

  const toggleLearning = (item: ILearningNavItem) => {
    navigate(item.route);
  };

  const onChangeStage = (id: number) => {
    console.log(id);
  };

  const handleNextStage = () => {
    const token = localStorage.getItem('token');
    if (token) {
      api.nextStage(token)
      .then((res) => {
        onChangeStage(res.current_stage.id);
        const newStages = buildPersonStages(
          res.current_stage.id,
          currentUser.passed_second_stage,
        );
        setStages(withClosedFormNav(newStages, practiceFormStatus, isPracticeFormOpen));
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
      
        setStages(withClosedFormNav(newStages, practiceFormStatus, isPracticeFormOpen));
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
    getSettings()
      .then((settings) => {
        setIsEducationEnabled(settings.enable_education === true);
        // Missing key → open (same as backend default)
        setIsPracticeFormOpen(settings.practice_form_open !== false);
      })
      .catch(() => {
        setIsEducationEnabled(false);
        setIsPracticeFormOpen(true);
      });
  }, []);

  useEffect(() => {
    if (isPracticeFormOpen) {
      setPracticeFormStatus(null);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    api
      .getFormData(token)
      .then((form) => {
        setPracticeFormStatus(form.status ?? null);
      })
      .catch((err) => {
        console.error(err);
        setPracticeFormStatus(null);
      });
  }, [isPracticeFormOpen]);

  useEffect(() => {
    const base = buildPersonStages(
      currentUser.current_stage_id,
      currentUser.passed_second_stage,
    );
    setStages(withClosedFormNav(base, practiceFormStatus, isPracticeFormOpen));
  }, [
    currentUser.current_stage_id,
    currentUser.passed_second_stage,
    isPracticeFormOpen,
    practiceFormStatus,
    withClosedFormNav,
  ]);

  useEffect(() => {
    // Only bounce after settings resolve to disabled — not while still null
    if (isEducationEnabled === false && onLearningPath) {
      setOpenLearningId(null);
      navigate(EROUTES.PERSON, { replace: true });
      return;
    }

    if (isEducationEnabled === null && onLearningPath) {
      return;
    }

    const matchedLearning = learningNavItems.find((item) => pathname === item.route);

    if (matchedLearning && educationOn) {
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
  }, [educationOn, isEducationEnabled, navigate, onLearningPath, pathname, stages]);

  return (
    isLoadingData || waitingEducationForLearning
    ?
    <Preloader />
    :
    <MainLayout mainContainer={false} transparentMain > 
      <div className='person'>
        <PersonNavigation
          stages={stages}
          openStageId={openStageId}
          onChange={toggleStage}
          openLearningId={openLearningId}
          onLearningChange={toggleLearning}
          isEducationEnabled={educationOn}
        /> 
        <PersonContainer>
          {
            isLoadingData || !stages.length
            ?
            <Preloader />
            :
            <Routes>
              <Route index element={<PersonStageInitial />} />
              <Route path="menu/*" element={<Navigate to={EROUTES.PERSON} replace />} />
              <Route
                path={EROUTESSTAGES.PERSON_FORM}
                element={
                  <PersonStageForm
                    onNextStage={handleNextStage}
                    isPracticeFormOpen={isPracticeFormOpen}
                    isEducationEnabled={educationOn}
                  />
                }
              />
              <Route path={EROUTESSTAGES.PERSON_SCHEDULE} element={<PersonStageSchedule />} />
              <Route path={EROUTESSTAGES.PERSON_SLIDES} element={<PersonStageSlides />} />
              <Route path={EROUTESSTAGES.PERSON_WORKSHOP} element={<PersonStageWorkshop />} />
              <Route path={EROUTESSTAGES.PERSON_EVALUATE} element={<PersonStageEvaluate />} />
              {educationOn && (
                <>
                  <Route path={EROUTESLEARNING.PROGRAM} element={<PersonLearningProgram />} />
                  <Route path={EROUTESLEARNING.LISTENER} element={<PersonLearningListener />} />
                  <Route path={EROUTESLEARNING.MATERIALS} element={<PersonLearningMaterials />} />
                </>
              )}
            </Routes>
          }
        </PersonContainer>
      </div>
    </MainLayout>
  );
};

export default Person;
