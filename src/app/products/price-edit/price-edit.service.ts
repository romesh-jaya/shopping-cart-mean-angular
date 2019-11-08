import { OnInit } from "@angular/core";
import { Subject } from "rxjs";
import { Product } from "../../shared/product.model";

export class PriceEditService implements OnInit {
    editPrice = new Subject<Product>();

    constructor() {

    }

    ngOnInit() {

    }

}