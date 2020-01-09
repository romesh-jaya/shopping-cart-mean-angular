import { Component, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { ProductService } from '../../product.service';
import { NgForm } from '@angular/forms';
import { ManageProductService } from '../manage-product.service';
import { Product } from '../../../shared/product.model';
import { ErrorDialog } from '../../../shared/error-dialog/error-dialog';
import { MatDialog } from '@angular/material';
import { UtilityService } from 'src/app/shared/utility.service';

@Component({
  selector: 'app-manage-product-detail',
  templateUrl: './manage-product-detail.component.html',
  styleUrls: ['./manage-product-detail.component.css']
})
export class AddProductDetailComponent implements OnInit {
  @ViewChild('f', { static: false }) aPDForm: NgForm;
  editMode = false;
  productEdit: Product;
  productName = '';
  newPrice = '';
  alert: string;
  alertClass = '';
  barcode: number;
  showSpinner = false;

  constructor(private pService: ProductService, private aPService: ManageProductService,
    private renderer2: Renderer2, public dialog: MatDialog, private utilityService: UtilityService) { }

  ngOnInit() {
    this.aPService.editProduct.subscribe((productName) => {
      this.aPDForm.reset();
      this.getProduct(productName);
    });
  }

  getProduct(name: string) {
    this.showSpinner = true;
    this.pService.getProduct(name).subscribe(retProduct => {
      this.showSpinner = false;
      this.productEdit = retProduct;
      if (this.productEdit) {
        this.productName = retProduct.name;
        this.newPrice = '';
        this.barcode = retProduct.barcode;
        this.editMode = true;
        const firstElement = this.renderer2.selectRootElement('#barcode');
        firstElement.focus();
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

  customReset() {
    this.productName = '';
    this.newPrice = '';
    this.editMode = false;
    this.aPDForm.reset();
    const firstElement = this.renderer2.selectRootElement('#name');
    firstElement.focus();
  }

  onAddProduct() {
    this.customReset();
  }

  onDelete() {
    if (confirm('Are you sure you wish to delete this product?')) {
      this.pService.removeItem(this.productEdit.serverId).subscribe(() => {
        this.alert = 'Product removed!';
        this.alertClass = 'alert-success';
        setTimeout(() => {
          this.alert = ' ';
          this.alertClass = '';
        }, 2000
        );
        this.customReset();
      },
        error => {
          this.showSpinner = false;
          this.dialog.open(ErrorDialog, {
            data: {
              message: 'Error while removing Product from server: ' +
                this.utilityService.getError(error)
            }, panelClass: 'custom-modalbox'

          });
        });

    }
  }

  onAddEditProduct(form: NgForm) {
    const value = form.value;
    let newBarcode: number;
    let newProduct;

    if (!this.editMode) {
      // validations
      if (value.newPrice === null || value.newPrice === '') {
        this.dialog.open(ErrorDialog, {
          data: { message: 'Price is required when a new product is entered.' },
          panelClass: 'custom-modalbox'
        });
        return;
      }

      // Perform actual adding
      if (value.barcode != null) {
        newBarcode = +value.barcode;
      }

      newProduct = new Product(value.name, [+value.newPrice], newBarcode);
      this.showSpinner = true;

      this.pService.addItem(newProduct).subscribe(
        () => {
          this.alert = 'Product ' + value.name + ' added successfully!';
          this.alertClass = 'alert-success';
          setTimeout(() => {
            this.alert = ' ';
            this.alertClass = '';
          }, 2000
          );
          this.showSpinner = false;
          this.customReset();
        },
        error => {
          this.showSpinner = false;
          this.dialog.open(ErrorDialog, {
            data: { message: 'Error while saving: ' + this.utilityService.getError(error) },
            panelClass: 'custom-modalbox'
          });

        }
      );
      this.showSpinner = true;
    } else {// Product being  edited
      this.showSpinner = true;
      this.pService.editBarcode(this.productEdit, +value.barcode).subscribe(() => {
        this.alert = 'Product ' + this.productName + ' updated successfully!';
        this.alertClass = 'alert-success';
        setTimeout(() => {
          this.alert = ' ';
          this.alertClass = '';
        }, 2000
        );
        this.customReset();
        this.showSpinner = false;
      },
        error => {
          this.showSpinner = false;
          this.dialog.open(ErrorDialog, {
            data: { message: 'Error while updating Product: ' + error.message },
            panelClass: 'custom-modalbox'
          });
        });


    }
  }
}
