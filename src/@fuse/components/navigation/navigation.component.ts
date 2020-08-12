import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { FuseNavigationService } from "@fuse/components/navigation/navigation.service";
import { navigation } from "app/navigation/navigation";
import { AirmsService } from "app/service/airms.service";
import { AuthService } from "app/service/auth.service";
import { LOGGED_IN_USER_INFO } from "app/util/constants";
import { merge, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { FuseSidebarService } from "../sidebar/sidebar.service";

@Component({
  selector: "fuse-navigation",
  templateUrl: "./navigation.component.html",
  styleUrls: ["./navigation.component.scss"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FuseNavigationComponent implements OnInit {
  @Input()
  layout = "vertical";
  @Input()
  navigation: any;
  private _unsubscribeAll: Subject<any>;
  backupNavigation: any[];
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private authService: AuthService,
    private airmsService: AirmsService,
    private _fuseSidebarService: FuseSidebarService,
    private _fuseNavigationService: FuseNavigationService
  ) {
    this._unsubscribeAll = new Subject();
  }
  ngOnInit(): void {
    this.navigation = this.navigation || this._fuseNavigationService.getCurrentNavigation();
    this._fuseNavigationService.onNavigationChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(async () => {
      this.navigation = [];
      if (this.authService.hasUserLoggedIn) {
        this.navigation = <any[]>await this.getSideMenus();
        this._changeDetectorRef.markForCheck();
      }
    });

    merge(
      this._fuseNavigationService.onNavigationItemAdded,
      this._fuseNavigationService.onNavigationItemUpdated,
      this._fuseNavigationService.onNavigationItemRemoved
    )
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {
        this._changeDetectorRef.markForCheck();
      });
  }

  getSideMenus(): any {
    let pageValue = [];
    let screenMapping = this.airmsService.getUserRoleScreenMap();
    let roleName = this.airmsService.getUserRole();
    if (screenMapping !== null || screenMapping.length > 0) {
      pageValue = screenMapping;
    }
    const userRoles = [{ name: roleName, pages: pageValue }];
    this.navigation = [];
    const backupNavigation = { navValues: navigation[0]["children"] };
    const userRole = this.airmsService.getUserRole();
    const filterUserRole = userRoles.filter((role) => role["name"] === userRole);
    let filteredChild = [];
    if (filterUserRole.length > 0) {
      if (backupNavigation["navValues"] !== undefined) {
        const pages = filterUserRole[0]["pages"];
        const children = backupNavigation["navValues"];
        loop1: for (let i = 0; i < pages.length; i++) {
          for (let j = 0; j < children.length; j++) {
            if (pages[i] === children[j]["title"]) {
              filteredChild.push(children[j]);
              continue loop1;
            }
          }
        }
      }
    }
    backupNavigation["navValues"] = filteredChild;
    return backupNavigation["navValues"];
  }
}
