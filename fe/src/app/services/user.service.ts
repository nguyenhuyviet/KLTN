import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ServiceResponse } from '../models/service-response';



@Injectable({ providedIn: 'root' })
export class UserService {

    private host = 'https://localhost:44372';  // URL to web api

    private processUrl = `${this.host}/api/user`;  // URL to web api

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    constructor(
        private http: HttpClient,) { }

    
    //#region user in step
    getInStepSetting(paging) {
        return this.http.post<ServiceResponse>(`${this.processUrl}/GetInStepSetting`, paging, this.httpOptions)
            .pipe(
                catchError(this.handleError<ServiceResponse>('', null))
            );
    }

    getGroupInStepSetting(paging) {
        return this.http.post<ServiceResponse>(`${this.processUrl}/GetGroupInStepSetting`, paging, this.httpOptions)
            .pipe(
                catchError(this.handleError<ServiceResponse>('', null))
            );
    }

    //#endregion
    /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {


            console.error(error); // log to console instead


            //   this.showToast(`${operation} failed: ${error.message}`);

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }

}
