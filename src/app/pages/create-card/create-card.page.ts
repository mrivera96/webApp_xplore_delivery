import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { NavParamService } from 'src/app/services/nav-param.service';
import { PaymentMethodsService } from 'src/app/services/payment-methods.service';

@Component({
  selector: 'app-create-card',
  templateUrl: './create-card.page.html',
  styleUrls: ['./create-card.page.scss'],
})
export class CreateCardPage implements OnInit {

  token: string = ''

  nCardForm: FormGroup

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private cardService: PaymentMethodsService,
    public loadingController: LoadingController,
    public atrCtrl: AlertController,
    public navCtrl: NavController,
    public navParamsService: NavParamService
  ) { }

  ngOnInit() {
    this.initialize()
  }

  initialize() {
    this.nCardForm = this.formBuilder.group({
      idCliente: this.authService.currentUserValue.idCliente,
      cardNumber: [],
      expDate: [],
      cvv: []
    })
  }


  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Por favor espera un momento...',
      translucent: true,
    });
    return await loading.present();
  }

  async openSuccessAlert(msg) {
    const alert = await this.atrCtrl.create({
      header: '¡Éxito!',
      message: msg,
      buttons: ['OK']
    });

    await alert.present();

    alert.onDidDismiss().then(() => {
      this.navParamsService.setData({ create: true })
      this.navCtrl.navigateBack('cards');
    });
  }

  async openConfirmSave() {
    const alert = await this.atrCtrl.create({
      header: 'Confirmar Registro',
      message: '¿Quieres confirmar el registro de esta tarjeta?',
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
            this.tokenize();
          }
        }
      ]
    });

    await alert.present();
  }

  save() {
    this.presentLoading()
    const cardObject = {
      cardNumber: this.token,
      expDate: this.nCardForm.get('expDate').value,
      cvv: this.nCardForm.get('cvv').value,
    }
    const cardSubs = this.cardService.createPaymentMethod(cardObject)
      .subscribe(response => {
        cardSubs.unsubscribe()
        this.loadingController.dismiss()
        this.openSuccessAlert(response.message)
      }, error => {
        error.subscribe(error => {
          this.loadingController.dismiss()
          this.openErrorAlert(error.statusText)
        })
      });
  }

  async openErrorAlert(msg) {
    const alert = await this.atrCtrl.create({
      header: 'Error',
      message: msg,
      buttons: [{
        text: 'Aceptar',
        role: 'OK',
        handler: (blah) => {
          alert.dismiss();
        }
      }]
    });

    await alert.present();

    alert.onDidDismiss().then(() => {
      alert.dismiss()
    });
  }

  tokenize() {
    if (this.nCardForm.valid) {
      this.presentLoading()
      const cardSubsc = this.cardService.tokenizeCard(this.nCardForm.value)
        .subscribe(response => {
          if (response.Success == true) {
            this.token = response.Token
            this.save()
          }
          this.loadingController.dismiss()
          cardSubsc.unsubscribe()
        })
    }

  }

}
