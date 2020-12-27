import {formatDate} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AlertController, LoadingController, NavController} from '@ionic/angular';
import {Category} from 'src/app/models/category';
import {DeliveriesService} from 'src/app/services/deliveries.service';
import {NavParamService} from 'src/app/services/nav-param.service';

@Component({
    selector: 'app-additional-form',
    templateUrl: './additional-form.page.html',
    styleUrls: ['./additional-form.page.scss'],
})
export class AdditionalFormPage implements OnInit {
    nDeliveryForm: FormGroup;
    selectedCategory: Category;
    data: any;
    orderPayment: any;
    extra: any;
    schedule = false;
    minDatetime: any = formatDate(new Date().setHours(new Date().getHours(), new Date().getMinutes() + 30), 'yyyy-MM-ddTHH:mm', 'en');

    constructor(
        private formBuilder: FormBuilder,
        private navParamService: NavParamService,
        private deliveriesService: DeliveriesService,
        public loadingController: LoadingController,
        public atrCtrl: AlertController,
        private router: Router,
        public navCtrl: NavController
    ) {
        this.data = this.navParamService.getNavData();
        this.selectedCategory = this.data.category;
        this.orderPayment = this.data.payment;
    }

    ngOnInit() {
        this.initialize();
    }

    initialize() {
        this.nDeliveryForm = this.formBuilder.group({
            instRecogida: ['', [Validators.maxLength(150)]],
            detalleEnvio: ['', [Validators.required, Validators.maxLength(250), Validators.pattern(/^((?!\s{2,}).)*$/)]],
            nomDestinatario: ['', [Validators.required, Validators.maxLength(150), Validators.pattern(/^((?!\s{2,}).)*$/)]],
            numDestinatario: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
            instEntrega: ['', [Validators.maxLength(150)]],
            fechaReserva: [formatDate(new Date().setHours(new Date().getHours(), new Date().getMinutes() + 30), 'yyyy-MM-dd HH:mm', 'en')]
        });
    }

    get controls() {
        return this.nDeliveryForm.controls;
    }

    addExtraCharge(checked, extracharge, option) {
        const extraCharge = {
            idCargoExtra: extracharge,
            idDetalleOpcion: option.idDetalleOpcion,
            costo: option.costo
        };
        if (checked == true) {
            this.extra = extraCharge;
            this.orderPayment.extraCharges += +extraCharge.costo;
            this.orderPayment.total += +extraCharge.costo;
        } else {
            this.extra = {};
            this.orderPayment.extraCharges -= +extraCharge.costo;
            this.orderPayment.total -= +extraCharge.costo;
        }
    }

    async presentLoading() {
        const loading = await this.loadingController.create({
            message: 'Por favor espera un momento...',
            translucent: true,
        });
        return await loading.present();
    }

    requestVehicle() {
        this.presentLoading();
        this.data.extra = this.extra;
        this.data.payment = this.orderPayment;
        this.data.orderDetail = this.nDeliveryForm.value;
        const delSubs = this.deliveriesService.newDelivery(this.data)
            .subscribe(response => {
                delSubs.unsubscribe();
                this.loadingController.dismiss();
                this.openSuccessDelivery(response.message, response.nDelivery);

            }, error => {
                error.subscribe(error => {
                    this.loadingController.dismiss();
                    this.openErrorAlert(error.statusText)
                })
            });
    }

    async openSuccessDelivery(msg, id) {
        const alert = await this.atrCtrl.create({
            header: 'Éxito!',
            message: msg,
            buttons: ['OK']
        });

        await alert.present();

        alert.onDidDismiss().then(() => {
            this.navCtrl.navigateForward('reservation-details/' + id);
        });
    }

    async openConfirmDelivery() {
        const alert = await this.atrCtrl.create({
            header: 'Confirmar Delivery',
            message: '¿Quieres confirmar el delivery?',
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
                        this.requestVehicle();
                    }
                }
            ]
        });

        await alert.present();

    }

    setSchedule() {
        this.schedule = true;
    }

    async openErrorAlert(msg) {
        const alert = await this.atrCtrl.create({
            header: 'Error',
            message: msg,
            buttons: ['OK']
        });

        await alert.present();

        alert.onDidDismiss().then(() => {
            alert.dismiss()
        });
    }

}
