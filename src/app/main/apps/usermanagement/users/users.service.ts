import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class UserManagementService implements Resolve<any>
{
    products: any[];
    onProductsChanged: BehaviorSubject<any>;
    constructor(
        private _httpClient: HttpClient
    ) {
        this.onProductsChanged = new BehaviorSubject({});
    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        return new Promise((resolve, reject) => {
            Promise.all([
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }


}
