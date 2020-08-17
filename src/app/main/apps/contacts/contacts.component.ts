import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { ContactsService } from 'app/main/apps/contacts/contacts.service';
import { ContactsContactFormDialogComponent } from 'app/main/apps/contacts/contact-form/contact-form.component';
import { NavigationExtras, Router } from '@angular/router';
import { LOG_MESSAGES, LOG_LEVELS } from 'app/util/constants';
import { LogService } from 'app/service/shared/log.service';
import { AirmsService } from 'app/service/airms.service';
import {  TemplateRef, ViewChild} from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { AuthService } from "app/service/auth.service";
import { DISPLAY_COLUMNS_FOR_ROLEMGMT} from "app/util/constants";
import { Subscription } from "rxjs";
import Swal from "sweetalert2";


@Component({
    selector: 'contacts',
    templateUrl: './contacts.component.html',
    styleUrls: ['./contacts.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ContactsComponent implements OnInit, OnDestroy {
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
    searchInput: FormControl;
    // roleName: string;
 
    constructor(
        
        // private router: Router,
    private authService: AuthService,
    public matDialog: MatDialog,
    private logService: LogService,
        private _fuseSidebarService: FuseSidebarService,
        private _matDialog: MatDialog,
        private router: Router,
        
        // private logService: LogService,
        private airmsService: AirmsService
        
    ) 
    
    {

        this.searchInput = new FormControl('');
        this.roleName = airmsService.getUserRole();
        this.logUserActivity("Role Management", LOG_MESSAGES.CLICK);
        if (this.roleName !== 'Admin') {
            this.displayedColumns = ['rolename', 'desc', 'active'];
          }
    }
    ngOnInit(): void {
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
    
searchFromTable(filterValue) {
  console.log('filterValue', filterValue);
  filterValue = filterValue.trim().toLowerCase();
  this.dataSource.filter = filterValue;
  console.log('this.dataSource.filter', this.dataSource.filter);
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
  
    addNewRole() {
        this.logUserActivity("Role Management - Add", LOG_MESSAGES.CLICK);
        let navigationExtras: NavigationExtras = {
            queryParams: {},
            skipLocationChange: true
        };
        this.router.navigate(['apps/contacts/addRole'], navigationExtras);
    }

  
   
    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }
}
