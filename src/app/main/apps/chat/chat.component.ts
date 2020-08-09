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
import { LOGGED_IN_USER_INFO } from 'app/util/constants';
import { Subject } from 'rxjs';

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
    displayedColumns_client: string[] = ['createdBy', 'whereAriseFunction', 'whatEnsueClient', 'whenOccur'];
    //displayedColumns: string[] = ['createdBy',  'whereArise', 'newValue', 'whenOccur'];
    dataSource = new MatTableDataSource();
    dialogRef: any;


    // Private
    private _unsubscribeAll: Subject<any>;
    userInfo: any;
    isLoading = true;
    constructor(
        public dialog: MatDialog,
        private datePipe: DatePipe,
        public _matDialog: MatDialog,
        private _fuseSidebarService: FuseSidebarService,
        private airmsService: AirmsService,
        private authService: AuthService
        // private _matPaginator: MatPaginator
    ) {
        this._unsubscribeAll = new Subject();
        this.userInfo = airmsService.getSessionStorage(LOGGED_IN_USER_INFO);
    }
    ngOnInit(): void {
        this.getLogEntries('Audit Log');
        //this.dataSource.sort = this.sort;
    }
    toggleSidebar(name): void {
        console.log('name', name);
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }

    toggleSidebarClosed(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();

    }
    getAuditLog() {
        this.dataSource.data = [];
        this.authService.getAuditLogEntries().subscribe((res: any) => {
        res.sort((a, b) => new Date(b.whenOccur).getTime() - new Date(a.whenOccur).getTime());
        this.setDataSource(res, this.paginator2, this.auditSort);
        });
    }
    getClientLog() {
        this.dataSource.data = [];
        this.authService.getClientLogEntries().subscribe((res: any) => {
            res.sort((a, b) => new Date(b.whenOccur).getTime() - new Date(a.whenOccur).getTime());
            this.setDataSource(res, this.paginator3, this.clientLogSort);
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

    getFieldHistory() {
        console.log('Field History');
        this.authService.getClientLogEntries().subscribe(res => {
            console.log('client log', res);
            this.fieldHistorySort.sort(({ id: 'whenOccur', start: 'desc' }) as MatSortable);
            this.setDataSource(res, this.paginator1, this.fieldHistorySort);
        });
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

    getFullDate(date) {
        return this.datePipe.transform(new Date(date), 'MMM dd, yyyy hh:mm:ss a')
    }
    cancel() {
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}

