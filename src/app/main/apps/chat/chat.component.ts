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
import { Subject, Subscription } from 'rxjs';
import { LogService } from 'app/service/shared/log.service';
import * as moment from 'moment'; 
import Swal from 'sweetalert2';

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
    displayedColumns_client: string[] = ['createdBy', 'whichPlace', 'whereAriseFunction',  'level', 'logMessage', 'whenOccur'];
    displayedColumns_fieldHistory: string[] = ['createdBy', 'screen', 'whereArise', 'field', 'oldValue', 'newValue', 'whenOccur'];
    dataSource = new MatTableDataSource();
    dialogRef: any;
    searchValue = {keyword: '', fromDate: new Date(), toDate: new Date()};
    type = '';
    searchSubscription: Subscription;
    isLoading = true;
    maxDate = new Date();
    minDate = new Date();
    errorForCount = false;
    roleName: string;
    logTypeScreen: string;
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
        this.roleName = airmsService.getUserRole();
    }
    ngOnInit(): void {
        if (this.roleName === 'Admin') {
            this.getLogEntries('Field History');
            } else if (this.roleName === 'Manager') {
                this.getLogEntries('Audit Log');
            } else {
                this.getLogEntries('Client Machine Log');
            }
    }
    toggleSidebar(name): void {
        let today = new Date();
        let fromDate = this.getFromDate(today);
        console.log('this.fromDateValue after', fromDate);
        this.searchValue = {keyword: '', fromDate, toDate: today};
        this.minDate = fromDate;
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }
    getFromDate(value) {
        let date = new Date(value);
        date.setDate(date.getDate() - 6);
        return date;
    }

    toggleSidebarClosed(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }
    getAuditLog() {
        this.logUserActivity("System Activities - Audit Log", LOG_MESSAGES.CLICK);
        this.dataSource.data = [];
        this.authService.getAuditLogEntries().subscribe((res: any) => {
        this.setDataSource(res, this.paginator2);
        }, error => {
        this.logService.logError(LOG_LEVELS.ERROR, "System Activities", "On fetching Audit Log", JSON.stringify(error));
        });
    }
    getClientLog() {
        this.logUserActivity("System Activities - Client Machine Log", LOG_MESSAGES.CLICK);
        this.dataSource.data = [];
        this.authService.getClientLogEntries().subscribe((res: any) => {
            this.setDataSource(res, this.paginator3);
        }, error => {
        this.logService.logError(LOG_LEVELS.ERROR, "System Activities", "On fetching Client Machine Log", JSON.stringify(error));
        });
    }

    
    getFieldHistory() {
        this.logUserActivity("System Activities - Field History", LOG_MESSAGES.CLICK);
        this.authService.getFieldHistory().subscribe((res:any) => {
            console.log('res field history', res);
            this.setDataSource(res, this.paginator1);
        }, error => {
        this.logService.logError(LOG_LEVELS.ERROR, "System Activities", "On fetching Field History", JSON.stringify(error));
        });
    }

    setDataSource(data, paginator: MatPaginator) {
        data.forEach(item => {
            item.whenOccur = this.getFullDate(item.whenOccur);
        });
        data.sort((a, b) => b.id - a.id);
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = paginator;
        this.isLoading = false;
    }

    getLogEntries(event) {
        this.isLoading = true;
        this.type = event;
        if (event === 'Client Machine Log') {
            this.getClientLog();
        } else if (event === 'Audit Log') {
            this.getAuditLog();
        } else {
            this.getFieldHistory();
        }
    }

    clearAll(type) {
        console.log('type', type);
        this.getLogEntries(type);
    }
    searchByKeyword(value) {
        let filterValue = ''
        if (value !== '') {
        filterValue = value.keyword.trim().toLowerCase();
        } 
        this.dataSource.filter = filterValue;
    }
    dateChanges(event, type) {
        console.log('event', event, type);
        if (type== 'from') {
            this.minDate = event;
        } else {
            this.maxDate = event;
        }
    }
    checkForDate(date1, date2) {
        console.log('searchby date check for dates 123', date1, date2);
        var dateFrom = new Date(date1);
        var dateTo = new Date(date2);
        var Difference_In_Time = dateTo.getTime() - dateFrom.getTime();
        return Math.round(Difference_In_Time / (1000 * 3600 * 24));
    
    }
    searchByDate(value) {
        this.errorForCount = false;
        this.isLoading = true;
        let token = this.airmsService.getToken();
        value.type = this.type;
        let checkDates = this.checkForDate(value.fromDate, value.toDate);
        value.fromDate = moment(value.fromDate).format('YYYY-MM-DD');
        value.toDate = moment(value.toDate).format('YYYY-MM-DD');
        if (checkDates <=91) {
        console.log('searchby date formDate', value);
        this.searchSubscription = this.authService.getSearchDataForLogEntries(value, token).subscribe((res: any) => {
            this.isLoading = false;
            if (value.type === 'Client Machine Log'){
                this.setDataSource(res, this.paginator3);
            } else if (value.type === 'Audit Log') {
                this.setDataSource(res, this.paginator2);
            } else {
                this.setDataSource(res, this.paginator1);
            }
           this.toggleSidebarClosed('project-dashboard-right-sidebar-1');
        });
    } else {
        this.isLoading = false;
        this.errorForCount = true;
    }
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

