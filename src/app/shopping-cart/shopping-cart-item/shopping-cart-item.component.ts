import { Component, Input } from '@angular/core';
import { ShoppingCartItem } from '../../shared/shopping-cart-item.model';
import { ShoppingCartService } from '../shopping-cart.service';

@Component({
  selector: 'app-shopping-cart-item',
  templateUrl: './shopping-cart-item.component.html',
  styleUrls: ['./shopping-cart-item.component.css']
})
export class ShoppingCartItemComponent {
  @Input() cartItem: ShoppingCartItem;
  @Input() index: number;


  constructor(private sCService: ShoppingCartService) { }

  onRemoveItem() {
    this.sCService.cartItemDeleted.next(this.index);
  }

}
