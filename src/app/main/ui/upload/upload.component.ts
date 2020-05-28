import { Component, OnInit, Inject } from '@angular/core';
// import { UploadComponent } from './upload/upload.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
  dialogRef: any;
 /**
     * Constructor
     *
     * @param {MatDialogRef<uploadComponent>} matDialogRef
     * @param _data
     * @param {MatDialog} _matDialog
     */
  constructor(
    public matDialogRef: MatDialogRef<UploadComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any
  ) { }

  ngOnInit(): void {
  }

}
