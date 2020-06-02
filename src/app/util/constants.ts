// export const EMAIL_PATTERN = /^\w+([\.-]?\w+)*@\w+(\-]?\w+)*(\.-]?\w+)*(\.\w{2,3})+$/i;

import { environment } from 'environments/environment';

export const apiURL={
    'login':environment.url + 'troyUsers/login'
}