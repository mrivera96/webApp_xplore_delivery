import { Component, OnInit } from '@angular/core';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import { LoadingController } from '@ionic/angular';
import { PaymentMethod } from 'src/app/models/payment-method';
import { PaymentMethodsService } from 'src/app/services/payment-methods.service';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.page.html',
  styleUrls: ['./cards.page.scss'],
})
export class CardsPage implements OnInit {
  myCards: PaymentMethod[] = []

  constructor(
    private paymentMethodsService: PaymentMethodsService,
    public loadingController: LoadingController,
    public dialogs: Dialogs
  ) { }

  ngOnInit() {
    this.loadData()
  }

  loadData(){
    this.presentLoading()
    const cardSubsc = this.paymentMethodsService.getPaymentMethods()
    .subscribe(response => {
      this.loadingController.dismiss()
      this.myCards = response.data
      cardSubsc.unsubscribe()
    }, error => {
      this.loadingController.dismiss()
      error.subscribe(error => {
        this.openErrorDialog(error.statusText)
      })
      
    })
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Por favor espera un momento...',
      translucent: true,
    });
    return await loading.present();
  }

  openErrorDialog(msg) {
    this.dialogs.alert(msg)
      .then(() => console.log('Dialog dismissed'))
      .catch(e => console.log('Error displaying dialog', e));
  }

}
