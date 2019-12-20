import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'app-input-dialog',
    templateUrl: './input-dialog.html',
    styleUrls: ['./input-dialog.css']
})


export class InputDialog {
    constructor(public dialogRef: MatDialogRef<InputDialog>,
        @Inject(MAT_DIALOG_DATA) public data: { qty: string; discount: string; price: number[]; selectedPrice: number }) {
        data.selectedPrice = data.price[0];

    }

}
