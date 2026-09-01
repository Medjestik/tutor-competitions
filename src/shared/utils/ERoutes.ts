export enum EROUTES {
  LANDING = '/',
  INTERNATIONAL = '/international',
  REGISTRATION = '/registration',
  LOGIN = '/login',
  FORGOT_PASSWORD = '/forgot-password',
  RESET_PASSWORD = '/reset-password/:uid/:token',
  PERSON = '/person',
  RECORDS = '/records',
  CONSENT = '/consent',
  PRIVACY = '/privacy',
  STAFF_LEARNING_APPLICATIONS = '/staff/learning-applications',
  STAFF_LEARNING_APPLICATION = '/staff/learning-applications/:id',
  STAFF_LMS = '/staff/lms',
  STAFF_LMS_COURSES = '/staff/lms/courses',
  STAFF_LMS_COURSE = '/staff/lms/courses/:id',
  STAFF_LMS_TESTS = '/staff/lms/tests',
  STAFF_LMS_TEST = '/staff/lms/tests/:id',
  STAFF_LMS_TASKS = '/staff/lms/tasks',
  STAFF_LMS_TASK = '/staff/lms/tasks/:id',
  STAFF_SETTINGS = '/staff/settings',
  STAFF_SETTING = '/staff/settings/:id',
  STAFF_TASK_REVIEWS = '/staff/task-reviews',
}

export enum EROUTESSTAGES {
  PERSON = '',
  PERSON_FORM = 'form',
  PERSON_RESULTS = 'results',
  PERSON_SCHEDULE = 'schedule',
  PERSON_SLIDES = 'slides',
  PERSON_WORKSHOP = 'workshop',
  PERSON_EVALUATE = 'evaluate',
}

export enum EROUTESLEARNING {
  PROGRAM = 'learning/program',
  LISTENER = 'learning/listener',
  MATERIALS = 'learning/materials',
}
