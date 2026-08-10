export enum EROUTES {
  LANDING = '/',
  INTERNATIONAL = '/international',
  REGISTRATION = '/registration',
  LOGIN = '/login',

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
