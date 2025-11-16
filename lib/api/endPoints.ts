export const API_ENDPOINTS = {

  //auth
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
  VERIFY_OTP: '/auth/verify-otp-token',
  USER_PROFILE: '/auth/account/me',
  RESEND_OTP: '/auth/resend-otp',
  LOGOUT: '/auth/account/logout',
  REFRESH_TOKEN: '/auth/refresh',
  FORGOT_PASSWORD: '/auth/initiate-forget-password',
  RESET_PASSWORD: '/auth/forget-password',
  GROUPED_PERMISSIONS: '/permissions/grouped',
  CREATE_ROLE: '/roles',
  UPDATE_ROLE: '/roles',

  // file upload
  UPLOAD_FILE: '/upload',
  DELETE_FILE: '/upload',

  // user and staff management
  CREATE_STAFF_USER: '/staff',
  STAFF_USERS: '/staff',
  DELETE_STAFF_USER: '/staff',

  // location
  COUNTRIES: '/location/country',
  STATES: '/location/{countryId}/state',
  CITIES: '/location/{countryId}/{stateId}/city',

  //project
  PROJECTS: '/project',
  CREATE_PROJECT: '/project',
  UPDATE_PROJECT: '/project/{id}',
  DELETE_PROJECT: '/project/{id}',


  // schedule management
  GET_PHASES: '/phases',
  CREATE_PHASE: '/phases',
  GET_PHASE_BY_ID: '/phases/{id}',
  UPDATE_PHASE: '/phases/{id}',
  DELETE_PHASE: '/phases/{id}',
  CREATE_ACTIVITY: '/activities',
  GET_ACTIVITY: '/activities',
  UPDATE_ACTIVITY: '/activities/{id}',
  DELETE_ACTIVITY: '/activities/{id}',

  //working days config
  WORKING_DAYS_CONFIG: 'working-days-config/project/{projectId}',
  UPDATE_WORKING_DAYS_CONFIG: 'working-days-config/{id}',

  //production-planning
  CREATE_EQUIPMENT: '/production-planning/projects/equipment',
  GET_EQUIPMENT: '/production-planning/projects/equipment',
  UPDATE_EQUIPMENT: '/production-planning/projects/equipment/{id}',
  DELETE_EQUIPMENT: '/production-planning/projects/equipment/{id}',

  GET_LABOURERS: '/production-planning/projects/labourers',
  CREATE_LABOURER: '/production-planning/projects/labourers',
  UPDATE_LABOURER: '/production-planning/projects/labourers/{id}',
  DELETE_LABOURER: '/production-planning/projects/labourers/{id}',

  CREATE_CREW: '/production-planning/projects/crews',
  GET_CREWS: '/production-planning/projects/crews',
  UPDATE_CREW: '/production-planning/projects/crews/{id}',
  DELETE_CREW: '/production-planning/projects/crews/{id}',

  CREATE_PRODUCTION_PLANNING: '/production-planning',
  UPDATE_PRODUCTION_PLANNING: '/production-planning/{id}',
  DELETE_PRODUCTION_PLANNING: '/production-planning/{id}',

  // daily production tracking
  DAILY_PRODUCTION_EXECUTIVE_VIEW: '/schedule-management/daily-production/executive-view',

};


export const QUERY_KEYS = {
  //auth  
  USER_PROFILE: ['user', 'profile'],
  VERIFY_OTP: ['user', 'verify-otp'],
  GROUPED_PERMISSIONS: ['permissions', 'grouped'],
  ROLE: ['roles'],
  UPDATE_ROLE: ['roles', 'update'],

  // user and staff management
  STAFF_USERS: ['users', 'staff'],

  // location
  COUNTRIES: ['location', 'countries'],
  STATES: ['location', 'states'],
  CITIES: ['location', 'cities'],

  //project
  PROJECTS: ['projects'],

  // schedule management
  PHASES: ['phases'],
  ACTIVITIES: ['activities'],

  //working days config
  WORKING_DAYS_CONFIG: ['working-days-config'],

  //production-planning
  EQUIPMENT: ['production-planning', 'equipment'],
  LABOURERS: ['production-planning', 'labourers'],
  CREWS: ['production-planning', 'crews'],


  //  production-logging
  LABOURER_TIME_LOGS: ['production-logging', 'labourer-time-logs'],
  EQUIPMENT_LOGS: ['production-logging', 'equipment-logs'],
  ACTIVITY_PRODUCTION_LOGS: ['production-logging', 'activity-production-logs'],
  DAILY_PRODUCTION_SUMMARY: ['production-logging', 'daily-production-summary'],
  PRODUCTION_LOG_ID: ['production-logging', 'production-log-id'],
  PRODUCTION_LOGS: ['production-logging', 'production-logs'],

  // schedule tracker
  SCHEDULE_TRACKER: ['schedule-management', 'schedule-tracker'],

  // daily production tracking
  DAILY_PRODUCTION_EXECUTIVE_VIEW: ['schedule-management', 'daily-production-executive-view'],
};
