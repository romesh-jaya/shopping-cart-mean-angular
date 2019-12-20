import { Component, OnInit } from '@angular/core';
import { Product } from '../shared/product.model';
import { ProductService } from './product.service';
import { ErrorDialog } from '../shared/error-dialog/error-dialog';
import { MatDialog } from '@angular/material';
import { UtilityService } from 'src/app/shared/utility.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  alert: string;
  alertClass = '';
  showSpinner = false;

  constructor(private pService: ProductService, public dialog: MatDialog, private utilityService: UtilityService) { }

  ngOnInit() {
    this.refreshProducts();
    this.pService.productsRefreshed.subscribe(() => {
      this.refreshProducts();
    });
  }

  refreshProducts() {
    this.showSpinner = true;
    this.pService.getProducts().subscribe(productsFetched => {
      this.products = productsFetched;
      this.showSpinner = false;
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
