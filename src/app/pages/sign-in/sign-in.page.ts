import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {AlertController, LoadingController, NavController} from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { Dialogs } from '@ionic-native/dialogs/ngx';

@Component({
  selector: 'app-sign-in-modal',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {
  verifiedEmail = false
  verifiedNumber = false
  loaders = {
    loadingVerifying: false,
    loadingSubmit: false
  }
  signInForm: FormGroup
  existsMail = true
  mailLogin = false
  constructor(
    public navCtrl: NavController,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private dialogs: Dialogs,
    public atrCtrl: AlertController,
    public loadingController: LoadingController

  ) { }

  ngOnInit() {
    this.initialize()
  }

  initialize() {
    this.signInForm = this.formBuilder.group({
      numTelefono:['', Validators.required],
      email: ['', []],
      password: [
        '', [Validators.required]
      ]
    })

  }

  get controls() {
    return this.signInForm.controls
  }

  ngOnDestroy() {
    if (window.history.state.modal) {
      history.back();
    }
  }

  dismissModal() {
    this.navCtrl.back()
  }

  verifyMail() {
    this.loaders.loadingVerifying = true
    this.existsMail = true
    const authSubs = this.authService
      .verifyMail(this.signInForm.get('email').value)
      .subscribe(response => {
        if (response.data == true) {
          this.verifiedEmail = true
        } else {
          this.controls.email.setErrors({ invalidEmail: true })
        }
        this.loaders.loadingVerifying = false
        authSubs.unsubscribe()
      })
  }

  verifyNumber() {
    this.loaders.loadingVerifying = true
    const authSubs = this.authService
      .verifyNumber(this.signInForm.get('numTelefono').value)
      .subscribe(response => {
        if (response.data == true) {
          this.verifiedNumber = true
        } else {
          this.openErrorDialog('El número que ingresaste no se encuentra en nuestros registros')
        }
        this.loaders.loadingVerifying = false
        authSubs.unsubscribe()
      })
  }

  changeMailLogin(){
    this.mailLogin = true
    this.controls.numTelefono.setErrors(null)
    this.controls.numTelefono.setValidators(null)
    this.controls.email.setValidators([Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"),
    Validators.maxLength(50)])
  }

  onFormSubmit() {
    //this.router.navigate(['main'])
    this.presentLoading()
    if(this.verifiedNumber){
      const authSubscription = this.authService.numberLogin(this.controls.numTelefono.value, this.controls.password.value)
      .subscribe(
        response => {
          const user = response.user;
          localStorage.setItem('currentUserManagement', JSON.stringify(user));
          this.authService.setCurrUser(user)
          this.loadingController.dismiss()
          authSubscription.unsubscribe()
          this.navCtrl.navigateForward('main')
        }, error => {
          error.subscribe(error => {
            this.openErrorDialog(error.statusText)
            this.loadingController.dismiss()
            authSubscription.unsubscribe()
          })
          
        })
    }else if(this.verifiedEmail){
      const authSubscription = this.authService.login(this.controls.email.value, this.controls.password.value)
      .subscribe(
        response => {
          const user = response.user;
          localStorage.setItem('currentUserManagement', JSON.stringify(user));
          this.authService.setCurrUser(user)
          this.loadingController.dismiss()
          authSubscription.unsubscribe()
          this.navCtrl.navigateForward('main')
        }, error => {
          error.subscribe(error => {
            this.loadingController.dismiss()
            this.openErrorDialog(error.statusText)
            this.loaders.loadingSubmit = false
            authSubscription.unsubscribe()
          })
          
        })
    }
    
  }

  async openErrorDialog(msg) {
    const alert = await this.atrCtrl.create({
      header: 'Error',
      message: msg,
      buttons: ['OK']
    });

    await alert.present();

    alert.onDidDismiss().then(() => {
      alert.dismiss();
    });

  }

  async presentLoading() {
    const loading = await this.loadingController.create({
        message: 'Por favor espera un momento...',
        translucent: true,
    });
    return await loading.present();
}



}
