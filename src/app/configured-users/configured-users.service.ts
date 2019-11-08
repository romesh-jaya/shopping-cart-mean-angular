import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import {
    HttpClient,
} from '@angular/common/http';
import { Injectable } from "@angular/core";
import { ConfiguredUser } from "../shared/configured-users.model";
import { environment } from '../../environments/environment';

@Injectable({ providedIn: "root" })
export class ConfiguredUsersService {
    configUsers: ConfiguredUser[] = [];
    baseURL = environment.nodeEndPoint + '/users';
    errorOccured = false;

    constructor(private http: HttpClient) { }

    getUsers() {
        return this.http
            .get<Object[]
            >(
                this.baseURL
            ).pipe(
                map(userData => {
                    return userData.map(user => {
                        return new ConfiguredUser(
                            (user as any).email,
                            (user as any).isAdmin,
                            (user as any)._id
                        );
                    });
                }),
                catchError(errorRes => {
                    // Send to analytics server
                    return throwError(errorRes);
                })
            );
    }

    updateAdmin(serverId: string, isAdmin: boolean) {
        let patchData = { isAdmin: isAdmin };
        var uRL = this.baseURL + "/" + serverId;
        return this.http
            .patch(
                uRL,
                patchData,
                {
                    observe: 'response'
                }
            );
    }

    removeUser(serverId: string) {
        var uRL = this.baseURL + "/" + serverId;
        return this.http
            .delete(
                uRL
            );
    }

}