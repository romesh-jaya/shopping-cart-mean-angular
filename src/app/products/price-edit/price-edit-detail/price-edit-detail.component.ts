import { Component, OnInit, ViewChild } from '@angular/core';
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
  @ViewChild('f', { static: false }) pEForm: NgForm;
  product: Product;
  updatedPrice: { price: number }[] = [];
  alert = ' ';
  alertClass = '';
  showSpinner = false;

  constructor(private pEService: PriceEditService, private pService: ProductService,
    public dialog: MatDialog, private utilityService: UtilityService) { }

  ngOnInit() {
    this.pEService.editPrice.subscribe((productName) => {
      this.pEForm.reset();
      this.getProduct(productName);

    });
  }

  getProduct(name: string) {
    this.showSpinner = true;
    this.pService.getProduct(name).subscribe(retProduct => {
      this.showSpinner = false;
      this.product = retProduct;
      if (this.product) {
        this.updatedPrice = [];
        this.product.unitPrice.forEach(price => {
          this.updatedPrice.push({ price });
        });
      }
    },
      error => {
        this.showSpinner = false;
        this.dialog.open(ErrorDialog, {
          data: {
            message: 'Error while fetching Product from server: ' +
              this.utilityService.getError(error)
          }, panelClass: 'custom-modalbox'

        });
      });
  }

  onUpdate(form: NgForm) {
    const returnPrices: number[] = [];

    this.updatedPrice.forEach(newPrice => {

      // remove duplicated
      if (returnPrices.find((returnPrice) => returnPrice === newPrice.price) === undefined) {
        returnPrices.push(+(newPrice.price).toFixed(2));
      }
      returnPrices.sort();
    });

    if (returnPrices.length == 0) {
      this.showSpinner = false;
      this.dialog.open(ErrorDialog, { data: { message: 'Cannot remove all prices of a product.' }, panelClass: 'custom-modalbox' });
      return;
    }
    this.showSpinner = true;
    this.pService.updatePrice(this.product, returnPrices).subscribe(() => {
      this.alert = 'Price updated successfully!';
      this.alertClass = 'alert-success';
      setTimeout(() => {
        this.alert = ' ';
        this.alertClass = '';
      }, 2000
      );
      this.updatedPrice = [];
      this.showSpinner = false;
      form.reset();
    },
      error => {
        this.showSpinner = false;
        this.dialog.open(ErrorDialog, { data: { message: 'Error while updating prices: ' + this.utilityService.getError(error) }, panelClass: 'custom-modalbox' });
      });

  }

  onRemovePrice(index: number, form: NgForm) {
    form.controls.rowsDeleted.markAsDirty();
    this.updatedPrice.splice(index, 1);
  }

  onNewPrice() {
    this.updatedPrice.push({ price: null });
  }

}
