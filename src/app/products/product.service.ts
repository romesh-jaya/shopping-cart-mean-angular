import { Product } from '../shared/product.model';
import { map, catchError } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';
import {
    HttpClient
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductService {
    productsRefreshed = new Subject();
    baseURL = environment.nodeEndPoint + '/products';
    errorOccured = false;

    constructor(private http: HttpClient) { }

    updatePrice(product: Product, prices: number[]) {
        const patchData = { ...product };
        (patchData as any).unitPrice = prices;
        const uRL = this.baseURL + '/' + product.serverId;
        return this.http
            .patch(
                uRL,
                patchData,
                {
                    observe: 'response'
                }
            );
    }

    addItem(product: Product) {
        return this.http
            .post<Product>(
                this.baseURL,
                product,
                {
                    observe: 'response'
                }
            );
    }


    editBarcode(product: Product, barcode: number) {
        const patchData = { ...product };
        (patchData as any).barcode = barcode;
        const uRL = this.baseURL + '/' + product.serverId;
        return this.http
            .patch(
                uRL,
                patchData,
                {
                    observe: 'response'
                }
            );

    }

    removeItem(serverId: string) {
        const uRL = this.baseURL + '/' + serverId;
        return this.http
            .delete(
                uRL
            );
    }

    getProducts() {
        return this.http
            .get<object[]
            >(
                this.baseURL
            ).pipe(
                map(productData => {
                    return productData.map(product => {
                        return new Product(
                            (product as any).name,
                            (product as any).unitPrice,
                            (product as any).barcode,
                            (product as any)._id
                        );
                    });
                }),
                catchError(errorRes => {
                    // Send to analytics server
                    return throwError(errorRes);
                })
            );

    }


}
