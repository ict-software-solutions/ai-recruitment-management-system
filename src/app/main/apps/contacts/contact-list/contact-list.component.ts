import { DataSource } from '@angular/cdk/collections';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NavigationExtras, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { ContactsService } from 'app/main/apps/contacts/contacts.service';
import { roleList } from 'app/models/user-details';
import { AuthService } from 'app/service/auth.service';
import { Observable, Subject,BehaviorSubject, merge } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { FuseUtils } from '@fuse/utils';

@Component({
    selector: 'contacts-contact-list',
    templateUrl: './contact-list.component.html',
    styleUrls: ['./contact-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class ContactsContactListComponent implements OnInit, OnDestroy {
    @ViewChild('dialogContent') dialogContent: TemplateRef<any>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
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
    connect(): Observable<any> {
        return this.authService.getAllRoles(Object);
    }
    ngAfterViewInit() {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        // this.dataSourceGifts.sort = this.sortGifts;
        // this.dataSourceGifts.paginator = this.paginatorGifts;
    }
   

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
        this.dialogContent = null;
        this.contacts = null;
        this.user = null;
        this.paginator=null;
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
    private _filterChange = new BehaviorSubject('');
    private _filteredDataChange = new BehaviorSubject('');
    constructor(
        private _contactsService: ContactsService,
        private _matPaginator: MatPaginator,
        private _matSort: MatSort
    ) {
        super();
    }
    connect(): Observable<any[]> {
        const displayDataChanges = [
           this._contactsService.onContactsChanged,
           this._matPaginator.page,
           this._filterChange,
           this._matSort.sortChange
        ]
        return merge(...displayDataChanges)
        .pipe(
            map(() => {
                let data = this._contactsService.contacts.slice();
                data = this.filterData(data);
                this.filteredData = [...data];
                data = this.sortData(data);
                // Grab the page's slice of data.
                const startIndex = this._matPaginator.pageIndex * this._matPaginator.pageSize;
                return data.splice(startIndex, this._matPaginator.pageSize);
            }
            ));
    }
    get filteredData(): any {
        return this._filteredDataChange.value;
    }

    set filteredData(value: any) {
        this._filteredDataChange.next(value);
    }

    // Filter
    get filter(): string {
        return this._filterChange.value;
    }

    set filter(filter: string) {
        this._filterChange.next(filter);
    }
    filterData(data): any {
        if (!this.filter) {
            return data;
        }
        return FuseUtils.filterArrayByString(data, this.filter);
    }
        
        sortData(data): any[] {
            if (!this._matSort.active || this._matSort.direction === '') {
                return data;
            }
}
    disconnect() {
    }
}
