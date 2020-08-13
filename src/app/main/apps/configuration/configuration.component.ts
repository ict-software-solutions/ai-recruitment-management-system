import { Component, OnInit, ViewChild, Inject } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import Swal from "sweetalert2";
import { AirmsService } from "app/service/airms.service";
import { LOG_MESSAGES, LOG_LEVELS } from "app/util/constants";
import { LogService } from "app/service/shared/log.service";
import { AuthService } from "app/service/auth.service";
import { Subscription } from "rxjs";
import { FormGroup, FormBuilder } from "@angular/forms";
export interface DialogData {}
export interface Element {
  name: string;
  screenUsed: string;
  function: string;
  value: string;
  action: string;
}
const ELEMENT_DATA: Element[] = [
  { name: "Captcha", screenUsed: "Login", function: "Count", value: "2", action: "" },
  { name: "Password Attempts", screenUsed: "Login", function: "Count", value: "5", action: "" },
  { name: "Set Timeout", screenUsed: "Login", function: "Count", value: "2", action: "" },
];
@Component({
  selector: "app-configuration",
  templateUrl: "./configuration.component.html",
  styleUrls: ["./configuration.component.scss"],
})
export class ConfigurationComponent implements OnInit {
  displayedColumns: string[] = ["name", "screenUsed", "function", "value", "action"];
  dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);
  showReset = false;
  roleName: string;
  isLoading = true;
  configData: any;
  configSubscription: Subscription;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(
    public dialog: MatDialog,
    private airmsService: AirmsService,
    private logService: LogService,
    private authService: AuthService
  ) {
    this.roleName = airmsService.getUserRole();
    this.logUserActivity("Config Management", LOG_MESSAGES.CLICK);
    if (this.roleName !== "Admin") {
      this.displayedColumns = ["name", "screenUsed", "function", "value"];
    }
    this.getConfigInfo();
  }
  getConfigInfo() {
    let data = [];
    this.configSubscription = this.authService.getConfig().subscribe(
      (res: any) => {
        data = [
          { name: "Captcha", screenUsed: "Login", function: "Count", value: res.showCaptchaAfter },
          { name: "Password Attempts", screenUsed: "Login", function: "Count", value: res.lockAccountAfter },
          { name: "Set Timeout", screenUsed: "Login", function: "Count", value: res.sessionTimeoutMins },
        ];
        this.configData = data;
        this.dataSource.data = data;
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        this.logService.logError(LOG_LEVELS.ERROR, "Configuration - List", "On Fetching roles", JSON.stringify(error));
      }
    );
  }

  openDialog(element, type): void {
    this.logUserActivity("Config Management -" + type, LOG_MESSAGES.CLICK);
    if (element === undefined) {
      element = {};
    }
    element.type = type;
    element.configData = this.configData;
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: "300px",
      data: element,
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getConfigInfo();
    });
  }
  ngOnInit(): void {}
  logUserActivity(from, value) {
    this.logService.logUserActivity(LOG_LEVELS.INFO, from, value);
  }
}
@Component({
  selector: "dialog-overview-example-dialog",
  templateUrl: "dialog-overview-example-dialog.html",
})
export class DialogOverviewExampleDialog {
  showDialogData = false;
  displayData: any;
  updateSubscription: Subscription;
  resetSubscription: Subscription;
  submitSubscription: Subscription;
  resetAllSubscription: Subscription;
  configForm: FormGroup;
  hide = true;
  token;
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    private authService: AuthService,
    private airmsService: AirmsService,
    private formBuilder: FormBuilder,
    private logService: LogService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.displayData = data;
    this.token = this.airmsService.getToken();
  }
  ngOnInit() {
    this.configForm = this.formBuilder.group({
      userName: [""],
      password: [""],
      count: [""],
      type: [""],
      viewType: [this.displayData.type],
    });
  }
  cancel(): void {
    this.dialogRef.close();
    this.configForm.reset();
  }
  submit(value) {
    let userName = this.airmsService.getUserName();
    if (value.viewType === "edit") {
      this.configForm.controls["userName"].patchValue(userName);
      value.userName = userName;
      this.validateUser(value);
    } else if (value.viewType === "renew" || value.viewType === "resetall") {
      let name = value.userName;
      let newValue = name.toLowerCase();
      if (newValue !== userName) {
        Swal.fire({
          position: "center",
          icon: "warning",
          title: "UserName is invalid",
          showConfirmButton: true,
        });
      } else {
        this.validateUser(value);
      }
    }
  }
  validateUser(value) {
    this.logUserActivity("Config Management - Validate User", LOG_MESSAGES.CLICK);
    this.submitSubscription = this.authService.getConfigLogin(value, this.token).subscribe(
      (res) => {
        if (res === true) {
          if (value.viewType === "edit") {
            this.showDialogData = true;
          } else {
            value.viewType = "all";
            this.resetConfig(value);
          }
        } else {
          Swal.fire({
            position: "center",
            icon: "warning",
            title: "Invalid Credentials",
            showConfirmButton: true,
          });
        }
      },
      (error) => {
        Swal.fire({
          position: "center",
          icon: "warning",
          title: "Invalid Credentials",
          showConfirmButton: true,
        });
      }
    );
  }
  save(value): void {
    value.type =
      this.displayData.name === "Captcha"
        ? "showCaptcha"
        : this.displayData.name === "Password Attempts"
        ? "lockAccount"
        : "sessionTimeout";
    if (value.viewType === "edit") {
      this.updateConfig(value);
    } else {
      this.resetConfig(value);
    }
  }

  updateConfig(value) {
    this.logUserActivity("Config Management - Edit Save", LOG_MESSAGES.CLICK);
    let param = {
      type: value.type,
      count: value.count,
    };
    this.updateSubscription = this.authService.updateConfig(param, this.token).subscribe((res) => {
      if (res) {
        if (this.displayData.configData[0].value !== param.count) {
          this.logService.logFieldHistory(
            LOG_LEVELS.INFO,
            "On Updating Captcha",
            "Config Management",
            "ShowCaptchaAfter",
            this.displayData.configData[0].value,
            param.count
          );
        }
        if (this.displayData.configData[1].value !== param.count) {
          this.logService.logFieldHistory(
            LOG_LEVELS.INFO,
            "On Updating Password Attempts",
            "Config Management",
            "LockAccountAfter",
            this.displayData.configData[1].value,
            param.count
          );
        }
        if (this.displayData.configData[2].value !== param.count) {
          this.logService.logFieldHistory(
            LOG_LEVELS.INFO,
            "On Updating Session Timeout",
            "Config Management",
            "SessionTimeoutMins",
            this.displayData.configData[2].value,
            param.count
          );
        }
        this.successConfig();
      }
    });
  }

  successConfig() {
    this.dialogRef.close();
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Saved",
      showConfirmButton: false,
      timer: 1500,
    });
  }
  resetConfig(value) {
    this.logUserActivity("Config Management - Reset", LOG_MESSAGES.CLICK);
    let object = {};
    if (value.viewType === "renew") {
      object = {
        type: value.type,
        count: value.count,
      };
    } else {
      object = {
        type: value.viewType,
      };
    }
    this.resetSubscription = this.authService.resetConfig(object, this.token).subscribe((res: any) => {
      if (res) {
        if (value.viewType === "renew") {
          if (this.displayData.configData[0].value !== Number(res.showCaptchaAfter)) {
            this.logService.logFieldHistory(
              LOG_LEVELS.INFO,
              "On Resetting Captcha",
              "Config Management",
              "ShowCaptchaAfter",
              this.displayData.configData[0].value,
              res.showCaptchaAfter
            );
          }
          if (this.displayData.configData[1].value !== Number(res.lockAccountAfter)) {
            this.logService.logFieldHistory(
              LOG_LEVELS.INFO,
              "On Resetting Password Attempts",
              "Config Management",
              "LockAccountAfter",
              this.displayData.configData[1].value,
              res.lockAccountAfter
            );
          }
          if (this.displayData.configData[2].value !== Number(res.sessionTimeoutMins)) {
            this.logService.logFieldHistory(
              LOG_LEVELS.INFO,
              "On Resetting Session Timeout",
              "Config Management",
              "SessionTimeoutMins",
              this.displayData.configData[2].value,
              res.sessionTimeoutMins
            );
          }
        } else {
          this.logService.logFieldHistory(
            LOG_LEVELS.INFO,
            "On Resetting Captcha",
            "Config Management",
            "ShowCaptchaAfter",
            this.displayData.configData[0].value,
            res.showCaptchaAfter
          );
          this.logService.logFieldHistory(
            LOG_LEVELS.INFO,
            "On Resetting Password Attempts",
            "Config Management",
            "LockAccountAfter",
            this.displayData.configData[1].value,
            res.lockAccountAfter
          );
          this.logService.logFieldHistory(
            LOG_LEVELS.INFO,
            "On Resetting Session Timeout",
            "Config Management",
            "SessionTimeoutMins",
            this.displayData.configData[2].value,
            res.sessionTimeoutMins
          );
        }
        this.successConfig();
      }
    });
  }

  changedValues() {
    this.dialogRef.close();
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Your Changes has been saved",
      showConfirmButton: false,
      timer: 1500,
    });
  }
  logUserActivity(from, value) {
    this.logService.logUserActivity(LOG_LEVELS.INFO, from, value);
  }
}
