import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { SignInModalPage } from '../sign-in-modal/sign-in-modal.page';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  currentModal = null
  constructor(
    public modalController: ModalController,
    private authService: AuthService,
    private router: Router
  ) {
    // redirigir si el usuario está logueado
    if (this.authService.currentUserValue) {
      this.router.navigate(['main'])
    }
  }

  ngOnInit() {
  }

  openSingUp() {
    this.router.navigate(['sign-up'])
  }

}
