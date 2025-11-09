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

  CREATE_CREW: '/production-planning/crews',

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
};
