import { DataSource } from '@angular/cdk/collections';
import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, OnDestroy, Inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FuseUtils } from '@fuse/utils';
import { UserManagementService } from 'app/main/apps/usermanagement/users/users.service';
import { BehaviorSubject, fromEvent, merge, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { AuthService } from 'app/service/auth.service';
import { GET_ALL_USER, SIGNUP } from 'app/util/constants';
import { AirmsService } from 'app/service/airms.service';
import { Subscription } from 'rxjs';
import { UserService } from 'app/service/user.service';
import { userInfo } from 'os';
import { usersList } from 'app/models/user-details';
import { MatTableDataSource } from "@angular/material/table";
import { ThemePalette } from '@angular/material/core';
import { Router, NavigationExtras } from "@angular/router";
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { Product } from '../addusers/addusers.model';
import { userDetails } from 'app/models/user-details';
import { LOGGED_IN_USER_INFO} from 'app/util/constants';
import {  ActivatedRoute } from "@angular/router";

@Component({
    selector: 'e-commerce-products',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})

export class EcommerceProductsComponent implements OnInit, OnDestroy {
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild('filter', { static: true }) filter: ElementRef;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    dataSource = new MatTableDataSource<any>();
    dataSource1 = new MatTableDataSource<any>();
    // dataSource : any| FilesDataSource | null ;
    // @ViewChild("sort") sort: MatSort;
    // @ViewChild("paginator") paginator: MatPaginator;
    // userDetailSubscription: Subscription;
    private unsubscribeAll: Subject<any>;
    userDetailSubscription: Subscription;
    $: any;
    userDetailUpdateSubscription: Subscription;
    user1: usersList;
    details: any;
    userData: any;
    deleteinfo: any;
    userProfileUpdateSubscription: Subscription;
    displayedColumns: string[] = ['image', 'firstName', 'lastName', 'userType', 'roleName','activated','userId'];
    isLoading = true;
    color: ThemePalette = 'primary';
    mode: ProgressSpinnerMode = 'determinate';
    value = 50;
    userInfo: userDetails;
    user: userDetails;
    userId:String;
    userName:String;
    userType:String;
    firstName:String;

    constructor(
        private userService: UserService,
        public dialog: MatDialog,
        private router: Router,
        private route: ActivatedRoute,
        private authService: AuthService,
        private airmsService: AirmsService,
        private userManagementService: UserManagementService,
        public matDialog: MatDialog) {
        this.unsubscribeAll = new Subject();
        this.user1 = airmsService.getSessionStorage(SIGNUP)
        this.unsubscribeAll = new Subject();

    }

    ngOnInit(): void {
        this.userInfo =this.airmsService.getSessionStorage(LOGGED_IN_USER_INFO);
        console.log("userinfo",this.userInfo);
        this.user = this.airmsService.getSessionStorage(SIGNUP);
        console.log("user",this.user);
        this.userName=this.user.userName;
        console.log("UserName",this.userName);
        //We want to use this code for mat sort and filter  (important)

        /*this.dataSource = new FilesDataSource(this.userManagementService, this.paginator, this.sort);
        fromEvent(this.filter.nativeElement, 'keyup').pipe(
            takeUntil(this.unsubscribeAll),
            debounceTime(150),
            distinctUntilChanged()
        ).subscribe(() => {
            if (!this.dataSource) { return; }
            this.dataSource.filter = this.filter.nativeElement.value;
        });*/
        this.getAllUsers()
        this.getAllInfo()
    }

    getAllUsers() {
        this.authService.getAllUsers(this.user1).subscribe(res => {
            this.details = res
            console.log("details", this.details);
            this.isLoading = false;
            this.dataSource.data = this.details;
        },
            error => this.isLoading = false
        );
    }

    onSelect(selectedItem: any) {
        console.log("selectedItemId", selectedItem.userId, selectedItem.firstName, selectedItem.lastName,
            selectedItem.userType,
            selectedItem.roles.roleName,
        )
    }

    getAllInfo() {
        this.authService.getAllInfo(this.user1).subscribe(res => {
            this.userData = res
            console.log("userData", this.userData);
            this.dataSource1.data = this.userData;

        })
    }
    // onDelete(userId): void {
    //     console.log(userId);
    //     if (confirm('are you sure want to delete?')) {
    //         this.authService.deleteUser(userId).subscribe(res => {
    //             this.deleteinfo = res
    //             console.log("deleterrow", this.deleteinfo);
    //         })
    //     }
    // }
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
              this.getAllUsers();
          }
       
          this.confirmDialogRef = null;
        });
      }
      onTap(userId,userType) {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                userId:userId,
                userType:userType,
                viewMode:false
            },
            skipLocationChange: true
        };
        this.router.navigate(['/apps/profile/forms'], navigationExtras);
    }
    addUser() {
        // console.log("userId",userId);
        let navigationExtras: NavigationExtras = {
            queryParams: {
                // userId:userId,
                viewMode:false
            },
            skipLocationChange: true
        };
        this.router.navigate(['/apps/profile/forms'], navigationExtras);
    }
    addRole() {
        console.log("hi");
        let navigationExtras: NavigationExtras = {
            queryParams: {
               name:"addrole",
               viewMode:false
            }
        };
        this.router.navigate(['/apps/profile/forms'], navigationExtras);
    }
    //reuse code
    /*onDelete(userId): void {
        this.confirmDialogRef = this.matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });
        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';
        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
            }
        this.authService.deleteUser(userId).subscribe(res =>{
            this.deleteinfo = res
            console.log("deleterrow",this.deleteinfo);
        })
            this.confirmDialogRef = null;
    }*/
    connect(): Observable<any> {
        return this.authService.getAllUsers(Object);
    }
    ngAfterViewInit() {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        // this.dataSourceGifts.sort = this.sortGifts;
        // this.dataSourceGifts.paginator = this.paginatorGifts;
    }
  
    ngOnDestroy() {
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
        this.dataSource = null;
        this.displayedColumns = null;
        this.paginator = null;
        this.sort == null;
        this.filter = null;
        this.confirmDialogRef = null;
        this.dialog = null;
        this.userManagementService = null;
        this.matDialog = null;
    }
}

export class FilesDataSource extends DataSource<any>
{
    private _filterChange = new BehaviorSubject('');
    private _filteredDataChange = new BehaviorSubject('');
    constructor(
        private ecommerceProductsService: UserManagementService,
        private _matPaginator: MatPaginator,
        private _matSort: MatSort
    ) {
        super();
        this.filteredData = this.ecommerceProductsService.products;
    }

    connect(): Observable<any[]> {
        const displayDataChanges = [
            this.ecommerceProductsService.onProductsChanged,
            this._matPaginator.page,
            this._filterChange,
            this._matSort.sortChange
        ];

        return merge(...displayDataChanges)
            .pipe(
                map(() => {
                    let data = this.ecommerceProductsService.products.slice();

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

        return data.sort((a, b) => {
            let propertyA: number | string = '';
            let propertyB: number | string = '';

            switch (this._matSort.active) {
                case 'id':
                    [propertyA, propertyB] = [a.id, b.id];
                    break;
                case 'username':
                    [propertyA, propertyB] = [a.username, b.username];
                    break;
                case 'categories':
                    [propertyA, propertyB] = [a.categories[0], b.categories[0]];
                    break;
                case 'price':
                    [propertyA, propertyB] = [a.priceTaxIncl, b.priceTaxIncl];
                    break;
                case 'quantity':
                    [propertyA, propertyB] = [a.quantity, b.quantity];
                    break;
                case 'active':
                    [propertyA, propertyB] = [a.active, b.active];
                    break;
            }

            const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
            const valueB = isNaN(+propertyB) ? propertyB : +propertyB;
            return (valueA < valueB ? -1 : 1) * (this._matSort.direction === 'asc' ? 1 : -1);
        });
    }
    disconnect(): void {
    }
}
// export class UserDataSource extends DataSource<any> {
//     constructor(private authService: AuthService) {
//       super();
//     }
//     connect(): Observable<product[]> {
//       return this.authService.getAllUsers();
//     }
//     disconnect() {}
//   }