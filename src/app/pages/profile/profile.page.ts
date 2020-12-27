import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import {Customer} from '../../models/customer';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  currentCustomer: Customer = {}

  constructor(
     private authService: AuthService,
     private navCtrl: NavController
  ) {
    this.currentCustomer = this.authService.currentUserValue.cliente
  }

  ngOnInit() {
  }

  goChangePass(){
    this.navCtrl.navigateForward('change-password')
  }

}
