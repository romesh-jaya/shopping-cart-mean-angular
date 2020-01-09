import { Component, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { PriceEditService } from './price-edit.service';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-price-edit',
  templateUrl: './price-edit.component.html',
  styleUrls: ['./price-edit.component.css']
})
export class PriceEditComponent implements AfterViewInit {
  productName: string;
  showSpinner = false;

  constructor(private route: ActivatedRoute, private pEService: PriceEditService,
    public dialog: MatDialog) { }

  //This is required to be ngAfterViewInit() and not ngOnInit().
  // Otherwise data doesn't display properly in the detail form
  ngAfterViewInit() {
    this.productName = this.route.snapshot.params.name;
    this.setDataForEdit();
    this.route.params.subscribe((params: Params) => {
      this.productName = params.name;
      this.setDataForEdit();
    });
  }

  setDataForEdit() {
    if (this.productName) {
      this.pEService.editPrice.next(this.productName);
    }
  }
}
