
import { environment } from 'environments/environment';
// export const EMAIL_PATTERN = /^\w+([\.-]?\w+)*@\w+(\-]?\w+)*(\.-]?\w+)*(\.\w{2,3})+$/i;
export const apiURL = {
    'USER': environment.url + 'user',
    'LOGIN_URL': environment.url + 'user/login',
    'SIGNUP_URL': environment.url + 'user/register',
    'RESEND_EMAIL':environment.url +'user/resentActivationKey',
    'FORGOT_PASSWORD':environment.url + 'user/forgotPassword',

}

export const TROY_LOGO = "assets/images/logos/troy.png";
export const EMAIL_PATTERN = /^\w+([\.-]?\w+)*@\w+(\-]?\w+)*(\.-]?\w+)*(\.\w{2,3})+$/i;
export const LOGGED_IN_USER = '$$AIRMS-USER$$';
export const LOGGED_IN_USER_INFO = '$$AIRMS-USER-INFO$$';
export const SIGNUP = '$$AIRMS-USER$$';


// export const EDIT = '$$AIRMS-USER-INFO$$'+
export const LAYOUT_STRUCTURE = {
    layout: {
        navbar: { hidden: true },
        toolbar: { hidden: true },
        footer: { hidden: true },
        sidepanel: { hidden: true }
    }
};

export const LOG_MESSAGES = {
    SUCCESS: 'Success',
    FAILURE: 'Failure',
    PREVIOUS: 'Previous',
    NEXT: 'Next',
    CLICK: 'Click',
    TOGGLE: 'Toggle',
    SHOW: 'Show',
    HIDE: 'Hide',
    SAVE: 'Save',
    CANCEL: 'Cancel',
    YES: 'Yes',
    NO: 'No'
}

export const LOG_LEVELS = {
    INFO: 'info',
    DEBUG: 'debug',
    WARN: 'warn',
    ERROR: 'error',
    FATAL: 'fatal',
    LOG: 'log'
}