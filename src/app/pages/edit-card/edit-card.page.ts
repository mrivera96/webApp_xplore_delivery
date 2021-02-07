import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { PaymentMethod } from 'src/app/models/payment-method';
import { AuthService } from 'src/app/services/auth.service';
import { NavParamService } from 'src/app/services/nav-param.service';
import { PaymentMethodsService } from 'src/app/services/payment-methods.service';

@Component({
  selector: 'app-edit-card',
  templateUrl: './edit-card.page.html',
  styleUrls: ['./edit-card.page.scss'],
})
export class EditCardPage implements OnInit {
  token: string = ''
  currentCard: PaymentMethod = {}

  editCardForm: FormGroup

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private cardService: PaymentMethodsService,
    public loadingController: LoadingController,
    public atrCtrl: AlertController,
    public navCtrl: NavController,
    public navParamsService: NavParamService
  ) {
    this.currentCard = this.navParamsService.getNavData()
   }

  ngOnInit() {
    if(this.currentCard == 0){
      this.navCtrl.back()
    }else{
      this.initialize()
    }
  }

  initialize() {
    this.editCardForm = this.formBuilder.group({
      cardId: this.currentCard.idFormaPago,
      expDate: [this.currentCard.vencimiento,Validators.required],
      cvv: [this.currentCard.cvv,Validators.required]
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
      header: 'Confirmar Modificación',
      message: '¿Quieres confirmar los cambios en esta tarjeta?',
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
            this.save();
          }
        }
      ]
    });

    await alert.present();
  }

  save() {
    this.presentLoading()
   
    const cardSubs = this.cardService.editPaymentMethod(this.editCardForm.value)
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


}
