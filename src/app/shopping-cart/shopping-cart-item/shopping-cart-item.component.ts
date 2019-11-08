import { Component, OnInit, Input } from '@angular/core';
import { ShoppingCartItem } from '../../shared/shopping-cart-item.model';
import { ShoppingCartService } from '../shopping-cart.service';

@Component({
  selector: 'app-shopping-cart-item',
  templateUrl: './shopping-cart-item.component.html',
  styleUrls: ['./shopping-cart-item.component.css']
})
export class ShoppingCartItemComponent implements OnInit {
  @Input() cartItem: ShoppingCartItem;
  @Input() index: number;


  constructor(private sCService: ShoppingCartService) { }

  ngOnInit() {
  }

  onRemoveItem() {
    this.sCService.cartItemDeleted.next(this.index);
  }

}
