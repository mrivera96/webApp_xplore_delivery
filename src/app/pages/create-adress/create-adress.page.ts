import {Component, NgZone, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BranchOfficeService} from '../../services/branch-office.service';
import {Dialogs} from '@ionic-native/dialogs/ngx';
import {AlertController, LoadingController, NavController} from '@ionic/angular';
import {Router} from '@angular/router';
import {NavParamService} from '../../services/nav-param.service';
declare var google;
@Component({
    selector: 'app-create-adress',
    templateUrl: './create-adress.page.html',
    styleUrls: ['./create-adress.page.scss'],
})
export class CreateAdressPage implements OnInit {
    nAddressForm: FormGroup;
    GoogleAutocomplete: any;
    autocomplete: { input: string; };
    autocompleteItems: any[];

    constructor(
        private branchesService: BranchOfficeService,
        private formBuilder: FormBuilder,
        public zone: NgZone,
        public dialog: Dialogs,
        public loadingController: LoadingController,
        public atrCtrl: AlertController,
        private navCtrl: NavController,
        private navParamsService: NavParamService
    ) {

        this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
        this.autocomplete = {input: ''};
        this.autocompleteItems = [];

    }

    ngOnInit() {
        this.initialize();
    }

    initialize() {
        this.nAddressForm = this.formBuilder.group({
            nomSucursal: ['', Validators.required],
            numTelefono: ['', [Validators.minLength(9), Validators.maxLength(9)]],
            direccion: ['', Validators.required],
            instrucciones: ['', Validators.maxLength(150)],
            isDefault: [false, Validators.required]
        });
    }

    get controls() {
        return this.nAddressForm.controls;
    }

    ClearAutocomplete() {
        this.autocompleteItems = [];
        this.autocomplete.input = '';
    }

    UpdateSearchResults() {
        if (this.nAddressForm.get('direccion').value == '') {
            this.autocompleteItems = [];
            return;
        }
        this.GoogleAutocomplete.getPlacePredictions({input: this.nAddressForm.get('direccion').value, componentRestrictions: {country: 'hn'}},
            (predictions, status) => {
                this.autocompleteItems = [];
                this.zone.run(() => {
                    predictions.forEach((prediction) => {
                        this.autocompleteItems.push(prediction);
                    });
                });
            });
    }

    SelectSearchResult(item) {
        //AQUI PONDREMOS LO QUE QUERAMOS QUE PASE CON EL PLACE ESCOGIDO, GUARDARLO, SUBIRLO A FIRESTORE.
        //HE AÑADIDO UN ALERT PARA VER EL CONTENIDO QUE NOS OFRECE GOOGLE Y GUARDAMOS EL PLACEID PARA UTILIZARLO POSTERIORMENTE SI QUEREMOS.
        this.nAddressForm.get('direccion').setValue(item.description)
        this.autocompleteItems = [];
    }

    save() {
        this.presentLoading()
        const branchSubs = this.branchesService.newBranch(this.nAddressForm.value)
            .subscribe(response => {
                branchSubs.unsubscribe()
                this.loadingController.dismiss()
                this.openSuccessDelivery(response.message)
            });
    }

    async openSuccessDelivery(msg) {
        const alert = await this.atrCtrl.create({
            header: '¡Éxito!',
            message: msg,
            buttons: ['OK']
        });

        await alert.present();

        alert.onDidDismiss().then(() => {
            this.navParamsService.setData({create:true})
            this.navCtrl.navigateBack('my-addresses');
        });
    }

    async openConfirmSave() {
        const alert = await this.atrCtrl.create({
            header: 'Confirmar Registro',
            message: '¿Quieres confirmar el registro de la dirección?',
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
                        this.save();
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

}
