import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortable } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AirmsService } from 'app/service/airms.service';
import { AuthService } from 'app/service/auth.service';
import { LOGGED_IN_USER_INFO, LOG_LEVELS, LOG_MESSAGES } from 'app/util/constants';
import { Subject } from 'rxjs';
import { LogService } from 'app/service/shared/log.service';

// import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

export interface PeriodicElement {
    createdBy: string;
    whereArise: string;
    whatEnsue: string;
    whenOccur: string;
    screen: string;
    level: string;
    oldValue: string;
    newValue: string;
    field: string;
    whereAriseScreen: string;
    whereAriseFunction: string;
    whatEnsueClient: string;
}
// const ELEMENT_DATA: PeriodicElement[] = [
//     { createdBy: 'Karthiga', screen: 'Profile', whereArise: 'Edit', level: 'Error', whereAriseScreen: 'My Profile', whereAriseFunction: 'Update', whatEnsue: 'View', whatEnsueClient: 'email already exists', field: 'User name', oldValue: 'Karthiga', newValue: 'Karthiga-01', whenOccur: 'Jul 27,2020  08.00.11AM' },
//     { createdBy: 'Tamilselvi balasubramaniyam', screen: 'Profile', whereArise: 'Edit', level: 'Error', whereAriseScreen: 'User Management', whereAriseFunction: 'Update', whatEnsueClient: 'username already exists', field: 'Email', oldValue: 'thiga@gmail.com', newValue: 'kathiga@gmail.com', whatEnsue: 'View', whenOccur: 'Jul 26,2020  08.00.11AM' },
//     { createdBy: 'Janani', screen: 'Profile', whereArise: 'Edit', level: 'Error', whereAriseScreen: 'Role Management', whereAriseFunction: 'Update', whatEnsue: 'Update', whatEnsueClient: 'newpassword cannot be same as oldpassword', field: 'Email', oldValue: 'karthiga@gmail.com', newValue: 'thiga@gmail.com', whenOccur: 'Jul 27,2020  08.00.11AM' },
//     { createdBy: 'Dinesh', screen: 'User Management', whereArise: 'Add', level: 'Error', whereAriseScreen: 'User Management', whereAriseFunction: 'Add', whatEnsue: 'Update', whatEnsueClient: 'email already exists', field: 'User role', oldValue: 'Client', newValue: 'Admin', whenOccur: 'Jul 27,2020  08.00.11AM' },
//     { createdBy: 'Aravind', screen: 'User Management', whereArise: 'Edit', level: 'Error', whereAriseScreen: 'User Management', whereAriseFunction: 'Update', whatEnsue: 'Update', whatEnsueClient: 'email already exists', field: 'User role', oldValue: 'Client', newValue: 'Client View', whenOccur: 'Jul 27,2020  08.00.11AM' },
//     { createdBy: 'Dinesh', screen: 'User Management', whereArise: 'Add', level: 'Error', whereAriseScreen: 'User Management', whereAriseFunction: 'Add', whatEnsue: 'Update', whatEnsueClient: 'email already exists', field: 'User role', oldValue: 'Client', newValue: 'Admin', whenOccur: 'Jul 27,2020  08.00.11AM' },
//     { createdBy: 'Aravind', screen: 'User Management', whereArise: 'Edit', level: 'Error', whereAriseScreen: 'User Management', whereAriseFunction: 'Update', whatEnsue: 'Update', whatEnsueClient: 'email already exists', field: 'User role', oldValue: 'Client', newValue: 'Client View', whenOccur: 'Jul 27,2020  08.00.11AM' },
//     { createdBy: 'Dinesh', screen: 'User Management', whereArise: 'Add', level: 'Error', whereAriseScreen: 'User Management', whereAriseFunction: 'Add', whatEnsue: 'Update', whatEnsueClient: 'email already exists', field: 'User role', oldValue: 'Client', newValue: 'Admin', whenOccur: 'Jul 27,2020  08.00.11AM' },
//     { createdBy: 'Aravind', screen: 'User Management', whereArise: 'Edit', level: 'Error', whereAriseScreen: 'User Management', whereAriseFunction: 'Update', whatEnsue: 'Update', whatEnsueClient: 'email already exists', field: 'User role', oldValue: 'Client', newValue: 'Client View', whenOccur: 'Jul 27,2020  08.00.11AM' },

// ];
@Component({
    selector: 'chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ChatComponent implements OnInit, OnDestroy {

    @ViewChild('fieldHistorySort') fieldHistorySort: MatSort;
    @ViewChild('auditSort') auditSort: MatSort;
    @ViewChild('clientLogSort') clientLogSort: MatSort;
    @ViewChild('paginator1') paginator1: MatPaginator;
    @ViewChild('paginator2') paginator2: MatPaginator;
    @ViewChild('paginator3') paginator3: MatPaginator;
    displayedColumns_audit: string[] = ['createdBy', 'whereAriseScreen', 'whatEnsue', 'whenOccur'];
    displayedColumns_client: string[] = ['createdBy', 'screen', 'whereAriseFunction', 'level', 'whatEnsueClient', 'whenOccur'];
    displayedColumns_fieldHistory: string[] = ['createdBy',  'whereArise', 'screen', 'field', 'oldValue', 'newValue', 'whenOccur'];
    dataSource = new MatTableDataSource();
    dialogRef: any;
    searchValue = {keyword: ''};

    isLoading = true;
    constructor(
        public dialog: MatDialog,
        private datePipe: DatePipe,
        public _matDialog: MatDialog,
        private _fuseSidebarService: FuseSidebarService,
        private airmsService: AirmsService,
        private authService: AuthService,
        private logService: LogService
        // private _matPaginator: MatPaginator
    ) {
        this.logUserActivity("System Activities", LOG_MESSAGES.CLICK);
    }
    ngOnInit(): void {
        this.getLogEntries('Field History');
    }
    toggleSidebar(name): void {
        this.searchValue = {keyword: ''};
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }

    toggleSidebarClosed(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }
    getAuditLog() {
        this.logUserActivity("System Activities - Audit Log", LOG_MESSAGES.CLICK);
        this.dataSource.data = [];
        this.authService.getAuditLogEntries().subscribe((res: any) => {
        res.sort((a, b) => new Date(b.whenOccur).getTime() - new Date(a.whenOccur).getTime());
        this.setDataSource(res, this.paginator2, this.auditSort);
        }, error => {
        this.logService.logError(LOG_LEVELS.ERROR, "System Activities", "On fetching Audit Log", JSON.stringify(error));
        });
    }
    getClientLog() {
        this.logUserActivity("System Activities - Client Machine Log", LOG_MESSAGES.CLICK);
        this.dataSource.data = [];
        this.authService.getClientLogEntries().subscribe((res: any) => {
            res.sort((a, b) => new Date(b.whenOccur).getTime() - new Date(a.whenOccur).getTime());
            this.setDataSource(res, this.paginator3, this.clientLogSort);
        }, error => {
        this.logService.logError(LOG_LEVELS.ERROR, "System Activities", "On fetching Client Machine Log", JSON.stringify(error));
        });
    }

    
    getFieldHistory() {
        this.logUserActivity("System Activities - Field History", LOG_MESSAGES.CLICK);
        this.authService.getFieldHistory().subscribe(res => {
            console.log('res field history', res);
            this.fieldHistorySort.sort(({ id: 'whenOccur', start: 'desc' }) as MatSortable);
            this.setDataSource(res, this.paginator1, this.fieldHistorySort);
        }, error => {
        this.logService.logError(LOG_LEVELS.ERROR, "System Activities", "On fetching Field History", JSON.stringify(error));
        });
    }

    setDataSource(data, paginator: MatPaginator, sort: MatSort) {
        data.forEach(item => {
            item.whenOccur = this.getFullDate(item.whenOccur);
        });
        paginator.pageIndex = 0;
        this.dataSource = new MatTableDataSource(data);
        paginator.firstPage();
        this.dataSource.paginator = paginator;
        this.dataSource.sort = sort;
        paginator.length = data.length;
        this.isLoading = false;
    }

    getLogEntries(event) {
        this.isLoading = true;
        if (event === 'Client Machine Log') {
            this.getClientLog();
        } else if (event === 'Audit Log') {
            this.getAuditLog();
        } else {
            this.getFieldHistory();
        }
    }

    searchByKeyword(value) {
        let filterValue = ''
        if (value !== '') {
        filterValue = value.keyword.trim().toLowerCase();
        } 
        this.dataSource.filter = filterValue;
    }
    getFullDate(date) {
        return this.datePipe.transform(new Date(date), 'MMM dd, yyyy hh:mm:ss a')
    }
    cancel() {
    }
    logUserActivity(from, value) {
        this.logService.logUserActivity(LOG_LEVELS.INFO, from, value);
      }

    ngOnDestroy(): void {
        this.authService = null;
        this.logService = null;
    }
}

