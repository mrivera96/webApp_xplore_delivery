import { Component, OnInit } from '@angular/core';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import { LoadingController } from '@ionic/angular';
import { Delivery } from 'src/app/models/delivery';
import { DeliveriesService } from 'src/app/services/deliveries.service';

@Component({
  selector: 'app-my-reservations',
  templateUrl: './my-reservations.page.html',
  styleUrls: ['./my-reservations.page.scss'],
})
export class MyReservationsPage implements OnInit {
  myReservations: Delivery[] = []

  constructor(
    private deliveriesService: DeliveriesService,
    public loadingController: LoadingController,
    private dialogs: Dialogs,
  ) { }

  ngOnInit() {
    this.loadData()
  }

  initialize() {

  }

  loadData() {
    this.presentLoading();
    const delSubsc = this.deliveriesService
      .getAllCustomerDeliveries().subscribe(response => {
        this.myReservations = response.data

        this.myReservations.forEach(delivery => {
          delivery.entregas = delivery.detalle.length
        })
        this.loadingController.dismiss();
        delSubsc.unsubscribe()
      }, error => {
        this.loadingController.dismiss();

        this.openErrorDialog('Ha ocurrido un error al cargar los datos. Intenta de nuevo recargando la página.')
        delSubsc.unsubscribe()
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
