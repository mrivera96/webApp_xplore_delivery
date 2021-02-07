import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { Category } from 'src/app/models/category';
import { PaymentMethod } from 'src/app/models/payment-method';
import { DeliveriesService } from 'src/app/services/deliveries.service';
import { NavParamService } from 'src/app/services/nav-param.service';
import { PaymentMethodsService } from 'src/app/services/payment-methods.service';

@Component({
    selector: 'app-additional-form',
    templateUrl: './delivery-form.page.html',
    styleUrls: ['./delivery-form.page.scss'],
})
export class DeliveryFormPage implements OnInit {
    nDeliveryForm: FormGroup;
    selectedCategory: Category;
    data: any;
    orderPayment: any;
    extra: any;
    schedule = false;
    minDatetime: any = formatDate(new Date().setHours(new Date().getHours(), new Date().getMinutes() + 30), 'yyyy-MM-ddTHH:mm', 'en');
    myCards: PaymentMethod[] = []
    selectedCard: PaymentMethod = {}
    constructor(
        private formBuilder: FormBuilder,
        private navParamService: NavParamService,
        private deliveriesService: DeliveriesService,
        public loadingController: LoadingController,
        private cardsService: PaymentMethodsService,
        public atrCtrl: AlertController,
        private router: Router,
        public navCtrl: NavController
    ) {
        this.data = this.navParamService.getNavData();
        this.selectedCategory = this.data.category;
        this.orderPayment = this.data.payment;
    }

    ngOnInit() {
        if (this.data == 0) {
            this.navCtrl.back()
        } else {
            this.initialize()
            this.loadData()
        }
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

    loadData() {
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

    async presentLoading(msg) {
        const loading = await this.loadingController.create({
            message: msg,
            translucent: true,
        });
        return await loading.present();
    }

    requestVehicle(transactionDetails) {
        this.presentLoading('Por favor espera un momento...');
        this.data.extra = this.extra;
        this.data.payment = this.orderPayment;
        this.data.orderDetail = this.nDeliveryForm.value;
        this.data.transactionDetails = transactionDetails
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
                        this.autorizePayment();
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
                const transactionDetails = {
                    reasonCode: response.CreditCardTransactionResults.ReasonCode,
                    reasonCodeDescription: response.CreditCardTransactionResults.ReasonCodeDescription,
                    authCode: response.CreditCardTransactionResults.AuthCode,
                    orderNumber: response.OrderNumber
                }

                if (response.CreditCardTransactionResults.ReasonCode == 1 && response.CreditCardTransactionResults.ResponseCode == 1) {

                    this.requestVehicle(transactionDetails)

                } else {
                    this.cardsService.saveFailTransaction(transactionDetails)
                        .subscribe(response => {
                            console.log(response)
                        })
                    this.openErrorAlert(response.CreditCardTransactionResults.ReasonCodeDescription)
                }
            })
    }

}
