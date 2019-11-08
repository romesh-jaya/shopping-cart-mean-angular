import { Component, OnInit } from '@angular/core';
import { ShoppingCartItem } from '../shared/shopping-cart-item.model';
import { ShoppingCartService } from './shopping-cart.service';
import { ScCanDeactivate } from './sc-can-deactivate.service';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css'
  ]
})
export class ShoppingCartComponent implements OnInit, ScCanDeactivate {
  cartItems: ShoppingCartItem[] = [];
  isClearCartdisabled: boolean = false;
  alert: string = " ";
  alertClass: string = "";

  constructor(private sCService: ShoppingCartService) { };

  ngOnInit() {
    this.refreshCart();
    this.sCService.refreshCart.subscribe(() => {
      this.refreshCart();
    });
  }

  onEnteredNewPrice(priceData: { name: string, newPrice: number }) {
    this.refreshCart();
  }

  calculateTotal() {
    return this.sCService.calculateTotal();
  }

  onClearCart() {
    this.sCService.clearCart();
    this.refreshCart();
  }

  checkClearCartDisabled() {
    this.isClearCartdisabled = this.isShoppingCartEmpty();
  }

  isShoppingCartEmpty() {
    return (this.sCService.getItems().length > 0 ? false : true);
  }

  refreshCart() {
    this.cartItems = this.sCService.getItems();
    this.checkClearCartDisabled();
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.isShoppingCartEmpty()) {
      return true;
    }

    if (confirm('Do you want to discard the changes to the Shopping Cart?')) {
      this.sCService.clearCart();
      return true;
    };
    return false;
  }


}
