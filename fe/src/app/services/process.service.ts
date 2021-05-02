import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ServiceResponse } from '../models/service-response';



@Injectable({ providedIn: 'root' })
export class ProcessService {

    private host = 'https://localhost:44372';  // URL to web api

    private processUrl = `${this.host}/api/process`;  // URL to web api

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    constructor(
        private http: HttpClient,) { }

    //#region  group
    /**
     * lấy về danh sách group
     * @returns 
     */
    getAllProcessGroup(): Observable<ServiceResponse> {
        return this.http.get<ServiceResponse>(`${this.processUrl}/getAllProcessGroup`)
            .pipe(
                catchError(this.handleError<ServiceResponse>('getHeroes', null))
            );
    }

    /**
     * lấy về danh sách group
     * @returns 
     */
    addProcessGroup(group): Observable<ServiceResponse> {
        return this.http.post<ServiceResponse>(`${this.processUrl}/addGroup`,group,this.httpOptions)
            .pipe(
                catchError(this.handleError<ServiceResponse>('', null))
            );
    }

    /**
     * lấy về danh sách group
     * @returns 
     */
     deleteProcessGroup(groupId): Observable<ServiceResponse> {
        return this.http.get<ServiceResponse>(`${this.processUrl}/deleteGroup/${groupId}`)
            .pipe(
                catchError(this.handleError<ServiceResponse>('', null))
            );
    }

    getGroupById(groupId): Observable<ServiceResponse> {
        return this.http.get<ServiceResponse>(`${this.processUrl}/getGroupById/${groupId}`)
            .pipe(
                catchError(this.handleError<ServiceResponse>('', null))
            );
    }
    /**
     * lấy về danh sách group
     * @returns 
     */
     updateProcessGroup(group): Observable<ServiceResponse> {
        return this.http.post<ServiceResponse>(`${this.processUrl}/updateGroup`,group,this.httpOptions)
            .pipe(
                catchError(this.handleError<ServiceResponse>('', null))
            );
    }

    removeFromGroup(processId): Observable<ServiceResponse> {
        return this.http.get<ServiceResponse>(`${this.processUrl}/RemoveFromGroup/${processId}`)
            .pipe(
                catchError(this.handleError<ServiceResponse>('', null))
            );
    }
    addProcessToGroup(processGroup): Observable<ServiceResponse> {
        return this.http.post<ServiceResponse>(`${this.processUrl}/addProcessToGroup`, processGroup, this.httpOptions)
            .pipe(
                catchError(this.handleError<ServiceResponse>('', null))
            );
    }
    getPagingProcessAddGroup(paging) {
        return this.http.post<ServiceResponse>(`${this.processUrl}/GetPagingProcessAddGroup`, paging, this.httpOptions)
            .pipe(
                catchError(this.handleError<ServiceResponse>('', null))
            );
    }

    getPagingProcessGroup(paging) {
        return this.http.post<ServiceResponse>(`${this.processUrl}/GetMultiPagingGroup`, paging, this.httpOptions)
            .pipe(
                catchError(this.handleError<ServiceResponse>('', null))
            );
    }
    //#endregion

    //#region process
    getPagingProcess(paging) {
        return this.http.post<ServiceResponse>(`${this.processUrl}/GetMultiPaging`, paging, this.httpOptions)
            .pipe(
                catchError(this.handleError<ServiceResponse>('', null))
            );
    }
    
    addProcess(process): Observable<ServiceResponse> {
        return this.http.post<ServiceResponse>(`${this.processUrl}/AddProcess`, process, this.httpOptions)
            .pipe(
                catchError(this.handleError<ServiceResponse>('', null))
            );
    }


    updateProcess(process): Observable<ServiceResponse> {
        return this.http.post<ServiceResponse>(`${this.processUrl}/UpdateProcess`, process, this.httpOptions)
            .pipe(
                catchError(this.handleError<ServiceResponse>('', null))
            );
    }
    //#endregion

    //#region step
    getAllStepByProcessID(processID) {
        return this.http.get<ServiceResponse>(`${this.processUrl}/GetAllStepByProcessID/${processID}`)
            .pipe(
                catchError(this.handleError<ServiceResponse>('', null))
            );
    }

    getStepByID(processID, processStepID): Observable<ServiceResponse> {
        return this.http.get<ServiceResponse>(`${this.processUrl}/GetStepByID/${processID}/${processStepID}`)
            .pipe(
                catchError(this.handleError<ServiceResponse>('', null))
            );
    }

    getFirstStep(processID): Observable<ServiceResponse> {
        return this.http.get<ServiceResponse>(`${this.processUrl}/getFirstStep/${processID}`)
            .pipe(
                catchError(this.handleError<ServiceResponse>('', null))
            );
    }

    getStepById(processStepID): Observable<ServiceResponse> {
        return this.http.get<ServiceResponse>(`${this.processUrl}/getStepById/${processStepID}`)
            .pipe(
                catchError(this.handleError<ServiceResponse>('', null))
            );
    }    
    
    getListAssignee(processStep): Observable<ServiceResponse> {
        return this.http.post<ServiceResponse>(`${this.processUrl}/getListAssignee`, processStep, this.httpOptions)
            .pipe(
                catchError(this.handleError<ServiceResponse>('', null))
            );
    } 
    
    initProcessExe(fieldData): Observable<ServiceResponse> {
        return this.http.post<ServiceResponse>(`${this.processUrl}/initProcessExe`, fieldData, this.httpOptions)
            .pipe(
                catchError(this.handleError<ServiceResponse>('', null))
            );
    }
    
    addStep(step): Observable<ServiceResponse> {
        return this.http.post<ServiceResponse>(`${this.processUrl}/AddStep`, step, this.httpOptions)
            .pipe(
                catchError(this.handleError<ServiceResponse>('', null))
            );
    }

    updateStep(step): Observable<ServiceResponse> {
        return this.http.post<ServiceResponse>(`${this.processUrl}/UpdateStep`, step, this.httpOptions)
            .pipe(
                catchError(this.handleError<ServiceResponse>('', null))
            );
    }

    deleteStep(stepId): Observable<ServiceResponse> {
        return this.http.get<ServiceResponse>(`${this.processUrl}/DeleteStep/${stepId}`)
            .pipe(
                catchError(this.handleError<ServiceResponse>('', null))
            );
    }

    //#endregion


    //#region  group
    

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
