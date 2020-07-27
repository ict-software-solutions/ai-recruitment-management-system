import { DataSource } from '@angular/cdk/collections';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from "@angular/material/table";
import { NavigationExtras, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { ContactsService } from 'app/main/apps/contacts/contacts.service';
import { roleList } from 'app/models/user-details';
import { AuthService } from 'app/service/auth.service';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';

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
    displayedColumns = ['rolename', 'desc', 'active', 'roleId'];
    selectedContacts: any[];
    checkboxes: {};
    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    private _unsubscribeAll: Subject<any>;
    roleList: any;
    isLoading = true;
    details: any;
    user1: roleList;
    dataSource = new MatTableDataSource<any>();
    deleteinfo: any;
    message = '';
    view = false;
    status:any;
    constructor(
        private router: Router,
        private authService: AuthService,
        private _contactsService: ContactsService,
        public matDialog: MatDialog) {
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
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
    getAllRoles() {
        this.authService.getAllRoles(this.user).subscribe(res => {
            this.roleList = res
            this.dataSource.data = this.roleList;
        },
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
        this.router = null;
    }

    editRole(roleId) {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                roleId: roleId
            }
        };
    }
    onDelete(roleId): void {
        this.confirmDialogRef = this.matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false,
        });
        this.confirmDialogRef.componentInstance.confirmMessage = "Are you sure you want to delete?";
        this.confirmDialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.authService.deleteRole(roleId).subscribe((res) => {
                    this.deleteinfo = res;
                });
                this.getAllRoles();
            }
            this.confirmDialogRef = null;
        });
    }

    editContact(roleId): void {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                roleId: roleId,
                action: 'edit',
            },
            skipLocationChange: true
        };
        this.view = false;
        this.router.navigate(['apps/contacts/addRole'], navigationExtras);
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
    constructor(
        private _contactsService: ContactsService
    ) {
        super();
    }
    connect(): Observable<any[]> {
        return this._contactsService.onContactsChanged;
    }
    disconnect(): void {
    }
}
