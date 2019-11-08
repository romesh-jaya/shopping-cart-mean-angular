import { Subject } from "rxjs";
import { Product } from "../../shared/product.model";

export class ManageProductService {
    editProduct = new Subject<Product>();

    constructor() {

    }

}