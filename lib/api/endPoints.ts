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
  PROJECT: '/project/{id}',
  CREATE_PROJECT: '/project',
  UPDATE_PROJECT: '/project/{id}',
  DELETE_PROJECT: '/project/{id}',
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
};