import { Component, OnDestroy, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ChatService } from 'app/main/apps/chat/chat.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
// import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

export interface PeriodicElement {
    createdBy: string;
    whereArise: string;
    whatEnsue: string;
    whenOccur: string;
    screen:string;
    level:string;
    oldValue:string;
    newValue:string;
    field:string;
}
const ELEMENT_DATA: PeriodicElement[] = [
    { createdBy: 'Karthiga', screen:'Profile',whereArise: 'Profile-view',level:'', whatEnsue: 'View', field:'User Type',oldValue:'Client',newValue:'Employee', whenOccur: 'Jul 27,2020  08.00.11AM' },
    { createdBy: 'Tamilselvi balasubramaniyam',screen:'User Management',level:'', whereArise: 'Profile-view', field:'User Role',oldValue:'Client view',newValue:'Candidate view', whatEnsue: 'View',   whenOccur: 'Jul 26,2020  08.00.11AM' },
    {createdBy: 'Janani', screen:'Role Management',whereArise: 'Role Management', level:'',whatEnsue:'Update',  field:'User Type',oldValue:'Client',newValue:'Candidate', whenOccur: 'Jul 27,2020  08.00.11AM' },
    { createdBy: 'Karthiga', screen:'Profile',whereArise: 'Profile-update',level:'',whatEnsue: 'update',  field:'User Type',oldValue:'Camdidate',newValue:'Client', whenOccur: 'Jul 27,2020  08.00.11AM' },
    {createdBy: 'Janani', screen:'Role Management',whereArise: 'Role Management-Add',level:'',whatEnsue: 'view',  field:'User Role',oldValue:'Client',newValue:'Admin', whenOccur: 'Jul 27,2020  08.00.11AM' },
    { createdBy: 'Karthiga', screen:'Profile',whereArise: 'Profile-view', level:'',whatEnsue: 'view', field:'User Type',oldValue:'Client',newValue:'Candidate',  whenOccur: 'Jul 27,2020  08.00.11AM' },
    { createdBy: 'Janani', screen:'Role Management',whereArise: 'Role Management-Add',level:'', whatEnsue: 'Add', field:'User Role',oldValue:'Admin',newValue:'Manager',  whenOccur: 'Jul 27,2020  08.00.11AM' },
    { createdBy: 'Karthiga', screen:'Profile',whereArise: 'Profile-view', level:'',whatEnsue: 'Updated',  field:'User Type',oldValue:'Client',newValue:'350', whenOccur: 'Jul 27,2020  08.00.11AM' },
    { createdBy: 'Karthiga',screen:'Profile Edit', whereArise: 'Profile-edit', level:'',whatEnsue: 'update', field:'User Role',oldValue:'Candidate view',newValue:'Client View',  whenOccur: 'Jul 27,2020  08.00.11AM' },
    { createdBy: 'Janani', screen:'Role Management',whereArise: 'Role Management-view', level:'',whatEnsue: 'view',  field:'User Type',oldValue:'Client',newValue:'Client', whenOccur: 'Jul 27,2020  08.00.11AM' },
    { createdBy: 'End', screen:'Dashboard',whereArise: 'Dashboard', level:'',whatEnsue: 'view',  field:'User Role',oldValue:'Client',newValue:'Client view', whenOccur: 'Jul 27,2020  08.00.11AM' },
];
@Component({
    selector: 'chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ChatComponent implements OnInit, OnDestroy {
    displayedColumns: string[] = ['createdBy', 'whereArise', 'whatEnsue', 'whenOccur'];
    displayedColumns1:string[]=['createdBy','screen','whereArise','level','whatEnsue','whenOccur'];
    fieldHistory:string[]=['createdBy','screen','whereArise','field','oldValue','newValue','whenOccur'];

    dataSource = new MatTableDataSource(ELEMENT_DATA);
    dialogRef: any;
    @ViewChild(MatSort)sort:MatSort;
    @ViewChild(MatPaginator)paginator:MatPaginator;

    // Private
    private _unsubscribeAll: Subject<any>;
    constructor(
        private _chatService: ChatService,
        public dialog: MatDialog,
        public _matDialog: MatDialog,
        private _fuseSidebarService: FuseSidebarService,
    ) {
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        this.dataSource.sort=this.sort;
        // this._chatService.onChatSelected
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe(chatData => {
        //     });
    }
    toggleSidebar(name): void
    {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }

    toggleSidebarClosed(name):void{
        this._fuseSidebarService.getSidebar(name).toggleOpen();

    }

    // toggleSidebarOpen(key): void {
    //     this._fuseSidebarService.getSidebar(key).toggleOpen();
    // }
    cancel() {
        
        // this.router.navigate([""]);
        // this.logUserActivity("RESET YOUR PASSWORD", LOG_MESSAGES.CANCEL);
      }
    

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}

