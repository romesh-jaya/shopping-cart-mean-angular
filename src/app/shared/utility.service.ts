import { Injectable } from "@angular/core";
import { environment } from '../../environments/environment';

@Injectable({ providedIn: "root" })
export class UtilityService {
    //Note: i couldn't perform this logic within an error-interceptor, as it interferes with the re-send logic of auth-interceptor
    constructor() { }

    getError(error: any) {
        if (!error.status || (error.status == 0)) {
            return "Error while connecting to Server. Please contact Administrator";
        }


        let errorMessage = error.message;

        if (error.error && error.error.message) {
            errorMessage = error.error.message;//error messages from server are nested errors.
        }
        return errorMessage;
    }

}