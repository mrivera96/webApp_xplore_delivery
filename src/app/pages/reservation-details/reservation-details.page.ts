import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import { LoadingController } from '@ionic/angular';
import { Delivery } from 'src/app/models/delivery';
import { User } from 'src/app/models/user';
import { DeliveriesService } from 'src/app/services/deliveries.service';

@Component({
  selector: 'app-reservation-details',
  templateUrl: './reservation-details.page.html',
  styleUrls: ['./reservation-details.page.scss'],
})
export class ReservationDetailsPage implements OnInit {
  deliveryId: number
  delivery: Delivery = {}
  driver: User = {}

  constructor(
    private activeRoute: ActivatedRoute,
    private deliveriesService: DeliveriesService,
    public loadingController: LoadingController,
    private dialogs: Dialogs,
  ) {
    this.activeRoute.paramMap.subscribe(params => {
      this.deliveryId = Number(params.get('id'))
    })
   }

  ngOnInit() {
    this.loadData()
  }

  loadData(){
    this.presentLoading();
    const delSubsc = this.deliveriesService
      .getById(this.deliveryId).subscribe(response => {
        this.delivery = response.data
        this.delivery.detalle.forEach(detail => {
          if(detail.idConductor != null){
            this.driver = detail.conductor
          }
        })
        if(this.driver.nomUsuario){
          this.driver.nomUsuario = this.driver.nomUsuario.split(' ', 2)[0] +' '+ this.driver.nomUsuario.split(' ', 2)[1]
        }
        
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
