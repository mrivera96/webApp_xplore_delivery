import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DeliveriesService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  newTraslate(data) {
    return this.http.post<any>(`${environment.apiUrl}`, {
      'function': 'insertTraslate',
      data,
      tkn: this.authService.currentUserValue.access_token
    });
  }

  newDelivery(data){
    return this.http.post<any>(`${environment.apiUrl}`, {
      'function': 'createDelivery',
      data,
      tkn: this.authService.currentUserValue.access_token
    });
  }

  getAllCustomerDeliveries() {
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'getAllCustomerDeliveries', tkn: this.authService.currentUserValue.access_token
    })
  }

  getById(id) {
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'getDeliveryById',
      id: id,
      tkn: this.authService.currentUserValue.access_token
    })
  }

  getPendingCustomerDeliveries(){
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'getPendingCustomerDeliveries',
      tkn: this.authService.currentUserValue.access_token
    })
  }
}
