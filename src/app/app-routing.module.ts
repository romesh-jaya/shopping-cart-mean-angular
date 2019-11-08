import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { PriceEditComponent } from './products/price-edit/price-edit.component';
import { ManageProductComponent } from './products/manage-product/manage-product.component';
import { ScCanDeactivate } from './shopping-cart/sc-can-deactivate.service';
import { PriceOverviewComponent } from './products/price-overview/price-overview.component';
import { AuthGuard } from './auth/auth.guard';
import { AdminGuard } from './auth/admin.guard';
import { ConfiguredUsersComponent } from './configured-users/configured-users.component';
import { SuperUserGuard } from './auth/super-user.guard';
import { NoAccessComponent } from './auth/no-access/no-access.component';
import { ChangePasswordComponent } from './auth/change-password/change-password.component';



const appRoutes: Routes = [
  { path: '', component: LandingPageComponent, pathMatch: 'full' },
  { path: 'shopping-cart', component: ShoppingCartComponent, canDeactivate: [ScCanDeactivate], canActivate: [AuthGuard] },
  { path: 'price-edit', component: PriceEditComponent, canActivate: [AdminGuard] },
  { path: 'price-edit/:name', component: PriceEditComponent, canActivate: [AdminGuard] },
  { path: 'manage-product', component: ManageProductComponent, canActivate: [AdminGuard] },
  { path: 'price-overview', component: PriceOverviewComponent, canActivate: [AdminGuard] },
  { path: 'users', component: ConfiguredUsersComponent, canActivate: [SuperUserGuard] },
  { path: 'change-password', component: ChangePasswordComponent, canActivate: [AuthGuard] },
  { path: 'no-access', component: NoAccessComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
