
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ServiceResponse } from '../models/service-response';



@Injectable({ providedIn: 'root' })
export class ProcessExecutionService {

    private host = 'https://localhost:44372';  // URL to web api

    private processUrl = `${this.host}/api/process`;  // URL to web api

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    constructor(
        private http: HttpClient,) { }

    initProcessExe(fieldData): Observable<ServiceResponse> {
        return this.http.post<ServiceResponse>(`${this.processUrl}/initProcessExe`, fieldData, this.httpOptions)
            .pipe(
                catchError(this.handleError<ServiceResponse>('', null))
            );
    }
    nextStep(fieldData): Observable<ServiceResponse> {
        return this.http.post<ServiceResponse>(`${this.processUrl}/nextStep`, fieldData, this.httpOptions)
            .pipe(
                catchError(this.handleError<ServiceResponse>('', null))
            );
    }
    refuseStep(fieldData): Observable<ServiceResponse> {
        return this.http.post<ServiceResponse>(`${this.processUrl}/rejectStep`, fieldData, this.httpOptions)
            .pipe(
                catchError(this.handleError<ServiceResponse>('', null))
            );
    }
    //#region 
    getProcessRelated(paging) {
        return this.http.post<ServiceResponse>(`${this.processUrl}/getProcessRelated`, paging, this.httpOptions)
            .pipe(
                catchError(this.handleError<ServiceResponse>('', null))
            );
    }
    getNeedMyApproval(paging) {
        return this.http.post<ServiceResponse>(`${this.processUrl}/getNeedMyApproval`, paging, this.httpOptions)
            .pipe(
                catchError(this.handleError<ServiceResponse>('', null))
            );
    }
    getStepExecution(processExeID) {
        return this.http.get<ServiceResponse>(`${this.processUrl}/getStepExecution/${processExeID}`)
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
