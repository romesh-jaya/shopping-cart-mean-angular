import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import {
    HttpClient
} from '@angular/common/http';
import { MatDialog } from '@angular/material';
import { UtilityService } from 'src/app/shared/utility.service';

import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { ProductsComponent } from './products.component';
import { ProductService } from './product.service';
import { Product } from '../shared/product.model';
import { Observable } from 'rxjs/internal/Observable';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { ProductComponent } from './product/product.component';
import { SpinnerComponent } from '../shared/spinner/spinner.component';

describe('ProductsComponent', () => {
    let component: ProductsComponent;
    let fixture: ComponentFixture<ProductsComponent>;
    let el: HTMLElement;
    let service: ProductService;
    let spy: any;
    let http: HttpClient;
    let matDialog: MatDialog;
    let utilityService: UtilityService;
    let productsSample: Product[];

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ProductsComponent,
                ProductComponent,
                SpinnerComponent
            ],
            imports: [
                FormsModule,
                NgbAlertModule
            ],
            providers: [
                ProductService]
        })
            .compileComponents();
    }));

    /*
    beforeEach(() => {

    });*/

    afterEach(() => {
        service = null;
        component = null;
        spy = null;
        productsSample = null;
    });

    it('ProductsComponent should have one Product returned by default', () => {
        service = new ProductService(http);
        productsSample = [new Product('Test Product 1', [10])];
        spy = spyOn(service, 'getProducts').and.returnValue(of(productsSample));

        component = new ProductsComponent(service, matDialog, utilityService);
        component.ngOnInit();

        expect(component.products.length).toBe(1);
    });



});
