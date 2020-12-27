import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CustomerService} from '../../services/customer.service';
import {MustMatch} from '../../helpers/must-match.validator';
import {PasswordValidate} from '../../helpers/password.validator';
import {BlankSpacesValidator} from '../../helpers/blank-spaces.validator';
import {Customer} from '../../models/customer';
import {NavParamService} from '../../services/nav-param.service';
import {AuthService} from '../../services/auth.service';
import {AlertController, LoadingController, NavController} from '@ionic/angular';

@Component({
    selector: 'app-edit-info',
    templateUrl: './edit-info.page.html',
    styleUrls: ['./edit-info.page.scss'],
})
export class EditInfoPage implements OnInit {
    editForm: FormGroup;
    currentCustomer: Customer;
    changePass = false;

    constructor(
        private customerService: CustomerService,
        private formBuilder: FormBuilder,
        private authService: AuthService,
        public atrCtrl: AlertController,
        public navCtrl: NavController,
        public loadingController: LoadingController

    ) {
        this.currentCustomer = this.authService.currentUserValue.cliente;
    }

    ngOnInit() {
        this.initialize();
    }

    initialize() {
        this.editForm = this.formBuilder.group({
            idCliente:[this.currentCustomer.idCliente],
            nomRepresentante: [this.currentCustomer.nomRepresentante, [
                Validators.required,
                Validators.maxLength(80)]],
            numTelefono: [this.currentCustomer.numTelefono, [
                Validators.required,
                Validators.minLength(9),
                Validators.maxLength(9)]],
            email: [this.currentCustomer.email, [
                Validators.required,
                Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$'),
                Validators.maxLength(50)]],
            numIdentificacion: [this.currentCustomer.numIdentificacion],
            enviarNotificaciones: [this.currentCustomer.enviarNotificaciones],
            montoGracia:[this.currentCustomer.montoGracia]

        }, /*{
            validator:
                [
                    MustMatch('newPass', 'confirmNewPass'),
                    PasswordValidate('newPass'),
                    BlankSpacesValidator('newPass'),
                ]
        }*/);

    }

    get controls() {
        return this.editForm.controls;
    }

    onFormSubmit() {
        if(this.editForm.valid){
            this.presentLoading()
            const custSubs = this.customerService.updateData(this.editForm.value)
                .subscribe(response => {
                    this.loadingController.dismiss()
                    this.openSuccessUpdate(response.message)
                    custSubs.unsubscribe()
                }, error => {
                    error.subscribe(error => {
                        this.loadingController.dismiss()
                        this.openErrorAlert(error.statusText)
                    })
                })
        }

    }

    togglePassWordChange(){
        this.changePass = !this.changePass
        if(this.changePass){
            this.controls.newPass.setValidators([Validators.required,Validators.minLength(8)])
            this.controls.confirmNewPass.setValidators([Validators.required,Validators.minLength(8)])
        }
    }

    async openSuccessUpdate(msg) {
        const alert = await this.atrCtrl.create({
            header: 'Éxito!',
            message: msg,
            buttons: ['OK']
        });

        await alert.present();

        alert.onDidDismiss().then(() => {
            this.navCtrl.navigateBack('profile')
        });
    }

    async openConfirmSubmit() {
        const alert = await this.atrCtrl.create({
            header: 'Confirmar Cambios',
            message: '¿Quieres confirmar los cambios?',
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
                        this.onFormSubmit();
                    }
                }
            ]
        });

        await alert.present();
    }

    async presentLoading() {
        const loading = await this.loadingController.create({
            message: 'Por favor espera un momento...',
            translucent: true,
        });
        return await loading.present();
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
