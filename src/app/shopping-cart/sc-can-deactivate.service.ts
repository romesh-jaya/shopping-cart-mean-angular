import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';

export interface CanComponentDeactivate {
    canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

export class ScCanDeactivate implements CanDeactivate<CanComponentDeactivate> {

    canDeactivate(component: CanComponentDeactivate,
        currentRoute: ActivatedRouteSnapshot,
        currentState: RouterStateSnapshot,
        nextState?: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        return component.canDeactivate();
    }
}