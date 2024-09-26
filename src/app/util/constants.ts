
import { environment } from 'environments/environment';
// export const EMAIL_PATTERN = /^\w+([\.-]?\w+)*@\w+(\-]?\w+)*(\.-]?\w+)*(\.\w{2,3})+$/i;
export const apiURL = {
    'USER': environment.url + 'user',
    'LOGIN_URL': environment.url + 'user/login',
    'SIGNUP_URL': environment.url + 'user/register',
    'RESEND_EMAIL':environment.url +'user/resentActivationKey',
    'FORGOT_PASSWORD':environment.url + 'user/forgotPassword',
    'RESET_PASSWORD_URL' :  environment.url + 'user/resetPassword',
    'CHANGE_PASSWORD': environment.url + 'user/setNewPassword',
    'ROLES':environment.url + 'roles',
    'ADDUSER_URL':environment.url + 'user/addUser',
    'CLIENT_LOG_URL': environment.url + 'clientLog',
    'AUDIT_LOG_URL': environment.url + 'auditLog',
    'CONFIG_URL': environment.url + 'config',
    'UPDATE_CONFIG_URL': environment.url + 'config/update',
    'RESET_CONFIG_URL': environment.url + 'config/reset',
    'VALIDATE_USER_URL': environment.url + 'user/validateUser',
    'FIELD_HISTORY_URL': environment.url + 'field-history',
    'AUDITLOG_SEARCH_URL': environment.url + 'auditLog/searchLog',
    'CLIENTLOG_SEARCH_URL': environment.url + 'clientLog/searchLog',
    'FIELDHISTORY_SEARCH_URL': environment.url + 'field-history/searchLog'
}

export const TROY_LOGO = "assets/images/logos/troy.png";
export const EMAIL_PATTERN = /^\w+([\.-]?\w+)*@\w+(\-]?\w+)*(\.-]?\w+)*(\.\w{2,3})+$/i;
export const USERNAME_PATTERN =  /^[A-Za-z0-9._-]{6,30}$/;
export const MOBILENUMBER_PATTERN = /^((\\+91 ? )|0)?[ 0-9 +]{10,16}$/;
export const LOGGED_IN_USER = '$$AIRMS-USER$$';
export const LOGGED_IN_USER_INFO = '$$AIRMS-USER-INFO$$';
export const SIGNUP = '$$AIRMS-USER$$';
export const GET_ALL_USER ='$$AIRMS-ALL-USERS$$';
export const GET_USERS ='$$AIRMS-USERS-INFO$$';
export const IP_ADDRESS = '$$AIRMS-USERS-IPADDRESS$$';
export const CONFIG_DATA = '$$AIRMS-CONFIG-MANAGEMENT$$';
export const ADMIN = "Admin";
export const MANAGER = "Manager";
export const CANDIDATECONSULTANT = "Candidate Consultant";
export const CANDIDATEVIEW = "Candidate View";
export const CLIENTCONSULTANT = "Client Consultant";
export const CLIENTVIEW = "Client View";
export const CLIENT = 'Client';
export const CUSTOMER = "Customer";
export const TECHSUPPORT = "Tech Support";
export const ROLE_MANAGEMENT = 'Role Management';
export const USER_MANAGEMENT = "User Management";
export const DASHBOARD = 'Dashboard';

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

export const DISPLAY_COLUMNS_FOR_USERMGMT = ["image", "firstName", "lastName", "userType", "roleName", "activated", "userId"];
export const DISPLAY_COLUMNS_FOR_ROLEMGMT = ['rolename', 'desc', 'active', 'roleId'];

export const USER_TYPE = ['Candidate', 'Client', 'Employee'];