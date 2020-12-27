import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import { AlertController, LoadingController } from '@ionic/angular';
import { Category } from 'src/app/models/category';
import { ExtraCharge } from 'src/app/models/extra-charge';
import { Rate } from 'src/app/models/rate';
import { Surcharge } from 'src/app/models/surcharge';
import { CategoriesService } from 'src/app/services/categories.service';
import { DeliveriesService } from 'src/app/services/deliveries.service';
import { NavParamService } from 'src/app/services/nav-param.service';
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


  constructor(
    private activeRoute: ActivatedRoute,
    private categoriesService: CategoriesService,
    private dialogs: Dialogs,
    private ratesService: RatesService,
    public loadingController: LoadingController,
    private navParamService: NavParamService,
    private router: Router,
    private deliveriesService: DeliveriesService,
    public atrCtrl: AlertController
  ) {
    this.activeRoute.paramMap.subscribe(params => {
      this.title = params.get('action')
    })
    this.data = this.navParamService.getNavData()
 
    this.selectedId = 1

  }

  ngOnInit() {
    this.loadData()
  }

  loadData() {
    this.presentLoading();
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
  }

  setSelectedCategory() {
    this.myCategories.forEach(category => {
      if (category.idCategoria === this.selectedCategory.idCategoria) {
        this.surcharges = this.selectedCategory.surcharges
        this.calculateRate(1, this.data.distance)
      }
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
    this.router.navigate(['additional-form']) 

  }


  saveTraslate() {
    this.presentLoading()
    this.data.category = this.selectedCategory
    this.data.payment = this.orderPayment
    const delSubscription = this.deliveriesService.newTraslate(this.data)
      .subscribe(response => {
        delSubscription.unsubscribe()
        this.loadingController.dismiss()
        this.openSuccessTraslate(response.message,response.nDelivery)
        /* this.navParamService.setData(response.data)
        this.router.navigate(['finish-traslate']) */
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
      this.router.navigate(['reservation-details',id])
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
            this.saveTraslate()
          }
        }
      ]
    });

    await alert.present();

  }

  



}
