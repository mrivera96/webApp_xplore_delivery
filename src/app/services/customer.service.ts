import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthService} from './auth.service';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(
      private http: HttpClient,
      private authService: AuthService
  ) { }

  updateData(form){
    form.nomEmpresa = form.nomRepresentante
    return this.http.post<any>(`${environment.apiUrl}`, {
      'function': 'updateCustomerData',
      form,
      tkn: this.authService.currentUserValue.access_token
    });
  }

  changeCustomerPassword(form){
    return this.http.post<any>(`${environment.apiUrl}`,{
      function:'changeCustomerPassword',
      form,
      tkn: this.authService.currentUserValue.access_token
    })
  }
}
