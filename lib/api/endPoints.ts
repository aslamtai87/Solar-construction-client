export const API_ENDPOINTS = {

  //auth
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
  VERIFY_OTP: '/auth/verify-otp-token',
  USER_PROFILE: '/auth/account/me',
  RESEND_OTP: '/auth/resend-otp',
  LOGOUT: '/auth/account/logout',
  REFRESH_TOKEN: '/auth/refresh',
};


export const QUERY_KEYS = {
  //auth  
  USER_PROFILE: ['user', 'profile'],
  VERIFY_OTP: ['user', 'verify-otp'],
};