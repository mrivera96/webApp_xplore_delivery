import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MustMatch} from '../../helpers/must-match.validator';
import {PasswordValidate} from '../../helpers/password.validator';
import {BlankSpacesValidator} from '../../helpers/blank-spaces.validator';
import {AuthService} from '../../services/auth.service';
import {CustomerService} from '../../services/customer.service';
import {AlertController, LoadingController, NavController} from '@ionic/angular';

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.page.html',
    styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {
    passForm: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private customersService: CustomerService,
        public atrCtrl: AlertController,
        public navCtrl: NavController,
        public loadingController: LoadingController,
        private authService: AuthService
    ) {
    }

    ngOnInit() {
        this.initialize();
    }

    initialize() {
        this.passForm = this.formBuilder.group({
            oldPass: ['', [Validators.minLength(8)]],
            newPass: ['', [Validators.required, Validators.minLength(8)]],
            confirmNewPass: ['', [Validators.required]]
        }, {
            validator:
                [
                    MustMatch('newPass', 'confirmNewPass'),
                    PasswordValidate('newPass'),
                    BlankSpacesValidator('newPass'),
                ]
        });
    }

    get controls() {
        return this.passForm.controls;
    }


    onFormSubmit() {
        if (this.passForm.valid) {
            this.presentLoading();
            const custSubsc = this.customersService.changeCustomerPassword(this.passForm.value)
                .subscribe(response => {
                    this.loadingController.dismiss();
                    this.openSuccessUpdate(response.message);
                    custSubsc.unsubscribe();
                }, error => {
                    error.subscribe(error => {
                        this.loadingController.dismiss()
                        this.openErrorAlert(error.statusText)
                        custSubsc.unsubscribe();
                    })

                });
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
            this.logout();
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
            alert.dismiss();
        });
    }

    logout() {
        const authSubscription = this.authService.logout()
            .subscribe(data => {
                this.navCtrl.navigateRoot('login')
                authSubscription.unsubscribe();
            });
    }
}
