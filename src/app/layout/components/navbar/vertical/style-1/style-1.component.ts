import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { FusePerfectScrollbarDirective } from '@fuse/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';
import { FuseConfigService } from '@fuse/services/config.service';
import { userDetails } from 'app/models/user-details';
import { AirmsService } from 'app/service/airms.service';
import { LOGGED_IN_USER_INFO } from 'app/util/constants';
import { Subject } from 'rxjs';
import { delay, filter, take, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'navbar-vertical-style-1',
    templateUrl: './style-1.component.html',
    styleUrls: ['./style-1.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class NavbarVerticalStyle1Component implements OnInit, OnDestroy {

    fuseConfig: any;
    navigation: any;
    userInfo: userDetails;
    private _fusePerfectScrollbar: FusePerfectScrollbarDirective;
    private _unsubscribeAll: Subject<any>;

    constructor(
        private _fuseConfigService: FuseConfigService,
        private _fuseNavigationService: FuseNavigationService,
        private _fuseSidebarService: FuseSidebarService,
        private _router: Router,
        private airmsService: AirmsService) {
        this.userInfo = airmsService.getSessionStorage(LOGGED_IN_USER_INFO);
        this._unsubscribeAll = new Subject();
    }

    @ViewChild(FusePerfectScrollbarDirective, { static: true })
    set directive(theDirective: FusePerfectScrollbarDirective) {
        if (!theDirective) {
            return;
        }
        this._fusePerfectScrollbar = theDirective;
        // Update the scrollbar on collapsable item toggle
        this._fuseNavigationService.onItemCollapseToggled.pipe(delay(500),
            takeUntil(this._unsubscribeAll)
        ).subscribe(() => { this._fusePerfectScrollbar.update(); });

        // Scroll to the active item position
        this._router.events.pipe(filter((event) => event instanceof NavigationEnd), take(1)
        ).subscribe(() => {
            setTimeout(() => {
                this._fusePerfectScrollbar.scrollToElement('navbar .nav-link.active', -120);
            });
        });
    }

    ngOnInit(): void {
        this._router.events.pipe(
            filter((event) => event instanceof NavigationEnd),
            takeUntil(this._unsubscribeAll)
        ).subscribe(() => {
            if (this._fuseSidebarService.getSidebar('navbar')) {
                this._fuseSidebarService.getSidebar('navbar').close();
            }
        });

        // Subscribe to the config changes
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config) => {
                this.fuseConfig = config;
            });

        // Get current navigation
        this._fuseNavigationService.onNavigationChanged.pipe(
            filter(value => value !== null),
            takeUntil(this._unsubscribeAll)
        ).subscribe(() => {
            this.navigation = this._fuseNavigationService.getCurrentNavigation();
        });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
        this.fuseConfig = null;
        this.navigation = null;
        this.userInfo = null;
        this._fusePerfectScrollbar = null;
        this._fuseConfigService = null;
        this._fuseNavigationService = null;
        this._fuseSidebarService = null;
        this._router = null;
        this.airmsService = null;
    }

    toggleSidebarOpened(): void {
        this._fuseSidebarService.getSidebar('navbar').toggleOpen();
    }

    toggleSidebarFolded(): void {
        this._fuseSidebarService.getSidebar('navbar').toggleFold();
    }
}
