import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';

export interface CanComponentDeactivate {
    canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

export class ScCanDeactivate implements CanDeactivate<CanComponentDeactivate> {

    canDeactivate(component: CanComponentDeactivate): Observable<boolean> | Promise<boolean> | boolean {
        return component.canDeactivate();
    }
}
