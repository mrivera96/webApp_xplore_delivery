import { Component, OnInit } from '@angular/core';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import { LoadingController, NavController } from '@ionic/angular';
import { PaymentMethod } from 'src/app/models/payment-method';
import { NavParamService } from 'src/app/services/nav-param.service';
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
    public dialogs: Dialogs,
    public navParamsService: NavParamService,
    public navCtrl: NavController
  ) { }

  ngOnInit() {
    this.loadData()
  }

  ionViewWillEnter() {
    if (this.navParamsService.getNavData().edited || this.navParamsService.getNavData().create) {
      this.loadData();
    }
  }

  loadData() {
    this.presentLoading()
    const cardSubsc = this.paymentMethodsService.getPaymentMethods()
      .subscribe(response => {
        this.myCards = response.data
        this.myCards.forEach(card => {
          card.mes = +card.vencimiento.substring(0, 2)
          card.anio = +card.vencimiento.substring(2, 4)
        })
        this.loadingController.dismiss()
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

  editCard(card) {
    this.navParamsService.setData(card);
    this.navCtrl.navigateForward('edit-card');
  }

}
