import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { merge, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { AirmsService } from 'app/service/airms.service';
import { AuthService } from 'app/service/auth.service';
import { FuseSidebarService } from '../sidebar/sidebar.service';

@Component({
    selector: 'fuse-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FuseNavigationComponent implements OnInit {
    @Input()
    layout = 'vertical';

    @Input()
    navigation: any;

    // Private
    private _unsubscribeAll: Subject<any>;
    backupNavigation: any[];

    /**
     *
     * @param {ChangeDetectorRef} _changeDetectorRef
     * @param {FuseNavigationService} _fuseNavigationService
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private authService: AuthService,
        private airmsService: AirmsService,
        private _fuseSidebarService: FuseSidebarService,
        private _fuseNavigationService: FuseNavigationService) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Load the navigation either from the input or from the service

        this.navigation = this.navigation || this._fuseNavigationService.getCurrentNavigation();

        // Subscribe to the current navigation changes
        this._fuseNavigationService.onNavigationChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(async () => {

                this.navigation = [];
                if (this.authService.hasUserLoggedIn) {
                    this.navigation = <any[]>await this.getSideMenus();
                    // Load the navigation
                    // this.navigation = this._fuseNavigationService.getCurrentNavigation();
                    console.log('check1', this.navigation);
                    // Mark for check
                    this._changeDetectorRef.markForCheck();
                }
            });

        // Subscribe to navigation item
        merge(
            this._fuseNavigationService.onNavigationItemAdded,
            this._fuseNavigationService.onNavigationItemUpdated,
            this._fuseNavigationService.onNavigationItemRemoved
        ).pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    getSideMenus(): any {
        return new Promise((resolve, reject) => {
            const userRoles = [
                { name: 'Admin', pages: ['Dashboards', 'User Management', 'Role Management', 'System Activities'] },
                { name: 'Manager', pages: ['Dashboards', 'Role Management', 'System Activities']},
                { name: 'Tech Support', pages: ['Dashboards', 'Role Management', 'System Activities']},
                { name: 'Candidate Consultant', pages: ['Dashboards']},
                { name: 'Client Consultant', pages: ['Dashboards']},
                { name: 'Client', pages: ['Dashboards']},
                { name: 'Candidate View', pages: ['Dashboards']},
                { name: 'Candidate View', pages: ['Dashboards']},
                { name: 'Customer', pages: ['Dashboards']}
            ]
            this.navigation = [];
            this.backupNavigation = [];
            this.backupNavigation = this._fuseSidebarService.navigation;
            const userRole = this.airmsService.getUserRole();
            console.log('User Role is ' + userRole);
            const filterUserRole = userRoles.filter(role => role['name'] === userRole);
            let filteredChild = [];
            if (filterUserRole.length > 0) {
                if (this.backupNavigation[0]['children'] !== undefined) {
                    const pages = filterUserRole[0]['pages'];
                    const children = this.backupNavigation[0]['children']
                    loop1: for (let i = 0; i < pages.length; i++) {
                        for (let j = 0; j < children.length; j++) {
                            if (pages[i] === children[j]['title']) {
                                filteredChild.push(children[j]);
                                continue loop1;
                            }

                        }
                    }
                }
            }
            this.backupNavigation[0]['children'] = filteredChild;
            resolve(this.backupNavigation);
        });
    }
}
