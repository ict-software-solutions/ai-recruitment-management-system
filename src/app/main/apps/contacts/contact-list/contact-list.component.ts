import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { NavigationExtras, Router } from "@angular/router";
import { fuseAnimations } from "@fuse/animations";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { AuthService } from "app/service/auth.service";
import { LogService } from "app/service/shared/log.service";
import { DISPLAY_COLUMNS_FOR_ROLEMGMT, LOG_LEVELS, LOG_MESSAGES } from "app/util/constants";
import { Subscription } from "rxjs";
import Swal from "sweetalert2";
import { AirmsService } from 'app/service/airms.service';

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
  displayedColumns = ['rolename', 'desc', 'active', 'roleId'];
  dataSource = new MatTableDataSource<any>();
  isLoading = true;
  deleteRoleList: any;
  roleListSubscription: Subscription;
  deleteRoleListSubscription: Subscription;
  roleName: string;
  constructor(
    private router: Router,
    private authService: AuthService,
    public matDialog: MatDialog,
    private logService: LogService,
    private airmsService: AirmsService) {
      this.roleName = airmsService.getUserRole();
      if (this.roleName !== 'Admin') {
        this.displayedColumns = ['rolename', 'desc', 'active'];
      }
     }

  ngOnInit() {
    this.getAllRoles();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  getAllRoles() {
    this.roleListSubscription = this.authService.getAllRoles().subscribe(
      (res: any) => {
        this.dataSource.data = res;
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        this.logService.logError(LOG_LEVELS.ERROR, "Role Management - List", "On Fetching roles", JSON.stringify(error));
      }
    );
  }

  /* connect(): Observable<any> {
    return this.authService.getAllRoles();
  } */

  deleteRole(roleId): void {
    this.logUserActivity("Role Management - Delete", LOG_MESSAGES.CLICK);
    this.confirmDialogRef = this.matDialog.open(FuseConfirmDialogComponent, {
      disableClose: false,
    });
    this.confirmDialogRef.componentInstance.confirmMessage = "Are you sure you want to delete?";
    this.confirmDialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteRoleListSubscription = this.authService.deleteRole(roleId).
          subscribe((res) => {
            this.deleteRoleList = res;
            if (this.deleteRoleList.message === "Role assigned to user") {
              Swal.fire({
                title: "Role is assigned to User",
                icon: "warning",
                confirmButtonText: "Ok",
              });
            }
            this.getAllRoles();
          }, (error) => {
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
    this.isLoading = null;
  }
}
