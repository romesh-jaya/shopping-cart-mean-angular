import { Subject } from 'rxjs';
import { Product } from '../../shared/product.model';

export class PriceEditService {
    editPrice = new Subject<Product>();


}
