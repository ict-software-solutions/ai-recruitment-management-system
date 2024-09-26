import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { FuseConfigService } from '@fuse/services/config.service';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { TranslateService } from '@ngx-translate/core';
import { userDetails, usersList } from 'app/models/user-details';
import { navigation } from 'app/navigation/navigation';
import { AirmsService } from 'app/service/airms.service';
import { AuthService } from 'app/service/auth.service';
import { UserService } from 'app/service/user.service';
import { LOGGED_IN_USER_INFO, SIGNUP, LOG_LEVELS, LOG_MESSAGES } from 'app/util/constants';
import * as _ from 'lodash';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { url } from 'inspector';
import { LogService } from 'app/service/shared/log.service';
declare var $: any;

@Component({
    selector: 'toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class ToolbarComponent implements OnInit, OnDestroy {
    horizontalNavbar: boolean;
    rightNavbar: boolean;
    hiddenNavbar: boolean;
    languages: any;
    navigation: any;
    selectedLanguage: any;
    userStatusOptions: any[];
    idleState = 'Not started.';
    timedOut = false;
    lastPing?: Date = null;
    WAITING_TIME = 1800;
    TIME_OUT = 300;
    alertMessages = [];
    userInfo: userDetails;
    user: userDetails;
    user1: usersList;
    userData:any;
    userId:String;
    updateUserInfoSubscription: Subscription;

    private _unsubscribeAll: Subject<any>;
    toolbarSubscription: Subscription;

    constructor(
        private _fuseConfigService: FuseConfigService,
        private _fuseSidebarService: FuseSidebarService,
        private idle: Idle,
        private airmsService: AirmsService,
        private _translateService: TranslateService,
        private keepalive: Keepalive,
        private authService: AuthService,
        private router: Router,
        private userService: UserService,
        private logService: LogService
    ) {
        this.WAITING_TIME = 1800;
        this.TIME_OUT = 300;
        this.userStatusOptions = [
            {
                title: 'Online',
                icon: 'icon-checkbox-marked-circle',
                color: '#4CAF50'
            },
            {
                title: 'Away',
                icon: 'icon-clock',
                color: '#FFC107'
            },
            {
                title: 'Do not Disturb',
                icon: 'icon-minus-circle',
                color: '#F44336'
            },
            {
                title: 'Invisible',
                icon: 'icon-checkbox-blank-circle-outline',
                color: '#BDBDBD'
            },
            {
                title: 'Offline',
                icon: 'icon-checkbox-blank-circle-outline',
                color: '#616161'
            }
        ];

        this.languages = [
            {
                id: 'en',
                title: 'English',
                flag: 'us'
            },
            {
                id: 'tr',
                title: 'Turkish',
                flag: 'tr'
            }
        ];

        this.navigation = navigation;

        
        this._unsubscribeAll = new Subject();
        idle.setIdle(this.WAITING_TIME);
        // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
        idle.setTimeout(this.TIME_OUT);
        // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
        idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
        idle.onIdleEnd.subscribe(() => {
            this.reset();
            this.idleState = 'No longer idle.';
        });
        idle.onTimeout.subscribe(() => {
            this.idleState = 'Timed out!';
            this.timedOut = true;
        });
        idle.onIdleStart.subscribe(() => {
            this.idleState = 'You\'ve gone idle!';
            this.showSessionLogoutDialog();
        });
        idle.onTimeoutWarning.subscribe((countdown) => {
            this.idleState = 'You will time out in ' + countdown + ' seconds!';
        });

        // sets the ping interval to 15 seconds
        keepalive.interval(15);

        keepalive.onPing.subscribe(() => {
            this.lastPing = new Date();
        });
        this.reset();
        
    }

    reset() {
        this.WAITING_TIME = 1800;
        this.TIME_OUT = 300;
        this.idle.setIdle(this.WAITING_TIME);
        this.idle.setTimeout(this.TIME_OUT);
        this.idle.watch();
        this.keepalive.interval(15);
        this.idleState = 'Started.';
        this.timedOut = false;
    }

    showSessionLogoutDialog() {
        if (!this.router.url.includes('/login') || !this.router.url.includes('/pages/auth/register')) {
        Swal.fire({
            title: '<strong>Session expiring in 5 mins</strong>',
            text: 'Do you want to continue?',
            imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcT5Z6V4WR3CdGzUrLsipzkE4X8uyJR9_RFbhpgGA0tWAezR2_O9&usqp=CAU',
            imageWidth: 50,
            imageHeight: 100,
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Extend', 
        })
        .then((result) => {
            if (result.dismiss === Swal.DismissReason.cancel) {
                this.logoutAIRMS();
            }
            this.WAITING_TIME = 1800;
            this.TIME_OUT = 300;
          });
        }
    }
    ngOnInit(): void {
        this.updatedUserInfo();
        // Subscribe to the config changes
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((settings) => {
                this.horizontalNavbar = settings.layout.navbar.position === 'top';
                this.rightNavbar = settings.layout.navbar.position === 'right';
                this.hiddenNavbar = settings.layout.navbar.hidden === true;
            });
        // Set the selected language from default languages
        this.selectedLanguage = _.find(this.languages, { id: this._translateService.currentLang });
    }
    updatedUserInfo() {
        this.updateUserInfoSubscription = this.userService.userProfileUpdateSub.subscribe(res=>{
            if (res!== null) {
                this.getUserInfo();
            } else {
                this.getUserInfo();
            }
        });
    }
    getUserInfo() {
        this.userInfo = this.airmsService.getSessionStorage(LOGGED_IN_USER_INFO);
        if (this.userInfo !== null) {
            this.user = this.airmsService.getSessionStorage(SIGNUP);
            this.userId = this.userInfo.userId;
            if (this.userInfo.profileImage !== null && this.userInfo.profileImage !== '') {
                this.userInfo.profileImage = atob(this.userInfo.profileImage);
                setTimeout(() => {
                    $(".img-thumbnail2").remove();
                    $('#profilePic').append('<img src=' + 'data:image/jpeg;base64' +
                        this.userInfo.profileImage +
                        ' class="img-thumbnail2 img-rounded"style="margin: -7px 8px -10px -7px;height:53px;width:53px;border-radius:33px">');
                }, 100);
            } else {
                setTimeout(() => {
                    $(".img-thumbnail2").remove();
                    $('#profilePic').append('<img src="' +
                        '../../assets/images/generic.jpg"' +
                        'class="img-thumbnail2 img-rounded" style="margin: -7px 8px -10px -7px;height:53px;width:53px;border-radius:33px;">');
                }, 100);
            }
        }
    }
    logoutAIRMS() {
        this.logUserActivity("Logout", LOG_MESSAGES.CLICK);
        this.authService.logout();
        this.router.navigate(['']);
    }

    unsubscribe(subscription: Subscription) {
        if (subscription !== null && subscription !== undefined) {
            subscription.unsubscribe();
        }
    }
    clickProfile(userId){
    }
    getAllInfo(){
        let navigationExtras: NavigationExtras = {
            queryParams: {
                // "userName": "Nic",
                userId:this.userId,
                viewMode:true
            },
            skipLocationChange: true
        };
        this.logUserActivity("My Profile Page", LOG_MESSAGES.CLICK);
        this.router.navigate(['/apps/profile/forms'], navigationExtras);
    }
    logUserActivity(from, value) {
        this.logService.logUserActivity(LOG_LEVELS.INFO, from, value);
      }
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this.unsubscribe(this.toolbarSubscription);
        this.unsubscribe(this.updateUserInfoSubscription);
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
        
        this.authService = null;
        this.navigation=null;
        this.languages=null;
        this.selectedLanguage=null;
        this.userStatusOptions=null;
        this.idleState=null;
        this.timedOut=null;
        this.WAITING_TIME=null;
        this.TIME_OUT=null;
        this.alertMessages=null;
        this.userInfo=null;
        this.alertMessages=null;
        this.toolbarSubscription=null;
        this.keepalive=null;
        this.router=null;
        this.authService=null;
        this._translateService=null;
        this._fuseConfigService=null;
        this._fuseSidebarService=null;
        this.airmsService=null;
        this.idle=null;
        this._translateService=null;
    }

    toggleSidebarOpen(key): void {
        this._fuseSidebarService.getSidebar(key).toggleOpen();
    }

    search(value): void {
        // Do your search here...
        console.log(value);
    }
    setLanguage(lang): void {
        this.selectedLanguage = lang;
        this._translateService.use(lang.id);
    }
}
export class ResetPasswordComponent { }