import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { Product } from '../../shared/product.model';
import { Router } from '@angular/router';
import { ErrorDialog } from '../../shared/error-dialog/error-dialog';
import { MatDialog } from '@angular/material';
import { UtilityService } from 'src/app/shared/utility.service';

export interface PriceData {
  lineNo: number;
  product: string;
  price1: number;
  price2: number;
}

@Component({
  selector: 'app-price-overview',
  templateUrl: './price-overview.component.html',
  styleUrls: ['./price-overview.component.css']
})
export class PriceOverviewComponent implements OnInit {
  products: Product[] = [];
  showSpinner = false;
  priceData: PriceData[] = [];
  displayedColumns: string[] = ['lineNo', 'product', 'price1', 'price2', 'edit'];
  dataSource;

  constructor(private pService: ProductService, private router: Router, public dialog: MatDialog, private utilityService: UtilityService) { }

  ngOnInit() {
    this.refreshProducts();
  }

  refreshProducts() {
    this.showSpinner = true;
    this.pService.getProducts().subscribe(productsFetched => {
      this.products = productsFetched;
      this.showSpinner = false;

      let index = 1;
      this.products.forEach(product => {
        this.priceData.push(
          { lineNo: index, product: product.name, price1: product.unitPrice[0], price2: product.unitPrice[1] });
        index++;
      });
      this.dataSource = this.priceData;
    },
      error => {
        this.showSpinner = false;
        this.dialog.open(ErrorDialog, {
          data: {
            message: "Error while fetching Products from server: " +
              this.utilityService.getError(error)
          }, panelClass: 'custom-modalbox'

        });
      });

  }

  onEditClicked(productName: string) {
    this.router.navigate(['/price-edit', productName]);
  }

}
