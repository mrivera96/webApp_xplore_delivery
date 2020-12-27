import { Component } from '@angular/core';

import {MenuController, NavController, Platform} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { User } from './models/user';
import { Customer } from './models/customer';
import { NavParamService } from './services/nav-param.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  currentUser: Customer
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    public menuCtrl: MenuController, 
    private authService: AuthService,
    public navCtrl: NavController,
    
  ) {
    this.initializeApp();
    if(authService.currentUser){
      this.currentUser = this.authService.currentUserValue?.cliente
    }

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
    });
  }

  go(route){
    this.menuCtrl.toggle()
    this.navCtrl.navigateForward(route)
  }

  onLogOut(){
    this.menuCtrl.toggle()
    this.authService.logout().subscribe(data => {
      this.navCtrl.navigateRoot('login')
    })
    
  }

  
}
