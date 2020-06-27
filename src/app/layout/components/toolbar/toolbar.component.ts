import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import Swal from 'sweetalert2';
import { FuseConfigService } from '@fuse/services/config.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { Subject, Subscription } from 'rxjs';
import { navigation } from 'app/navigation/navigation';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
// import {MatDialog} from '@angular/material/dialog';
// import { ResetPasswordModule } from 'app/main/pages/authentication/reset-password/reset-password.module';
// import { ResetPasswordComponent } from 'app/main/pages/authentication/reset-password/reset-password.component';
@Component({
    selector     : 'toolbar',
    templateUrl  : './toolbar.component.html',
    styleUrls    : ['./toolbar.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class ToolbarComponent implements OnInit, OnDestroy
{
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
    WAITING_TIME = 50;
    TIME_OUT = 50;
    alertMessages = [];
    // Private
    private _unsubscribeAll: Subject<any>;
    toolbarSubscription: Subscription;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {TranslateService} _translateService
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _fuseSidebarService: FuseSidebarService,
        private idle: Idle,
        private _translateService: TranslateService,
        private keepalive: Keepalive
        // public dialog: MatDialog
    )
    {
        // Set the defaults
        this.userStatusOptions = [
            {
                title: 'Online',
                icon : 'icon-checkbox-marked-circle',
                color: '#4CAF50'
            },
            {
                title: 'Away',
                icon : 'icon-clock',
                color: '#FFC107'
            },
            {
                title: 'Do not Disturb',
                icon : 'icon-minus-circle',
                color: '#F44336'
            },
            {
                title: 'Invisible',
                icon : 'icon-checkbox-blank-circle-outline',
                color: '#BDBDBD'
            },
            {
                title: 'Offline',
                icon : 'icon-checkbox-blank-circle-outline',
                color: '#616161'
            }
        ];

        this.languages = [
            {
                id   : 'en',
                title: 'English',
                flag : 'us'
            },
            {
                id   : 'tr',
                title: 'Turkish',
                flag : 'tr'
            }
        ];

        this.navigation = navigation;

        // Set the private defaults
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
        //   Swal.close();
         
        //   this.authService.logout();
        //   this.logUserActivity('Session Expired', 'Auto Sign Out');
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
        this.idle.setIdle(this.WAITING_TIME);
        this.idle.setTimeout(this.TIME_OUT);
        this.idle.watch();
        this.keepalive.interval(15);
        this.idleState = 'Started.';
        this.timedOut = false;
      }
    
      showSessionLogoutDialog(){
        Swal.fire ( {
            title: '<strong>Session expiring in 5 mins</strong>',
            text: 'Do you want to continue?',
            imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcT5Z6V4WR3CdGzUrLsipzkE4X8uyJR9_RFbhpgGA0tWAezR2_O9&usqp=CAU',
            imageWidth: 50,
            imageHeight: 100,
            confirmButtonText: 'Extend',
            cancelButtonText: 'No'
        });
      }
    //   title: 'Sweet!',
    //     text: 'Modal with a custom image.',
    //     imageUrl: 'https://unsplash.it/400/200',
    //     imageWidth: 400,
    //     imageHeight: 200,
    //     animation: false
    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Subscribe to the config changes
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((settings) => {
                this.horizontalNavbar = settings.layout.navbar.position === 'top';
                this.rightNavbar = settings.layout.navbar.position === 'right';
                this.hiddenNavbar = settings.layout.navbar.hidden === true;
            });

        // Set the selected language from default languages
        this.selectedLanguage = _.find(this.languages, {id: this._translateService.currentLang});
    }

    unsubscribe(subscription: Subscription) {
        if (subscription !== null && subscription !== undefined) {
            subscription.unsubscribe();
        }
    }

    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this.unsubscribe(this.toolbarSubscription);
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle sidebar open
     *
     * @param key
     */
    toggleSidebarOpen(key): void
    {
        this._fuseSidebarService.getSidebar(key).toggleOpen();
    }

    /**
     * Search
     *
     * @param value
     */
    search(value): void
    {
        // Do your search here...
        console.log(value);
    }

    /**
     * Set the language
     *
     * @param lang
     */
    setLanguage(lang): void
    {
        // Set the selected language for the toolbar
        this.selectedLanguage = lang;

        // Use the selected language for translations
        this._translateService.use(lang.id);
    }
    // openDialog() {
    //     const dialogRef = this.dialog.open(ResetPasswordComponent);
    
    //     dialogRef.afterClosed().subscribe(result => {
    //       console.log(`Dialog result: ${result}`);
    //     });
    //   }
}
export class ResetPasswordComponent {}