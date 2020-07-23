import { DataSource } from '@angular/cdk/collections';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { ContactsContactFormDialogComponent } from 'app/main/apps/contacts/contact-form/contact-form.component';
import { ContactsService } from 'app/main/apps/contacts/contacts.service';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from 'app/service/auth.service';
import { MatTableDataSource } from "@angular/material/table";
import { roleList } from 'app/models/user-details';
import { Router, NavigationExtras } from "@angular/router";
import {  ActivatedRoute } from "@angular/router";

@Component({
    selector: 'contacts-contact-list',
    templateUrl: './contact-list.component.html',
    styleUrls: ['./contact-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class ContactsContactListComponent implements OnInit, OnDestroy {
    @ViewChild('dialogContent') dialogContent: TemplateRef<any>;
    contacts: any;
    user: any;
    // dataSource: FilesDataSource | null;
    displayedColumns = ['rolename', 'desc', 'active', 'roleId'];
    selectedContacts: any[];
    checkboxes: {};
    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    private _unsubscribeAll: Subject<any>;
    roleList:any;
    isLoading = true;
    details: any;
    user1: roleList;
    dataSource = new MatTableDataSource<any>();
    deleteinfo:any;
    constructor(
        private router: Router,
        private authService: AuthService,
        private _contactsService: ContactsService,
        public matDialog: MatDialog) {
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        // this.dataSource = new FilesDataSource(this._contactsService);
        this._contactsService.onContactsChanged.pipe(takeUntil(this._unsubscribeAll))
            .subscribe(contacts => {
                this.contacts = contacts;
                this.checkboxes = {};
                contacts.map(contact => {
                    this.checkboxes[contact.id] = false;
                });
            });
        this._contactsService.onSelectedContactsChanged.pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedContacts => {
                for (const id in this.checkboxes) {
                    if (!this.checkboxes.hasOwnProperty(id)) {
                        continue;
                    }
                    this.checkboxes[id] = selectedContacts.includes(id);
                }
                this.selectedContacts = selectedContacts;
            });
        this._contactsService.onUserDataChanged.pipe(takeUntil(this._unsubscribeAll))
            .subscribe(user => {
                this.user = user;
            });
        this._contactsService.onFilterChanged.pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this._contactsService.deselectContacts();
            });
            this.getAllRoles()
    }
    getAllRoles(){
        this.authService.getAllRoles(this.user).subscribe(res => {
            this.roleList = res
            console.log("rolelist", this.roleList);
            // this.isLoading = false;
            this.dataSource.data = this.roleList;
        },
            // error => this.isLoading = false
        ); 
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
        this.dialogContent = null;
        this.contacts = null;
        this.user = null;
        this.dataSource = null;
        this.displayedColumns = null;
        this.selectedContacts = null;
        this.checkboxes = null;
        this.dialogRef = null;
        this.confirmDialogRef = null;
        this._contactsService = null;
        this.matDialog = null;
    }

    editRole(roleId)
        {
            let navigationExtras: NavigationExtras = {
                queryParams: {
                    roleId:roleId
                
                }
            };
        }
        onDelete(userId): void {
            console.log(userId);
            this.confirmDialogRef = this.matDialog.open(FuseConfirmDialogComponent, {
              disableClose: false,
            });
           this.confirmDialogRef.componentInstance.confirmMessage = "Are you sure you want to delete?";
            this.confirmDialogRef.afterClosed().subscribe((result) => {
              if (result) {
                this.authService.deleteUser(userId).subscribe((res) => {
                    this.deleteinfo = res;
                    console.log("deleterrow", this.deleteinfo);
                  });
                  this.getAllRoles();
              }
           
              this.confirmDialogRef = null;
            });
          }

    editContact(contact): void {
        this.dialogRef = this.matDialog.open(ContactsContactFormDialogComponent, {
            panelClass: 'contact-form-dialog',
            width: '900px',
            data: {
                contact: contact,
                action: 'edit',
            }
        });

        this.dialogRef.afterClosed().subscribe(response => {
            if (!response) {
                return;
            }
            const actionType: string = response[0];
            const formData: FormGroup = response[1];
            switch (actionType) {
                case 'save':
                    this._contactsService.updateContact(formData.getRawValue());
                    break;
                case 'delete':
                    this.deleteContact(contact);
                    break;
            }
        });
    }

    deleteContact(contact): void {
        this.confirmDialogRef = this.matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });
        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';
        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this._contactsService.deleteContact(contact);
            }
            this.confirmDialogRef = null;
        });
    }

    onSelectedChange(contactId): void {
        this._contactsService.toggleSelectedContact(contactId);
    }

    toggleStar(contactId): void {
        if (this.user.starred.includes(contactId)) {
            this.user.starred.splice(this.user.starred.indexOf(contactId), 1);
        } else {
            this.user.starred.push(contactId);
        }
        this._contactsService.updateUserData(this.user);
    }
}

export class FilesDataSource extends DataSource<any>
{
    /**
     * Constructor
     *
     * @param {ContactsService} _contactsService
     */
    constructor(
        private _contactsService: ContactsService
    ) {
        super();
    }

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     * @returns {Observable<any[]>}
     */
    connect(): Observable<any[]> {
        return this._contactsService.onContactsChanged;
    }

    /**
     * Disconnect
     */
    disconnect(): void {
    }
}
