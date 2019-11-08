import { ShoppingCartItem } from "../shared/shopping-cart-item.model";
import { Subject } from "rxjs";

export class ShoppingCartService {
  cartItems: ShoppingCartItem[] = [];
  refreshCart = new Subject<{ name: string, price: number }>();
  cartItemDeleted = new Subject<number>();

  constructor() {
    this.cartItemDeleted.subscribe((index) => {
      this.removeItem(index);
    });
  }


  addItem(name: string, price: number, qty: number) {
    this.cartItems.push(
      new ShoppingCartItem(name, price, qty));

    this.refreshCart.next();
  }

  removeItem(index: number) {
    this.cartItems.splice(index, 1);
    this.refreshCart.next();
  }

  calculateTotal() {
    var total = 0;
    this.cartItems.forEach((item, index, arr) => {
      total += Number(item.price) * Number(item.qty);
    });
    return total.toFixed(2);
  }

  clearCart() {
    this.cartItems = [];
  }

  getItems() {
    return this.cartItems.slice();
  }

}
