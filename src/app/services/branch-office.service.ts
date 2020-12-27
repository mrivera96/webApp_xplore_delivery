import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class BranchOfficeService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getBranchOffices(idCustomer = null){
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'getCustomerBranchOffices',
      idCustomer,
      tkn: this.authService.currentUserValue.access_token
    })
  }

  editBranch(form){
    return this.http.post<any>(`${environment.apiUrl}`, {
      function: 'updateBranch',
      form,
      tkn: this.authService.currentUserValue.access_token})
  }

}
