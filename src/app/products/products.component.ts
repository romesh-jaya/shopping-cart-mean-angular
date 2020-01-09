import { Component, OnInit } from '@angular/core';
import { faSearch, faDownload } from '@fortawesome/free-solid-svg-icons';


import { Product } from '../shared/product.model';
import { ProductService } from './product.service';
import { ErrorDialog } from '../shared/error-dialog/error-dialog';
import { MatDialog, PageEvent } from '@angular/material';
import { UtilityService } from 'src/app/shared/utility.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  alert: string;
  searchString = '';
  alertClass = '';
  showSpinner = false;
  searchedAtLeastOnce = false;
  faSearch = faSearch;
  faDownload = faDownload;
  queryUsing: string;
  pagesize: number;
  rowCount: number;
  lastWasQuery = false;
  pageIndex: number;

  constructor(private pService: ProductService, public dialog: MatDialog, private utilityService: UtilityService) { }

  ngOnInit() {
    this.queryUsing = "1";
    this.pagesize = environment.productsPerPage;
  }

  onSearchClicked() {
    this.lastWasQuery = true;
    this.refreshProducts(true);
  }

  onPopulateClicked() {
    this.lastWasQuery = false;
    this.refreshProducts(false);
  }

  onChangedPage(pageData: PageEvent) {
    this.refreshProducts(this.lastWasQuery, pageData.pageIndex);
  }

  refreshProducts(isQuery: boolean, pageNo?: number) {

    if (isQuery) {
      if (this.queryUsing === "1") {//barcode case
        if (isNaN(+this.searchString)) {
          this.dialog.open(ErrorDialog, {
            data: {
              message: 'When querying using barcode, search query must be a number value'
            }, panelClass: 'custom-modalbox'
          });
          return;
        }
      }
      else {//name case
        const charsToCheck = ['(', ')'];
        const searchString2 = this.searchString;

        if (charsToCheck.some(function (v) {
          return searchString2.indexOf(v) >= 0;
        })) {
          // There's at least one
          this.dialog.open(ErrorDialog, {
            data: {
              message: 'Search query cannot contain the following characters: ' + charsToCheck.toString()
            }, panelClass: 'custom-modalbox'
          });
          return;
        }
      }

      if (this.searchString.length < 3) {
        this.dialog.open(ErrorDialog, {
          data: {
            message: 'Search query must contain at least 3 characters'
          }, panelClass: 'custom-modalbox'
        });
        return;
      }
    }

    this.showSpinner = true;
    this.pageIndex = pageNo ? pageNo : 0;
    this.pService.getProductsForQuery(this.pageIndex, isQuery ? this.searchString : null,
      isQuery && this.queryUsing === "2" ? true : false).subscribe(results => {
        this.products = results.products;
        this.rowCount = results.rowCount;
        this.showSpinner = false;
        this.searchedAtLeastOnce = true;
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
