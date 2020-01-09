import { Component, Input } from '@angular/core';

import { Product } from '../../shared/product.model';
import { InputDialog } from '../input-dialog/input-dialog';
import { ErrorDialog } from '../../shared/error-dialog/error-dialog';
import { MatDialogRef, MatDialog } from '@angular/material';
import { ShoppingCartService } from '../../shopping-cart/shopping-cart.service';
import { ActivatedRoute } from '@angular/router';
import { PriceEditService } from '../price-edit/price-edit.service';
import { ManageProductService } from '../manage-product/manage-product.service';



@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent {
  @Input() productEl: Product;
  @Input() index: number;
  inputDialogRef: MatDialogRef<InputDialog>;

  constructor(public dialog: MatDialog, private sCService: ShoppingCartService,
    private route: ActivatedRoute, private pEService: PriceEditService,
    private aPService: ManageProductService) { }

  onItemClicked() {
    if (this.route.snapshot['_routerState'].url.includes('shopping-cart')) {
      this.inputDialogRef = this.dialog.open(InputDialog, {
        disableClose: false,
        width: '500px',
        data: { price: this.productEl.unitPrice }
      });

      this.inputDialogRef.afterClosed().subscribe(result => {
        if (result) {
          if (isNaN(+result.qty) || ((result.discount) && isNaN(+result.discount))) {
            this.dialog.open(ErrorDialog, {
              data: { message: 'Please enter valid quantity and discount.' },
              panelClass: 'custom-modalbox'
            });
            return;
          } else if ((result.discount) && ((+result.discount > 100) || (+result.discount < 0))) {
            this.dialog.open(ErrorDialog, { data: { message: 'Discount must be between 0 and 100.' }, panelClass: 'custom-modalbox' });
            return;
          }
          if (+result.qty <= 0) {
            this.dialog.open(ErrorDialog, { data: { message: 'Quantity must be greater than 0.' }, panelClass: 'custom-modalbox' });
            return;
          }
          const discountCalc = (result.discount == null) ? 0 : +result.discount;

          this.sCService.addItem(this.productEl.name, (result.selectedPrice * (1 - (discountCalc / 100))),
            +result.qty);
        }
        this.inputDialogRef = null;
      });

    } else if (this.route.snapshot['_routerState'].url.includes('price-edit')) {
      this.pEService.editPrice.next(this.productEl.name);
    } else if (this.route.snapshot['_routerState'].url.includes('manage-product')) {
      this.aPService.editProduct.next(this.productEl.name);
    }
  }
}

