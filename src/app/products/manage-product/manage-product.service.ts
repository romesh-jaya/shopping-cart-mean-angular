import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Product } from '../../shared/product.model';

@Injectable({ providedIn: 'root' })
export class ManageProductService {
    editProduct = new Subject<Product>();

}
