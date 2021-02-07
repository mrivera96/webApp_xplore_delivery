import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { Category } from 'src/app/models/category';
import { ExtraCharge } from 'src/app/models/extra-charge';
import { PaymentMethod } from 'src/app/models/payment-method';
import { Rate } from 'src/app/models/rate';
import { Surcharge } from 'src/app/models/surcharge';
import { CategoriesService } from 'src/app/services/categories.service';
import { DeliveriesService } from 'src/app/services/deliveries.service';
import { NavParamService } from 'src/app/services/nav-param.service';
import { PaymentMethodsService } from 'src/app/services/payment-methods.service';
import { RatesService } from 'src/app/services/rates.service';

@Component({
  selector: 'app-category-select',
  templateUrl: './category-select.page.html',
  styleUrls: ['./category-select.page.scss'],
})
export class CategorySelectPage implements OnInit {
  title: string
  myCategories: Category[] = []
  loaders = {
    'loadingData': false,
    'loadingSubmit': false,
    'loadingCalculating': false
  }
  selectedCategory: Category = {}
  selectedExtraCharge: ExtraCharge = null
  surcharges: Surcharge[] = []
  rates: Rate[] = []
  data: any
  selectedId: number
  orderPayment = {
    baseRate: 0,
    surcharges: 0,
    extraCharges: 0,
    total: 0
  }
  extra: any
  minDate: string = ''
  myCards: PaymentMethod[] = []
  selectedCard: PaymentMethod = {}

  constructor(
    private activeRoute: ActivatedRoute,
    private categoriesService: CategoriesService,
    private dialogs: Dialogs,
    private ratesService: RatesService,
    public loadingController: LoadingController,
    private navParamService: NavParamService,
    private navCtrl: NavController,
    private deliveriesService: DeliveriesService,
    public atrCtrl: AlertController,
    private cardsService: PaymentMethodsService
  ) {
    this.activeRoute.paramMap.subscribe(params => {
      this.title = params.get('action')
    })
    this.data = this.navParamService.getNavData()

    this.selectedId = 1

  }

  ngOnInit() {
    if (this.data == 0) {
      this.navCtrl.back()
    } else {
      this.loadData()
    }

  }

  loadData() {
    this.presentLoading('Por favor espera un momento...');
    const categoriesSubscription = this.categoriesService.getCustomerCategories().subscribe(response => {
      this.myCategories = response.data
      //this.setSelectedCategory()
      this.loadingController.dismiss();
      categoriesSubscription.unsubscribe()
    }, error => {
      this.loadingController.dismiss();

      this.openErrorDialog('Ha ocurrido un error al cargar los datos. Intenta de nuevo recargando la página.')
      categoriesSubscription.unsubscribe()
    })

    const ratesSubscription = this.ratesService.getCustomerRates().subscribe(response => {
      this.rates = response.data
      ratesSubscription.unsubscribe()
    })

    if (this.title == 'Traslado') {
      const cardSubs = this.cardsService.getPaymentMethods()
        .subscribe(response => {
          this.myCards = response.data
          this.myCards.forEach(card => {
            card.mes = +card.vencimiento.substring(0, 2)
            card.anio = +card.vencimiento.substring(2, 4)
          })
          cardSubs.unsubscribe()
        })
    }
  }

  setSelectedCategory() {
    this.myCategories.forEach(category => {
      if (category.idCategoria === this.selectedCategory.idCategoria) {
        this.surcharges = this.selectedCategory.surcharges
        this.calculateRate(1, this.data.distance)
      }
    })

  }

  async presentLoading(msg) {
    const loading = await this.loadingController.create({
      message: msg,
      translucent: true,
    });
    return await loading.present();
  }

  openErrorDialog(msg) {
    this.dialogs.alert(msg)
      .then(() => console.log('Dialog dismissed'))
      .catch(e => console.log('Error displaying dialog', e));
  }

  calculateRate(ordersCount, distance) {
    this.rates.forEach(value => {
      if (ordersCount >= value?.entregasMinimas
        && ordersCount <= value?.entregasMaximas
        && this.selectedCategory.idCategoria == value?.idCategoria) {
        this.orderPayment.baseRate = Number(value.precio)
      } else if (ordersCount == 0) {
        this.orderPayment.baseRate = 0.00
      }
    })

    this.surcharges.forEach(value => {
      if (distance >= Number(value.kilomMinimo)
        && distance <= Number(value.kilomMaximo)
      ) {
        this.orderPayment.surcharges = Number(value.monto)
      }
    })

    this.orderPayment.total = +this.orderPayment.baseRate + +this.orderPayment.surcharges
  }

  next() {
    this.data.category = this.selectedCategory
    this.data.payment = this.orderPayment
    this.navParamService.setData(this.data)
    this.navCtrl.navigateForward('delivery-form')
  }


  saveTraslate(transactionDetails) {
    this.presentLoading('Por favor espera un momento...')
    this.data.category = this.selectedCategory
    this.data.payment = this.orderPayment,
      this.data.transactionDetails = transactionDetails
    const delSubscription = this.deliveriesService.newTraslate(this.data)
      .subscribe(response => {
        delSubscription.unsubscribe()
        this.loadingController.dismiss()
        this.openSuccessTraslate(response.message, response.nDelivery)
      })
  }

  async openSuccessTraslate(msg, id) {
    const alert = await this.atrCtrl.create({
      header: 'Éxito!',
      message: msg,
      buttons: ['OK']
    });

    await alert.present();

    alert.onDidDismiss().then(() => {
      this.navCtrl.navigateForward('reservation-details/' + id)

    })
  }

  async openConfirmTraslate() {
    const alert = await this.atrCtrl.create({
      header: 'Confirmar Traslado',
      message: '¿Quieres confirmar el traslado?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            alert.dismiss()
          }
        }, {
          text: 'Confirmar',
          role: 'OK',
          handler: () => {
            this.autorizePayment()
          }
        }
      ]
    });

    await alert.present();

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

  autorizePayment() {
    this.presentLoading('Autorizando pago, por favor espera un momento...')
    const paymentObject = {
      cardNumber: this.selectedCard.token_card,
      expDate: this.selectedCard.vencimiento,
      cvv: this.selectedCard.cvv,
      amount: this.orderPayment.total
    }
    this.cardsService.autorizePayment(paymentObject)
      .subscribe(response => {
        this.loadingController.dismiss()
        const paymentDetails = {
          reasonCode: response.CreditCardTransactionResults.ReasonCode,
          reasonCodeDescription: response.CreditCardTransactionResults.ReasonCodeDescription,
          authCode: response.CreditCardTransactionResults.AuthCode,
          orderNumber: response.OrderNumber
        }

        if (response.CreditCardTransactionResults.ReasonCode == 1 && response.CreditCardTransactionResults.ResponseCode == 1) {

          this.saveTraslate(paymentDetails)

        } else {
          this.cardsService.saveFailTransaction(paymentDetails)
            .subscribe(response => {
              console.log(response)
            })
          this.openErrorAlert(response.CreditCardTransactionResults.ReasonCodeDescription)

        }
      })
  }

}
