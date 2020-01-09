import { Product } from '../shared/product.model';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import {
    HttpClient, HttpParams
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductService {
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
                patchData
            );
    }

    addItem(product: Product) {
        return this.http
            .post<Product>(
                this.baseURL,
                product
            );
    }


    editBarcode(product: Product, barcode: number) {
        const patchData = { ...product };
        (patchData as any).barcode = barcode;
        const uRL = this.baseURL + '/' + product.serverId;
        return this.http
            .patch(
                uRL,
                patchData
            );

    }

    removeItem(serverId: string) {
        const uRL = this.baseURL + '/' + serverId;
        return this.http
            .delete(
                uRL
            );
    }

    getProduct(name: string) {
        const uRL = this.baseURL + '/' + name;
        return this.http
            .get<any>(
                uRL
            ).pipe(
                map(product => {
                    return new Product(
                        (product.product as any).name,
                        (product.product as any).unitPrice,
                        (product.product as any).barcode,
                        (product.product as any)._id
                    );
                }
                )
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

    getProductsForQuery(currentPage: number, queryString?: string, queryForNameFlag?: boolean) {
        let params = new HttpParams();
        params = params.append('currentPage', currentPage.toString());
        params = params.append('pagesize', environment.productsPerPage.toString());

        if (queryString) {
            params = params.append('queryString', queryString);
        }
        if (queryForNameFlag) {
            params = params.append('queryForNameFlag', 'y');
        }

        return this.http
            .get<{ results: any[] }>(
                this.baseURL,
                { params: params }
            ).pipe(
                map(productData => {

                    if (productData.results[0].products.length > 0) {
                        return {
                            products: productData.results[0].products.map(product => {
                                return new Product(
                                    (product as any).name,
                                    (product as any).unitPrice,
                                    (product as any).barcode,
                                    (product as any)._id
                                );
                            }),
                            rowCount: productData.results[0].totalCount[0].count
                        };
                    }
                    else {
                        return { products: [], rowCount: 0 };
                    }
                })
            );
    }
}
