import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'app-error-dialog',
    templateUrl: './error-dialog.html',
    styleUrls: ['./error-dialog.css']
})


export class ErrorDialog {
    constructor(public dialogRef: MatDialogRef<ErrorDialog>,
        @Inject(MAT_DIALOG_DATA) public data: { message: string }) {

    }

}
