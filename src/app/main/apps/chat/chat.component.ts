import { Component, OnDestroy, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ChatService } from 'app/main/apps/chat/chat.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { BehaviorSubject, fromEvent, merge, Observable } from "rxjs";
import { LOGGED_IN_USER_INFO } from 'app/util/constants';
import { AirmsService } from 'app/service/airms.service';
import { AuthService } from 'app/service/auth.service';

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
    displayedColumns_audit: string[] = ['createdBy', 'whereAriseScreen', 'whatEnsue', 'whenOccur'];
    displayedColumns_client: string[] = ['createdBy',  'whereAriseFunction', 'whatEnsueClient', 'whenOccur'];
    //displayedColumns: string[] = ['createdBy',  'whereArise', 'newValue', 'whenOccur'];
    dataSource = new MatTableDataSource();
    dialogRef: any;
    clientLog: any;
    auditLog: any;
    @ViewChild(MatSort) sort: MatSort;
    // @ViewChild(MatPaginator)paginator:MatPaginator;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;


    // Private
    private _unsubscribeAll: Subject<any>;
    userInfo: any;
    constructor(
        public dialog: MatDialog,
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
        console.log('audit log');
        this.authService.getAuditLogEntries().subscribe(res => {
            console.log('audit log', res);
            this.auditLog = res;
            this.dataSource.data = this.auditLog;
        });
    }
    getClientLog() {
        console.log('client log');
        this.authService.getClientLogEntries().subscribe(res => {
            console.log('client log', res);
            this.clientLog = res;
            this.dataSource.data = this.clientLog;
        });
    }

    getFieldHistory() {
        console.log('Field History');
        // this.authService.getClientLogEntries().subscribe(res => {
        //     console.log('client log', res);
        //     this.clientLog = res;
        //     this.dataSource.data = this.clientLog;
        // });
    }
    getLogEntries(event) {
        console.log('client log', event);
        if (event === 'Client Machine Log') {
            this.getClientLog();
        } else if (event === 'Audit Log'){
            this.getAuditLog();
        } else {
            this.getFieldHistory();
        }
    }
    cancel() {
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}

