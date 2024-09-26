import { CdkDragDrop, moveItemInArray, transferArrayItem } from "@angular/cdk/drag-drop";
import { Component, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { navigation } from 'app/navigation/navigation';
import { AirmsService } from "app/service/airms.service";
import { AuthService } from "app/service/auth.service";
import { LogService } from "app/service/shared/log.service";
import { LOGGED_IN_USER_INFO, LOG_LEVELS, LOG_MESSAGES } from "app/util/constants";
import { Subscription } from "rxjs";
import Swal from "sweetalert2";
import { filter } from 'lodash';

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
  userName: any;
  unMappedScreens: any; // Unmapped
  mappedScreens = { value: [] }; // Mapped
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
    this.userName = airmsService.getUserName();
    this.unMappedScreens = { value: JSON.parse(JSON.stringify(navigation[0]['children'])) };
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
      roleName: ["", Validators.required],
      active: ['', Validators.required],
      roleDescription: ["", Validators.required],
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
        this.unMappedScreens = { value: JSON.parse(JSON.stringify(navigation[0]['children'])) };
        this.mappedScreens = { value: [] };
      }
    });
  }
  getRoleInfo(roleId) {
    let screenMap = { newValue: [] };
    let totalScreenMap = { data: this.unMappedScreens['value'] };
    let filterResDone = [], filterRes = [];
    this.roleSubscription = this.authService.getAllRolesInfo(roleId).subscribe(
      (res) => {
        this.roleDetails = res;
        this.roleMgmtForm.patchValue(res);
        if (this.roleDetails.screenMapping.length > 0) {
          screenMap["newValue"] = this.roleDetails.screenMapping;
          filterResDone = totalScreenMap["data"].filter( (el) => {
            return !screenMap["newValue"].includes(el.title);
          });
          filterRes = totalScreenMap["data"].filter( (el) => {
            return screenMap["newValue"].includes(el.title) ;
          });
          this.unMappedScreens['value'] = filterResDone;
          this.mappedScreens['value'] = filterRes;
        } else {
          this.unMappedScreens = { value: JSON.parse(JSON.stringify(navigation[0]['children'])) };
          this.mappedScreens = { value: [] };
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
    if (this.roleMgmtForm.valid) {
    if (this.mappedScreens['value'].length > 0) {
      for (let m = 0; m < this.mappedScreens['value'].length; m++) {
        items.push(this.mappedScreens['value'][m].title);
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
      updateObject["createdBy"] = this.airmsService.getUserFirstLastName();
    } else {
      updateObject["modifiedBy"] = this.airmsService.getUserFirstLastName();
    }
    this.updateRoleSubscription = this.authService.updateRolesInfo(updateObject).subscribe(
      (res) => {
        if(res['roleId']!== undefined) {
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
      } else {
        this.errorResponse(res);
      }
      },
      (error) => {
        this.errorResponse(error.error);
      }
    );
    } else {
      this.checkForFormFields();
    }
  }
  errorResponse(error) {
    this.logService.logError(LOG_LEVELS.ERROR, "Role Management - Save", "On updating role", JSON.stringify(error));
    if (error.resCode === "RL-AL-ET") {
      this.errorMessage = error.message;
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "Role already exists",
        showConfirmButton: true,
      });
    }
  }

  checkForFormFields() {
    for (const prop in this.roleMgmtForm.controls) {
      if (Object.prototype.hasOwnProperty.call(this.roleMgmtForm.controls, prop)) {
        if (this.roleMgmtForm.controls[prop].pristine) {
          this.roleMgmtForm.controls[prop].markAsTouched();
        }
      }
    }
  }

  cancelEdit() {
    this.logUserActivity("Role Management - Cancel", LOG_MESSAGES.CLICK);
    this.router.navigate(["/apps/contacts"]);
  }
  addAllScreenMapping() {
    this.logUserActivity("Role Management - Add all screens for Mapping", LOG_MESSAGES.CLICK);
    this.unMappedScreens['value'] = [];
    this.mappedScreens['value'] = [];
    this.mappedScreens['value'] = navigation[0]['children'];
  }
  removeAllScreenMapping() {
    this.logUserActivity("Role Management - Remove all screens for Mapping", LOG_MESSAGES.CLICK);
    this.unMappedScreens['value'] = [];
    this.mappedScreens['value'] = [];
    this.unMappedScreens['value'] = navigation[0]['children'];
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
    this.unMappedScreens = null;
    this.mappedScreens = null;
  }
}

interface Item {
  name: string;
  selected: boolean;
}
