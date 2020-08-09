import { CdkDragDrop, moveItemInArray, transferArrayItem } from "@angular/cdk/drag-drop";
import { Component, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { ActivatedRoute } from "@angular/router";
import { Contact } from "app/main/apps/contacts/contact.model";
import { usertype } from "app/models/user-type";
import { AuthService } from "app/service/auth.service";
import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { NavigationExtras, Router } from "@angular/router";
import Swal from "sweetalert2";
import { Screens, Status } from "app/util/configuration";
import { AirmsService } from "app/service/airms.service";
import { LOGGED_IN_USER_INFO, LOG_LEVELS, LOG_MESSAGES } from "app/util/constants";
import { LogService } from "app/service/shared/log.service";
import { Subscription } from "rxjs";
import { navigation } from 'app/navigation/navigation';

@Component({
  selector: "contacts-contact-form-dialog",
  templateUrl: "./contact-form.component.html",
  styleUrls: ["./contact-form.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ContactsContactFormDialogComponent {
  roleMgmtForm: FormGroup;
  roleDetails: any;
  roleId = 0;
  errorMessage = "";
  userInfo: any;
  todo: any; // Unmapped
  done: any; // Mapped
  roleSubscription: Subscription;
  updateRoleSubscription: Subscription;
  labelPosition: "before" | "after" = "after";

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private airmsService: AirmsService,
    private logService: LogService
  ) {
    this.userInfo = airmsService.getSessionStorage(LOGGED_IN_USER_INFO);
    console.log('navigation', navigation);
    this.todo = {value: JSON.parse(JSON.stringify(navigation[0]['children']))};
    console.log('navigation todo', this.todo);
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
  }
  ngOnInit() {
    this.roleMgmtForm = this.formBuilder.group({
      roleId: [""],
      roleName: [""],
      active: [],
      roleDescription: [""],
      screen: [""],
      createdBy: [""],
      modifiedBy: [""],
    });
    this.route.queryParams.subscribe((params) => {
      if (params.roleId != undefined) {
        this.roleId = Number(params.roleId);
        this.getRoleInfo(Number(params.roleId));
      } else {
        this.roleId = 0;
        this.todo = {value: JSON.parse(JSON.stringify(navigation[0]['children']))};
        this.done = {value: []};
        console.log('this.todo', this.todo, 'this.done', this.done);
      }
    });
  }
  getRoleInfo(roleId) {
    let screenMap = { newValue: [] };
    let totalScreenMap = { data: this.todo['value'] };
    console.log("this.mapScreens", totalScreenMap);
    this.roleSubscription = this.authService.getAllRolesInfo(roleId).subscribe(
      (res) => {
        this.roleDetails = res;
        this.roleMgmtForm.patchValue(res);
        console.log("this.roleDetails.screenMapping", this.roleDetails.screenMapping);
        if (this.roleDetails.screenMapping.length > 0) {
          screenMap["newValue"] = this.roleDetails.screenMapping;
          var filterResDone = totalScreenMap["data"].filter(function (el) {
            return screenMap["newValue"].indexOf(el.title) < 0;
          });
          var filterRes = totalScreenMap["data"].filter(function (el) {
            return screenMap["newValue"].indexOf(el.title) >= 0;
          });
          this.todo['value'] = filterResDone;
          this.done['value'] = filterRes;
          console.log('this.toDo', this.todo, 'this.done Done', this.done);
        } else {
          this.todo = {value: JSON.parse(JSON.stringify(navigation[0]['children']))};
          this.done = {value: []};
        }
      },
      (error) => {
        this.logService.logError(LOG_LEVELS.ERROR, "Role Management", "On fetching roles", JSON.stringify(error));
      }
    );
  }
  updateRole(value) {
    this.logUserActivity("Role Management - Save", LOG_MESSAGES.CLICK);
    let items = [];
    this.errorMessage = "";
    if (this.done['value'].length > 0) {
      for (let m = 0; m < this.done.length; m++) {
        items.push(this.done[m].title);
      }
    }
    let updateObject = {
      roleName: value.roleName,
      roleDescription: value.roleDescription,
      active: value.active,
      roleId: this.roleId,
      screenMapping: items,
    };
    if (this.roleId === 0) {
      updateObject["createdBy"] = this.userInfo.firstName;
    } else {
      updateObject["modifiedBy"] = this.userInfo.firstName;
    }
    console.log("updateObj", updateObject);
    this.updateRoleSubscription = this.authService.updateRolesInfo(updateObject).subscribe(
      (res) => {
        Swal.fire({
          title: "Role Saved",
          icon: "success",
          confirmButtonText: "Ok",
        }).then((res) => {
          if (res.value === true) {
            this.cancelEdit();
            this.router.navigate(["/apps/contacts"]);
          }
        });
      },
      (error) => {
        this.logService.logError(LOG_LEVELS.ERROR, "Role Management - Save", "On updating role", JSON.stringify(error));
        if (error.error.resCode === "RL-AL-ET") {
          this.errorMessage = error.error.message;
          Swal.fire({
            position: "center",
            icon: "warning",
            title: "Role already exists",
            showConfirmButton: true,
          });
        }
      }
    );
  }

  cancelEdit() {
    this.logUserActivity("Role Management - Cancel", LOG_MESSAGES.CLICK);
    this.router.navigate(["/apps/contacts"]);
  }
  addAllScreenMapping() {
    this.logUserActivity("Role Management - Add all screens for Mapping", LOG_MESSAGES.CLICK);
    this.todo = [];
    this.done = [];
    this.done = Screens;
  }
  removeAllScreenMapping() {
    this.logUserActivity("Role Management - Remove all screens for Mapping", LOG_MESSAGES.CLICK);
    this.todo = [];
    this.done = [];
    this.todo = Screens;
  }
  logUserActivity(from, value) {
    this.logService.logUserActivity(LOG_LEVELS.INFO, from, value);
  }

  unsubscribe(subscription: Subscription) {
    if (subscription !== null && subscription !== undefined) {
      subscription.unsubscribe();
    }
  }

  ngOnDestroy() {
    this.unsubscribe(this.roleSubscription);
    this.unsubscribe(this.updateRoleSubscription);
    this.roleMgmtForm = null;
    this.formBuilder = null;
    this.authService = null;
    this.router = null;
    this.airmsService = null;
    this.logService = null;
    this.errorMessage = null;
    this.roleDetails = null;
    this.todo = null;
    this.done = null;
  }
}

interface Item {
  name: string;
  selected: boolean;
}
