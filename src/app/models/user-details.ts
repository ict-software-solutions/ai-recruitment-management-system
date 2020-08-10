export interface userDetails {
        userName: string;
        userType: string;
        roles: {};
        profileImage: string;
        emailAddress: string;
        company: string;
        firstName: string;
        lastName: string;
        lastLogin: string;
        userId:string;
}
export interface usersList{
        userId: string;
        userName: string;
        userType: string;
        firstName: string;
        middleName: string;
        lastName: string;
        emailAddress: string;
        mobileNumber: string;
        dateOfBirth:string;
        gender: string;
        company: string;
        address:string;
        city: string;
        state: string;
        postalCode: string;
        passwordExpiry: string;
        lastLogin: string;
        roles: {
            createdBy: string;
            createdOn: string;
            modifiedBy: string;
            modifiedOn: string;
            roleId :number;
            roleName:string;
            roleDescription: string;
            active: true;
            screenMapping: null;
        }
        profileImage: {
           type:string;
}
}

export interface roleList{
        active: true
createdBy: string;
createdOn: string;
modifiedBy: string;
modifiedOn: null
roleDescription: string;
roleId: number;
roleName: string;
screenMapping: null
}