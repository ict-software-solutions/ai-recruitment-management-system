import { DataSource } from "@angular/cdk/collections";
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { NavigationExtras, Router } from "@angular/router";
import { debounceTime, distinctUntilChanged, map } from "rxjs/operators";
import { fuseAnimations } from "@fuse/animations";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { ContactsService } from "app/main/apps/contacts/contacts.service";
import { roleList } from "app/models/user-details";
import { AuthService } from "app/service/auth.service";
import { Observable, Subject, BehaviorSubject, merge, Subscription } from "rxjs";
import { takeUntil } from "rxjs/operators";
import Swal from "sweetalert2";
import { FuseUtils } from "@fuse/utils";
import { DISPLAY_COLUMNS_FOR_ROLEMGMT, LOG_MESSAGES, LOG_LEVELS } from "app/util/constants";
import { LogService } from "app/service/shared/log.service";

@Component({
  selector: "contacts-contact-list",
  templateUrl: "./contact-list.component.html",
  styleUrls: ["./contact-list.component.scss"],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class ContactsContactListComponent implements OnInit, OnDestroy {
  @ViewChild("dialogContent") dialogContent: TemplateRef<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  displayedColumns = DISPLAY_COLUMNS_FOR_ROLEMGMT;
  dataSource = new MatTableDataSource<any>();
  roleList: any;
  isLoading = true;
  deleteRoleList: any;
  roleListSubscription: Subscription;
  deleteRoleListSubscription: Subscription;

  constructor(private router: Router, private authService: AuthService, public matDialog: MatDialog, private logService: LogService) {}

  ngOnInit(): void {
    this.getAllRoles();
  }
  getAllRoles() {
    this.roleListSubscription = this.authService.getAllRoles().subscribe(
      (res) => {
        this.roleList = res;
        this.isLoading = false;
        this.dataSource.data = this.roleList;
      },
      (error) => {
        this.isLoading = false;
        this.logService.logError(LOG_LEVELS.ERROR, "Role Management - List", "On Fetching roles", JSON.stringify(error));
      }
    );
  }

  connect(): Observable<any> {
    return this.authService.getAllRoles();
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  unsubscribe(subscription: Subscription) {
    if (subscription !== null && subscription !== undefined) {
      subscription.unsubscribe();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe(this.roleListSubscription);
    this.unsubscribe(this.deleteRoleListSubscription);
    this.dialogContent = null;
    this.paginator = null;
    this.dataSource = null;
    this.displayedColumns = null;
    this.confirmDialogRef = null;
    this.router = null;
    this.logService = null;
    this.authService = null;
    this.deleteRoleList = null;
    this.roleList = null;
    this.isLoading = null;
  }

  deleteRole(roleId): void {
    this.logUserActivity("Role Management - Delete", LOG_MESSAGES.CLICK);
    this.confirmDialogRef = this.matDialog.open(FuseConfirmDialogComponent, {
      disableClose: false,
    });
    this.confirmDialogRef.componentInstance.confirmMessage = "Are you sure you want to delete?";
    this.confirmDialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteRoleListSubscription = this.authService.deleteRole(roleId).subscribe(
          (res) => {
            this.deleteRoleList = res;
            if (this.deleteRoleList.message === "Role assigned to user") {
              Swal.fire({
                title: "Role is assigned to User",
                icon: "warning",
                confirmButtonText: "Ok",
              });
            }
            this.getAllRoles();
          },
          (error) => {
            this.logService.logError(LOG_LEVELS.ERROR, "Role Management - Delete", "On deleting role", JSON.stringify(error));
          }
        );
      }
      this.confirmDialogRef = null;
    });
  }

  editRole(roleId): void {
    this.logUserActivity("Role Management - Edit", LOG_MESSAGES.CLICK);
    let navigationExtras: NavigationExtras = {
      queryParams: {
        roleId: roleId,
        action: "edit",
      },
      skipLocationChange: true,
    };
    this.router.navigate(["apps/contacts/addRole"], navigationExtras);
  }
  logUserActivity(from, value) {
    this.logService.logUserActivity(LOG_LEVELS.INFO, from, value);
  }
}
export class FilesDataSource extends DataSource<any> {
  private _filterChange = new BehaviorSubject("");
  private _filteredDataChange = new BehaviorSubject("");
  constructor(private _contactsService: ContactsService, private _matPaginator: MatPaginator, private _matSort: MatSort) {
    super();
  }
  connect(): Observable<any[]> {
    const displayDataChanges = [
      this._contactsService.onContactsChanged,
      this._matPaginator.page,
      this._filterChange,
      this._matSort.sortChange,
    ];
    return merge(...displayDataChanges).pipe(
      map(() => {
        let data = this._contactsService.contacts.slice();
        data = this.filterData(data);
        this.filteredData = [...data];
        data = this.sortData(data);
        // Grab the page's slice of data.
        const startIndex = this._matPaginator.pageIndex * this._matPaginator.pageSize;
        return data.splice(startIndex, this._matPaginator.pageSize);
      })
    );
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
    if (!this._matSort.active || this._matSort.direction === "") {
      return data;
    }
  }
  disconnect() {}
}
