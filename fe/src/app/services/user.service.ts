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


    getPaging(paging) {
        return this.http.post<ServiceResponse>(`${this.processUrl}/GetMultiPaging`, paging, this.httpOptions)
            .pipe(
                catchError(this.handleError<ServiceResponse>('', null))
            );
    }

    //#region  auth
    authenticate(userLogin) {
        return this.http.post<ServiceResponse>(`${this.processUrl}/authenticate`, userLogin, this.httpOptions)
            .pipe(
                catchError(this.handleError<ServiceResponse>('', null))
            );
    }

    //#endregion

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

    //#region  group

    getPagingUserGroup(paging) {
        return this.http.post<ServiceResponse>(`${this.processUrl}/GetMultiPagingGroup`, paging, this.httpOptions)
            .pipe(
                catchError(this.handleError<ServiceResponse>('', null))
            );
    }




    addUserGroup(group): Observable<ServiceResponse> {
        return this.http.post<ServiceResponse>(`${this.processUrl}/addGroup`, group, this.httpOptions)
            .pipe(
                catchError(this.handleError<ServiceResponse>('', null))
            );
    }

    /**
     * lấy về danh sách group
     * @returns 
     */
    deleteUserGroup(groupId): Observable<ServiceResponse> {
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
    updateUserGroup(group): Observable<ServiceResponse> {
        return this.http.post<ServiceResponse>(`${this.processUrl}/updateGroup`, group, this.httpOptions)
            .pipe(
                catchError(this.handleError<ServiceResponse>('', null))
            );
    }

    removeFromGroup(usr): Observable<ServiceResponse> {
        return this.http.post<ServiceResponse>(`${this.processUrl}/RemoveFromGroup/`, usr, this.httpOptions)
            .pipe(
                catchError(this.handleError<ServiceResponse>('', null))
            );
    }
    addUserToGroup(processGroup): Observable<ServiceResponse> {
        return this.http.post<ServiceResponse>(`${this.processUrl}/addUserToGroup`, processGroup, this.httpOptions)
            .pipe(
                catchError(this.handleError<ServiceResponse>('', null))
            );
    }
    getPagingUserAddGroup(paging) {
        return this.http.post<ServiceResponse>(`${this.processUrl}/getPagingUserAddGroup`, paging, this.httpOptions)
            .pipe(
                catchError(this.handleError<ServiceResponse>('', null))
            );
    }

    getMultiPagingInGroup(paging) {
        return this.http.post<ServiceResponse>(`${this.processUrl}/GetMultiPagingInGroup`, paging, this.httpOptions)
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
