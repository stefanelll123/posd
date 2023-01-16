import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  baseUrl = 'http://Cogni-Servi-CIMZS9RDUB18-1512614307.us-east-1.elb.amazonaws.com';

  constructor(
    private http: HttpClient
  ) { 
  }

  download(file: string): Observable<any> {
    const url: {[key: string]: string} = {
      employee: '/api/employees',
      profile: '/api/profile',
      salaries: '/api/salaries'
    }

    return this.http.get(this.baseUrl + url[file], {headers: new HttpHeaders({'Accept': 'text/html'}), responseType: 'text'}).pipe(map(response => {
      return response;
    }));
  }

  createUser(user: any): Observable<any> {
    delete user.showPassword;
    return this.http.post(this.baseUrl + '/api/users', user);
  }

  addRole(user: any): Observable<any> {
    return this.http.post(this.baseUrl + '/api/access/add', user);
  }

  removeRole(user: any): Observable<any> {
    return this.http.post(this.baseUrl + '/api/access/remove', user);
  }
}
