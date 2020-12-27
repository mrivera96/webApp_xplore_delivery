import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {ModalController, NavController} from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { SignInPage } from '../sign-in/sign-in.page';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  currentModal = null
  constructor(
    public navCtrl: NavController,
    private authService: AuthService,
    private router: Router
  ) {
    // redirigir si el usuario está logueado
    if (this.authService.currentUserValue) {
      this.navCtrl.navigateForward('main')
    }
  }

  ngOnInit() {
  }

  openSingUp() {
    this.navCtrl.navigateForward('sign-up')
  }

}
