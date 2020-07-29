import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ChatService } from 'app/main/apps/chat/chat.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';

// import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

export interface PeriodicElement {
    user: string;
    screen: string;
    action: string;
    date: string;
  }
const ELEMENT_DATA: PeriodicElement[] = [
    {user: 'Karthiga', screen: 'Profile', action: 'update', date: 'Jul 27,2020  08.00.11AM'},
    {user: 'Tamilselvi balasubramaniyam', screen: 'User Management', action: 'update', date: 'Jul 26,2020  08.00.11AM'},
    {user: 'Janani', screen: 'Role Management', action: 'update', date: 'Jul 27,2020  08.00.11AM'},
    {user: 'Karthiga', screen: 'Profile', action: 'update', date: 'Jul 27,2020  08.00.11AM'},
  ];
@Component({
    selector     : 'chat',
    templateUrl  : './chat.component.html',
    styleUrls    : ['./chat.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class ChatComponent implements OnInit, OnDestroy
{
    displayedColumns: string[] = ['user', 'screen', 'action', 'date'];
    dataSource = ELEMENT_DATA;
    dialogRef: any;

    // Private
    private _unsubscribeAll: Subject<any>;
    /**
     * Constructor
     *
     * @param {ChatService} _chatService
     */
    constructor(
        private _chatService: ChatService,
        public dialog: MatDialog,
        public _matDialog: MatDialog
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }
 

    ngOnInit(): void
    {
        this._chatService.onChatSelected
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(chatData => {
                // this.selectedChat = chatData;
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}

