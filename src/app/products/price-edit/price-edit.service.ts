import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Product } from '../../shared/product.model';

@Injectable({ providedIn: 'root' })
export class PriceEditService {
    editPrice = new Subject<Product>();


}
