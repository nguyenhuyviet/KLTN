import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../_models';



@Injectable({ providedIn: 'root' })
export class UserService {

    private host = 'https://localhost:44372'; 
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<User[]>(`${this.host}/users`);
    }
}