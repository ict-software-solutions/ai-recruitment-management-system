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
  totScreens = [
    {
      title: "Dashboard",
      icon: "dashboard",
    },
    {
      title: "Profile",
      icon: "edit",
    },
    {
      title: "User Management",
      icon: "person",
    },
    {
      title: "Role Management",
      icon: "edit",
    },
    {
      title: "System Activities",
      icon: "desktop_mac",
    },
    {
      title: "Configuration",
      icon: "settings",
    },
  ];
  todo = [];
  done = [];

  screens = ["dashboard", "Calander", "User Management", "Edit Profile"];
  status = [
    { value: "Activated" },
    { value: "Locked" },
  ]
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

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
  ) {
    this.todo = this.totScreens;
    const _data = this.route.snapshot.params;
    this.action = _data.action;
    if (this.action === "edit") {
      this.dialogTitle = "Edit Role";
      this.contact = _data.contact;

    } else {
      this.dialogTitle = "New Role";
      this.contact = new Contact({});
      this.newRole = false;
    }
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
      screen: [""]
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
    });
  }
  updateRole(value) {
    this.errorMessage = '';
    this.message = '';
    let updateObject = {
      roleName: value.roleName,
      roleDescription: value.roleDescription,
      active: value.active,
      roleId: this.roleId
    };
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
  select(value: any) {
    this.items.push(value);
  }

  unselect(item: any) {
    this.screens.push(item);
    item.selected = true;
    if (this.selectedItems.length === this.screens.length) {
      this.compareResult();
    }
  }
  addScreen() {
    this.todo = [];
    this.done = [];
    this.done = this.totScreens;
  }
  removeScreen() {
    this.todo = [];
    this.done = [];
    this.todo = this.totScreens;
  }

  shuffleArray(arr) {
    for (let c = arr.length - 1; c > 0; c--) {
      let b = Math.floor(Math.random() * (c + 1));
      let a = arr[c];
      arr[c] = arr[b];
      arr[b] = a;
    }
    return arr;
  }
  compareResult() {
    if (this.selectedItems.map((x) => x.name).toString() === this.screens.toString()) {
      alert("They are in the same order");
    } else {
      alert("They have different order");
    }
  }

  selectdashboard() {
    this.selectdash = !this.selectdash;
    this.toggle1 = !this.toggle1;
  }
  selectcalander() {
    this.selectcal = !this.selectcal;
    this.toggle2 = !this.toggle2;
  }
  selectProfile() {
    this.selectpro = !this.selectpro;
    this.toggle3 = !this.toggle3;
  }
  userManagement() {
    this.selectuser = !this.selectuser;
    this.toggle4 = !this.toggle4;
  }
  rolemanagement() {
    this.selectrole = !this.selectrole;
    this.toggle5 = !this.toggle5;
  }
}

interface Item {
  name: string;
  selected: boolean;
}
