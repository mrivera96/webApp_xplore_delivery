import { Injectable } from '@angular/core';
import { isNullOrUndefined } from 'util';

@Injectable({
  providedIn: 'root'
})
export class NavParamService {

  navData:any
  constructor() { }

  setData(navOj){
    this.navData = navOj
  }

  getNavData(){
    if(this.navData === null || this.navData === undefined){
      return 0
    }
    return this.navData
  }
}
