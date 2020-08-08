import { CdkDragDrop, moveItemInArray, transferArrayItem } from "@angular/cdk/drag-drop";
import { Component, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';
import { Contact } from "app/main/apps/contacts/contact.model";
import { usertype } from "app/models/user-type";
import { AuthService } from "app/service/auth.service";
import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { NavigationExtras, Router } from '@angular/router';
import Swal from "sweetalert2";
import { Screens, Status } from 'app/util/configuration';
import { AirmsService } from 'app/service/airms.service';
import { LOGGED_IN_USER_INFO } from 'app/util/constants';


@Component({
  selector: "contacts-contact-form-dialog",
  templateUrl: "./contact-form.component.html",
  styleUrls: ["./contact-form.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ContactsContactFormDialogComponent {
  
  form: FormGroup;
  rolesDetails: any;
  selected1 = 'active';
  roleId = 0;
  errorMessage = '';
  message = '';
  buttonShow = true;
  buttonHide = false;
  view = false;

  usertypes: usertype[] = [
    { value: "Active" },
    { value: "InActive" },
    { value: "Candidate" }
  ];
  mapScreens = Screens;
  todo = [];
  done = [];
  status = Status;
  items = [];
  selectedItems: Item[];
  action: string;
  contact: Contact;
  contactForm: FormGroup;
  dialogTitle: string;
  labelPosition: "before" | "after" = "after";
  selected = false;
  selectdash = false;
  selectcal = false;
  selectpro = false;
  selectuser = false;
  selectrole = false;
  toggle1 = true;
  toggle2 = true;
  toggle3 = true;
  toggle4 = true;
  toggle5 = true;
  active: boolean;
  newRole = true;
  userInfo: any;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private airmsService: AirmsService
  ) {
    this.todo = this.mapScreens;
    this.userInfo = airmsService.getSessionStorage(LOGGED_IN_USER_INFO);
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
  }
  ngOnInit() {
    this.contactForm = this.formBuilder.group({
      roleId: [""],
      roleName: [""],
      active: [],
      roleDescription: [""],
      screen: [""],
      createdBy: [""],
      modifiedBy: [""]
    });
    this.route.queryParams.subscribe((params) => {
      if (params.roleId != undefined) {
        this.roleId = Number(params.roleId);
        this.getAllRolesInfo(Number(params.roleId));
      }
      else {
        this.roleId = 0;
      }
    });
  }
  getAllRolesInfo(roleId) {
    this.authService.getAllRolesInfo(roleId).subscribe((res) => {
      this.rolesDetails = res;
      this.contactForm.patchValue(res);
      if (this.rolesDetails.screenMapping.length > 0) {
        console.log('screens value', this.rolesDetails.screenMapping);
        let screenMap = this.rolesDetails.screenMapping;
       console.log('screenMap', screenMap, this.mapScreens);
       
       var filterResDone = this.mapScreens.filter(function (el) {
          return screenMap.indexOf(el.title) < 0; 
        });
        var filterRes = this.mapScreens.filter(function (el) {
          return screenMap.indexOf(el.title) >= 0; 
        });
       console.log('filteredArray', filterRes, 'filterResDone', filterResDone);
        this.todo = filterResDone;
        this.done = filterRes;
      } else {
        this.todo = Screens;
      }
    });
  }
  updateRole(value) {
    console.log('value', value, this.done);
    let items = [];
    if (this.done.length > 0) {
      for (let m = 0; m < this.done.length; m++) {
        items.push(this.done[m].title);
      }
    }
    console.log('items', items);
    this.errorMessage = '';
    this.message = '';
    let updateObject = {
      roleName: value.roleName,
      roleDescription: value.roleDescription,
      active: value.active,
      roleId: this.roleId,
      screenMapping: items
    };
    if (this.roleId === 0) {
      updateObject['createdBy'] = this.userInfo.firstName;
    } else {
      updateObject['modifiedBy'] = this.userInfo.firstName;
    }
    console.log('updateObj', updateObject);
    this.authService.updateRolesInfo(updateObject).subscribe(
      (res) => {
        Swal.fire({
          title: "Role Saved",
          icon: "success",
          confirmButtonText: "Ok",
        }).then((res) => {
          if (res.value === true) {
            this.canceledit();
            this.router.navigate(['/apps/contacts'])
          }
        });
      },
      (error) => {
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

  canceledit() {
    this.router.navigate(["/apps/contacts"]);
  }
  addAllScreenMapping() {
    this.todo = [];
    this.done = [];
    this.done = Screens;
  }
  removeAllScreenMapping() {
    this.todo = [];
    this.done = [];
    this.todo = Screens;
  }

}

interface Item {
  name: string;
  selected: boolean;
}
