import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RatesService {

  constructor(
    private http: HttpClient, 
    private authService: AuthService
    ) { }

  getCustomerRates(idCustomer = null) {
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'getMyRates',
      idCustomer,
      tkn: this.authService.currentUserValue.access_token
    })
  }
}
