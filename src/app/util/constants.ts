// export const EMAIL_PATTERN = /^\w+([\.-]?\w+)*@\w+(\-]?\w+)*(\.-]?\w+)*(\.\w{2,3})+$/i;

import { environment } from 'environments/environment';

export const apiURL={
    'login':environment.url + 'troyUsers/login'
}

export const TROY_LOGO = "assets/images/logos/troy.png";
export const LAYOUT_STRUCTURE= {
    layout: {
        navbar: { hidden: true },
        toolbar: { hidden: true },
        footer: { hidden: true },
        sidepanel: { hidden: true }
    }
};