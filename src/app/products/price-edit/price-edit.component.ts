import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { PriceEditService } from './price-edit.service';
import { ProductService } from '../product.service';
import { ErrorDialog } from '../../shared/error-dialog/error-dialog';
import { MatDialog } from '@angular/material';
import { UtilityService } from 'src/app/shared/utility.service';

@Component({
  selector: 'app-price-edit',
  templateUrl: './price-edit.component.html',
  styleUrls: ['./price-edit.component.css']
})
export class PriceEditComponent implements OnInit {
  productName: string;
  showSpinner = false;

  constructor(private route: ActivatedRoute, private pEService: PriceEditService,
    private pService: ProductService, public dialog: MatDialog, private utilityService: UtilityService) { }

  ngOnInit() {
    this.productName = this.route.snapshot.params.name;
    this.setDataForEdit();
    this.route.params.subscribe((params: Params) => {
      this.productName = params.name;
      this.setDataForEdit();
    });
  }

  setDataForEdit() {

    if (this.productName) {
      let products;
      this.showSpinner = true;
      this.pService.getProducts().subscribe(productsFetched => {
        products = productsFetched;
        this.showSpinner = false;

        let retProduct;
        products.forEach(product => {
          if (product.name === this.productName) {
            retProduct = product;
          }
        });

        this.pEService.editPrice.next(retProduct);
      },
        error => {
          this.showSpinner = false;
          this.dialog.open(ErrorDialog, {
            data: {
              message: 'Error while fetching Products from server: ' +
                this.utilityService.getError(error)
            }, panelClass: 'custom-modalbox'

          });
        });
    }
  }




}
