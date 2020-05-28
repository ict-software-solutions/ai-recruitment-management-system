import { FuseUtils } from '@fuse/utils';

export class Contact
{
    id: string;
    name: string;
    lastName: string;
    avatar: string;
    nickname: string;
    company: string;
    jobTitle: string;
    email: string;
    phone: string;
    address: string;
    birthday: string;
    notes: string;
    vacancies:string;
 post_date:Date;
    end_date:Date;
    req:string;
    mapped:number;
    desc:string;
    sal:string;
    company_name:string;
    x:string;
    mob:number;
    /**
     * Constructor
     *
     * @param contact
     */
    constructor(contact)
    {
        {
            this.id = contact.id || FuseUtils.generateGUID();
            this.name = contact.name || '';
            this.lastName = contact.lastName || '';
            this.avatar = contact.avatar || 'assets/images/avatars/profile.jpg';
            this.nickname = contact.nickname || '';
            this.company = contact.company || '';
            this.jobTitle = contact.jobTitle || '';
            this.email = contact.email || '';
            this.phone = contact.phone || '';
            this.address = contact.address || '';
            this.birthday = contact.birthday || '';
            this.notes = contact.notes || '';
            this.vacancies = contact.vacancies || '';
             this.post_date = contact.post_date || '';
            this.end_date = contact.end_date || '';
            this.req = contact.req || '';
            this.mapped = contact.mapped || '';
            this.desc = contact.desc || '';
            this.sal = contact.sal || '';
            this.company_name = contact.company_name || '';
            this.x = contact.x || '';
            this.mob=contact.mob || '';
        }
    }
}
