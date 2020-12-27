import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PaymenthMethodsService {

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) { }

  getPaymentMethods(){
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'getCustomerPaymentMethods',
      tkn: this.authService.currentUserValue.access_token
    })
  }

  createPaymentMethod(form){
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'createPaymentMethod',
      form,
      tkn: this.authService.currentUserValue.access_token
    })
  }
}
