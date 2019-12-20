import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatDialog, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule } from '@angular/material';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { MatSortModule } from '@angular/material/sort';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CookieService } from 'ngx-cookie-service';

import { AppComponent } from './app.component';
import { ProductsComponent } from './products/products.component';
import { HeaderComponent } from './header/header.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { AppRoutingModule } from './app-routing.module';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LandingPageComponent } from './landing-page/landing-page.component';


import { InputDialog } from './products/input-dialog/input-dialog';
import { ErrorDialog } from './shared/error-dialog/error-dialog';
import { ProductComponent } from './products/product/product.component';
import { ShoppingCartItemComponent } from './shopping-cart/shopping-cart-item/shopping-cart-item.component';
import { PriceEditComponent } from './products/price-edit/price-edit.component';
import { PriceEditDetailComponent } from './products/price-edit/price-edit-detail/price-edit-detail.component';
import { ManageProductComponent } from './products/manage-product/manage-product.component';
import { ScCanDeactivate } from './shopping-cart/sc-can-deactivate.service';
import { AddProductDetailComponent } from './products/manage-product/manage-product-detail/manage-product-detail.component';
import { SpinnerComponent } from './shared/spinner/spinner.component';
import { PriceOverviewComponent } from './products/price-overview/price-overview.component';
import { EqualValidator } from './landing-page/equal-validator.directive';
import { ConfiguredUsersComponent } from './configured-users/configured-users.component';
import { NoAccessComponent } from './auth/no-access/no-access.component';

import { ShoppingCartService } from './shopping-cart/shopping-cart.service';
import { PriceEditService } from './products/price-edit/price-edit.service';
import { ProductService } from './products/product.service';
import { AuthService } from './auth/auth.service';
import { ManageProductService } from './products/manage-product/manage-product.service';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { LoggedInDataService } from './auth/logged-in-data.service';
import { ChangePasswordComponent } from './auth/change-password/change-password.component';

@NgModule({
  declarations: [
    AppComponent,
    ProductsComponent,
    ProductComponent,
    ShoppingCartItemComponent,
    HeaderComponent,
    ShoppingCartComponent,
    PageNotFoundComponent,
    LandingPageComponent,
    InputDialog,
    ErrorDialog,
    PriceEditComponent,
    PriceEditDetailComponent,
    ManageProductComponent,
    AddProductDetailComponent,
    SpinnerComponent,
    PriceOverviewComponent,
    EqualValidator,
    ConfiguredUsersComponent,
    NoAccessComponent,
    ChangePasswordComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatDialogModule,
    FormsModule,
    HttpClientModule,
    NgbAlertModule,
    NgbModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSortModule
  ],
  exports: [
    FormsModule,
  ],
  providers: [ShoppingCartService,
    MatDialog,
    PriceEditService,
    ProductService,
    ScCanDeactivate,
    ManageProductService,
    AuthService,
    CookieService,
    LoggedInDataService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }],
  bootstrap: [AppComponent],
  entryComponents: [InputDialog, ErrorDialog]
})
export class AppModule { }
