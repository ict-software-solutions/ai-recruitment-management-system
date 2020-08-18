import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { ThemePalette } from "@angular/material/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { ProgressSpinnerMode } from "@angular/material/progress-spinner";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { NavigationExtras, Router } from "@angular/router";
import { fuseAnimations } from "@fuse/animations";
import { FuseUtils } from "@fuse/utils";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { AuthService } from "app/service/auth.service";
import { LogService } from "app/service/shared/log.service";
import { DISPLAY_COLUMNS_FOR_USERMGMT, LOG_LEVELS, LOG_MESSAGES } from "app/util/constants";
import { Subscription } from "rxjs";
import { AirmsService } from 'app/service/airms.service';

@Component({
  selector: "e-commerce-products",

  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.scss"],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None,
})

export class EcommerceProductsComponent implements OnInit, OnDestroy {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("filter", { static: true }) filter: ElementRef;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ["image", "firstName", "lastName", "userType", "roleName", "activated", "userId"];
  isLoading = true;
  color: ThemePalette = "primary";
  mode: ProgressSpinnerMode = "determinate";
  roleName: String;
  userDetailSubscription: Subscription;
  deleteUserSubscription: Subscription;

  constructor(
    private router: Router,
    private authService: AuthService,
    public matDialog: MatDialog,
    public logService: LogService,
    private airmsService: AirmsService
  ) { this.logUserActivity("User Management", LOG_MESSAGES.CLICK); 
    this.roleName = airmsService.getUserRole();
    if (this.roleName !== 'Admin') {
      this.displayedColumns = ["image","firstName", "lastName", "userType", "roleName", "activated"];
    }
}

  ngOnInit(): void {
    this.getAllUsers();
    
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  getAllUsers() {
    this.userDetailSubscription = this.authService.getAllUsers().subscribe(
      (res: any) => {
        res.forEach((user) => {
          if (user["profileImage"] !== null && user["profileImage"] !== "") {
            user["profileImage"] = atob(user["profileImage"]);
          }
          if(user['roles']!== null) {
            user["roleName"] = user['roles']['roleName'];
          }
        });
        this.isLoading = false;
        this.dataSource.data  = res;
      },
      (error) => {
        this.isLoading = false;
        this.logService.logError(LOG_LEVELS.ERROR, "User Management - Fetch User", "On Fetching Users", JSON.stringify(error));
      }
    );
  }

  onDelete(userId): void {
    this.logUserActivity("User Management - Delete", LOG_MESSAGES.CLICK);
    this.confirmDialogRef = this.matDialog.open(FuseConfirmDialogComponent, { disableClose: false });
    this.confirmDialogRef.componentInstance.confirmMessage = "Are you sure you want to delete?";
    this.confirmDialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteUserSubscription = this.authService.deleteUser(userId).subscribe(() => { },
          (error) => {
            this.logService.logError(LOG_LEVELS.ERROR, "User Management - Delete", "On Try delete User",
              JSON.stringify(error));
          }
        );
        this.getAllUsers();
      }
      this.confirmDialogRef = null;
    });
  }

  editUser(userId, userType) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        userId: userId,
        userType: userType,
        viewMode: false,
      },
      skipLocationChange: true,
    };
    this.router.navigate(["/apps/profile/forms"], navigationExtras);
  }

  addRole() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        name: "addrole",
        viewMode: false,
      },
    };
    this.router.navigate(["/apps/profile/forms"], navigationExtras);
  }

  logUserActivity(from, value) {
    this.logService.logUserActivity(LOG_LEVELS.INFO, from, value);
  }

  searchFromTable(filterValue) {
    filterValue = filterValue.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  unsubscribe(subscription: Subscription) {
    if (subscription !== null && subscription !== undefined) {
      subscription.unsubscribe();
    }
  }

  ngOnDestroy() {
    this.unsubscribe(this.userDetailSubscription);
    this.unsubscribe(this.deleteUserSubscription);
    this.dataSource = null;
    this.displayedColumns = null;
    this.paginator = null;
    this.sort == null;
    this.filter = null;
    this.isLoading = null;
    this.confirmDialogRef = null;
    this.color = null;
    this.mode = null;
    this.matDialog = null;
    this.router = null;
    this.authService = null;
    this.logService = null;
  }
}
