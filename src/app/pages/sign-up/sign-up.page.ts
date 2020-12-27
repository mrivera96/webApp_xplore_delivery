import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { BlankSpacesValidator } from 'src/app/helpers/blank-spaces.validator';
import { MustMatch } from 'src/app/helpers/must-match.validator';
import { PasswordValidate } from 'src/app/helpers/password.validator';
import { Customer } from 'src/app/models/customer';
import { AuthService } from 'src/app/services/auth.service';
import { NavParamService } from 'src/app/services/nav-param.service';

@Component({
  selector: 'app-register',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  newCustomer: Customer = {}
  phoneMask: any
  nCustomerForm: FormGroup
  constructor(
    private formBuilder: FormBuilder,
    public navCtrl: NavController,
    public atrCtrl: AlertController,
    public navParams: NavParamService,
    private authService: AuthService,
    public loadingControler: LoadingController
  ) {

  }

  ngOnInit() {
    this.initialize()
  }

  get controls() {
    return this.nCustomerForm.controls
  }

  initialize() {
    this.nCustomerForm = this.formBuilder.group({
      nomRepresentante: ['', [
        Validators.required,
        Validators.maxLength(80)]],
      numIdentificacion: ['', [
        Validators.required,
        Validators.maxLength(14),
        Validators.minLength(13)]],
      numTelefono: ['', [
        Validators.required,
        Validators.minLength(9),
        Validators.maxLength(9)]],
      email: ['', [
        Validators.required,
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"),
        Validators.maxLength(50)]],
      newPass: ['', [Validators.required, Validators.minLength(8)]],
      confirmNewPass: ['', [Validators.required]]
    }, {
      validator:
        [
          MustMatch('newPass', 'confirmNewPass'),
          PasswordValidate('newPass'),
          BlankSpacesValidator('newPass'),
        ]
    })
  }

  formSubmit(form) {
    console.log(form)

  }

  phoneMasking(_event) {
    let event = _event?.target?.value

    let newVal = event?.replace(/\D/g, '');
    /*if (backspace && newVal.length <= 6) {
      newVal = newVal.substring(0, newVal.length - 1);
    }*/
    if (newVal?.length === 0) {
      newVal = '';
    } else if (newVal?.length > 4) {
      newVal = newVal.replace(/^(\d{0,4})(\d{0,4})/, '$1-$2');
    }

    this.controls.numTelefono.setValue(newVal)
  }

  dismissModal() {
    this.navCtrl.back()
  }

  async openConfirmDialog() {
    const alert = await this.atrCtrl.create({
      header: '¿Quieres confirmar tu registro?',
      message: '¿Tu número de teléfono es ' + this.controls.numTelefono.value + '? ' + '\n Te enviaremos un código de verificación.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            alert.dismiss();
          }
        }, {
          text: 'Confirmar',
          role: 'OK',
          handler: () => {
            if (this.nCustomerForm.valid) {
              this.confirmSignUp()
            }
          }
        }
      ]
    });

    await alert.present();

    alert.onDidDismiss().then(() => {
      alert.dismiss();
    });

  }

  confirmSignUp() {
    const data = {
      form: this.nCustomerForm.value,
      code: this.generateCode()
    }
    this.navParams.setData(data)
    this.navCtrl.navigateForward('confirmation')
  }

  verifyMail() {
    const authSubs = this.authService
      .verifyMail(this.nCustomerForm.get('email').value)
      .subscribe(response => {
        if (response.data == true) {
          this.nCustomerForm.controls.email.setErrors({ exists: true })
        } else {
          if (this.nCustomerForm.controls.email.hasError('exists')) {
            this.nCustomerForm.controls.email.setErrors({ exists: false })
          }
        }
        authSubs.unsubscribe()

      })
  }

  verifyNumber() {
    const authSubs = this.authService
      .verifyNumber(this.nCustomerForm.get('numTelefono').value)
      .subscribe(response => {
        if (response.data == true) {
          this.nCustomerForm.controls.numTelefono.setErrors({ exists: true })
        } else {
          if (this.nCustomerForm.controls.numTelefono.hasError('exists')) {
            this.nCustomerForm.controls.numTelefono.setErrors({ exists: false })
          }
        }
        authSubs.unsubscribe()
      })
  }


  async presentLoading() {
    const loading = await this.loadingControler.create({
      message: 'Por favor espera un momento...',
      translucent: true,
    });
    return await loading.present();
  }

  async openErrorAlert(msg) {
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

  generateCode() {
    return Math.floor(1000 + Math.random() * 9000)
  }

}
