import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { PriceEditService } from '../price-edit.service';
import { ProductService } from '../../product.service';
import { NgForm } from '@angular/forms';
import { Product } from '../../../shared/product.model';
import { ErrorDialog } from '../../../shared/error-dialog/error-dialog';
import { MatDialog } from '@angular/material';
import { UtilityService } from 'src/app/shared/utility.service';

@Component({
  selector: 'app-price-edit-detail',
  templateUrl: './price-edit-detail.component.html',
  styleUrls: ['./price-edit-detail.component.css']
})
export class PriceEditDetailComponent implements OnInit {
  @ViewChild("f", { static: false }) pEForm: NgForm;
  @Input() productName = "";
  product: Product;
  updatedPrice: { price: number }[] = [];
  alert: string = " ";
  alertClass: string = "";
  showSpinner = false;

  constructor(private pEService: PriceEditService, private pService: ProductService, public dialog: MatDialog, private utilityService: UtilityService) { }

  ngOnInit() {
    this.pEService.editPrice.subscribe((product) => {
      this.pEForm.reset();
      this.productName = product.name;
      this.product = product;
      this.updatedPrice = [];
      product.unitPrice.forEach(price => {
        this.updatedPrice.push({ price: price });
      });
    }
    );
  }

  onUpdate(form: NgForm) {
    let returnPrices: number[] = [];

    this.updatedPrice.forEach(newPrice => {

      //remove duplicated
      if (returnPrices.find((returnPrice) => returnPrice === newPrice.price) === undefined) {
        returnPrices.push(+(newPrice.price).toFixed(2));
      }
      returnPrices.sort();
    });

    if (returnPrices.length == 0) {
      this.showSpinner = false;
      this.dialog.open(ErrorDialog, { data: { message: "Cannot remove all prices of a product." }, panelClass: 'custom-modalbox' });
      return;
    }
    this.showSpinner = true;
    this.pService.updatePrice(this.product, returnPrices).subscribe(retData => {
      this.alert = "Price updated successfully!";
      this.alertClass = "alert-success";
      setTimeout(() => {
        this.alert = " ";
        this.alertClass = "";
      }, 2000
      );
      this.productName = "";
      this.updatedPrice = [];
      this.showSpinner = false;
      form.reset();
      this.pService.productsRefreshed.next();
    },
      error => {
        this.showSpinner = false;
        this.dialog.open(ErrorDialog, { data: { message: "Error while updating prices: " + this.utilityService.getError(error) }, panelClass: 'custom-modalbox' });
      });

  }

  onRemovePrice(index: number, form: NgForm) {
    form.controls["rowsDeleted"].markAsDirty();
    this.updatedPrice.splice(index, 1);
  }

  onNewPrice() {
    this.updatedPrice.push({ price: null });
  }

}
