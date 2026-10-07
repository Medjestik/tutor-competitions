import { EROUTES, EROUTESSTAGES } from '../../../shared/utils/ERoutes';

export const personStages = [
  {
    name: 'Начало',
    description: 'Основная информация',
    id: 0,
    route: EROUTES.PERSON,
    is_active: true,
    position: 0,
    view: 'info',
    type: 'default',
    url_template: '',
    url_video: '',
    team_file_count: 0,
    team_videos: [],
  },
  {
    name: 'Анкета практики',
    description: 'Заполните форму',
    id: 1,
    route: `${EROUTES.PERSON}/${EROUTESSTAGES.PERSON_FORM}`,
    is_active: true,
    position: 1,
    view: 'stage',
    type: 'default',
    url_template: '',
    url_video: '',
    team_file_count: 0,
    team_videos: [],
  },
  {
    name: 'Результаты 1 этапа',
    description: 'Итоги этапа',
    id: 2,
    route: `${EROUTES.PERSON}/${EROUTESSTAGES.PERSON_RESULTS}`,
    is_active: true,
    position: 2,
    view: 'stage',
    type: 'default',
    url_template: '',
    url_video: '',
    team_file_count: 0,
    team_videos: [],
  },
  {
    name: 'Видеопрезентация',
    description: 'Запишите ролик',
    id: 3,
    route: `${EROUTES.PERSON}/${EROUTESSTAGES.PERSON_SLIDES}`,
    is_active: true,
    position: 3,
    view: 'stage',
    type: 'default',
    url_template: '',
    url_video: '',
    team_file_count: 0,
    team_videos: [],
  },
  {
    name: 'Результаты 2 этапа',
    description: 'Дождитесь решения жюри',
    id: 4,
    route: `${EROUTES.PERSON}/${EROUTESSTAGES.PERSON_WORKSHOP}`,
    is_active: true,
    position: 4,
    view: 'stage',
    type: 'default',
    url_template: '',
    url_video: '',
    team_file_count: 0,
    team_videos: [],
  },
  {
    name: 'Финал',
    description: 'Главное для финалистов',
    id: 5,
    route: `${EROUTES.PERSON}/${EROUTESSTAGES.PERSON_EVALUATE}`,
    is_active: true,
    position: 5,
    view: 'stage',
    type: 'default',
    url_template: '',
    url_video: '',
    team_file_count: 0,
    team_videos: [],
  },
];

const STAGE1_RESULTS_STAGE_ID = 2;
const VIDEO_PRESENTATION_STAGE_ID = 3;
const STAGE1_RESULTS_WAITING_DESCRIPTION = 'Дождитесь решения жюри';

/** Разблокирует пункты навигации по текущему этапу пользователя (id из personStages). */
export function buildPersonStages(
  currentStageId: number,
  passedSecondStage = false,
  stage1ResultsPublished = false,
): typeof personStages {
  const unlockedThroughId = currentStageId > 0 ? currentStageId : 1;

  return personStages.map((stage) => {
    if (stage.id === STAGE1_RESULTS_STAGE_ID) {
      return {
        ...stage,
        type: stage1ResultsPublished ? ('default' as const) : ('block' as const),
        description: stage1ResultsPublished
          ? stage.description
          : STAGE1_RESULTS_WAITING_DESCRIPTION,
      };
    }
    if (stage.id === VIDEO_PRESENTATION_STAGE_ID) {
      return {
        ...stage,
        type: passedSecondStage ? ('default' as const) : ('block' as const),
      };
    }
    return {
      ...stage,
      type: unlockedThroughId >= stage.id ? ('default' as const) : ('block' as const),
    };
  });
}

export const personStagesClose = [
  {
    name: 'Начало',
    description: 'Основная информация',
    id: 0,
    route: EROUTES.PERSON,
    is_active: true,
    position: 0,
    view: 'info',
    type: 'default',
    url_template: '',
    url_video: '',
    team_file_count: 0,
    team_videos: [],
  },
  {
    name: 'Анкета практики',
    description: 'Заполните форму',
    id: 1,
    route: `${EROUTES.PERSON}/${EROUTESSTAGES.PERSON_FORM}`,
    is_active: true,
    position: 1,
    view: 'stage',
    type: 'block',
    url_template: '',
    url_video: '',
    team_file_count: 0,
    team_videos: [],
  },
  {
    name: 'Результаты 1 этапа',
    description: 'Дождитесь решения жюри',
    id: 2,
    route: `${EROUTES.PERSON}/${EROUTESSTAGES.PERSON_RESULTS}`,
    is_active: true,
    position: 2,
    view: 'stage',
    type: 'block',
    url_template: '',
    url_video: '',
    team_file_count: 0,
    team_videos: [],
  },
  {
    name: 'Видеопрезентация',
    description: 'Запишите ролик',
    id: 3,
    route: `${EROUTES.PERSON}/${EROUTESSTAGES.PERSON_SLIDES}`,
    is_active: true,
    position: 3,
    view: 'stage',
    type: 'block',
    url_template: '',
    url_video: '',
    team_file_count: 0,
    team_videos: [],
  },
  {
    name: 'Результаты 2 этапа',
    description: 'Дождитесь решения жюри',
    id: 4,
    route: `${EROUTES.PERSON}/${EROUTESSTAGES.PERSON_WORKSHOP}`,
    is_active: true,
    position: 4,
    view: 'stage',
    type: 'block',
    url_template: '',
    url_video: '',
    team_file_count: 0,
    team_videos: [],
  },
  {
    name: 'Финал',
    description: 'Главное для финалистов',
    id: 5,
    route: `${EROUTES.PERSON}/${EROUTESSTAGES.PERSON_EVALUATE}`,
    is_active: true,
    position: 5,
    view: 'stage',
    type: 'block',
    url_template: '',
    url_video: '',
    team_file_count: 0,
    team_videos: [],
  },
];

export const learningNavItems = [
  {
    id: 'program',
    number: '01',
    name: 'Программа',
    description: 'Информация о программе',
    route: `${EROUTES.PERSON}/learning/program`,
  },
  {
    id: 'listener',
    number: '02',
    name: 'Данные слушателя',
    description: 'Личный листок',
    route: `${EROUTES.PERSON}/learning/listener`,
  },
  {
    id: 'learning',
    number: '03',
    name: 'Обучение',
    description: 'Материалы обучения',
    route: `${EROUTES.PERSON}/learning/materials`,
  },
];
