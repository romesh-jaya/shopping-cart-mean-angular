import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { By } from '@angular/platform-browser';
import { LandingPageComponent } from './landing-page.component';
import { SpinnerComponent } from '../shared/spinner/spinner.component';
import { UtilityService } from '../shared/utility.service';
import { LoggedInDataService } from '../auth/logged-in-data.service';
import { AuthService } from '../auth/auth.service';
import { MatDialogModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

describe('CalculatorComponent', () => {
    let component: LandingPageComponent;
    let fixture: ComponentFixture<LandingPageComponent>;
    let el: HTMLElement;
    const appRoutes: Routes = [];

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                LandingPageComponent,
                SpinnerComponent
            ],
            imports: [
                FormsModule,
                MatDialogModule,
                HttpClientModule,
                RouterModule.forRoot(appRoutes)
            ],
            providers: [
                AuthService,
                LoggedInDataService,
                UtilityService,
                CookieService
            ]
        })
            .compileComponents();
    }));


    beforeEach(() => {
        fixture = TestBed.createComponent(LandingPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('Form should not be submitted if invalid email was entered', async(() => {

        fixture.whenStable().then(() => {
            spyOn(component, 'onSubmit');
            const hostElement = fixture.nativeElement;
            const emailInput: HTMLInputElement = hostElement.querySelector('#email');
            const passwordInput: HTMLInputElement = hostElement.querySelector('#password');

            emailInput.value = "abc@ab.";//invalid email
            emailInput.dispatchEvent(new Event('input'));

            passwordInput.value = "abc@ab.com";
            passwordInput.dispatchEvent(new Event('input'));

            fixture.detectChanges();

            el = fixture.debugElement.query(By.css('#btnSubmit')).nativeElement;
            el.click();

            expect(component.onSubmit).toHaveBeenCalledTimes(0);
        });
    }));


});
