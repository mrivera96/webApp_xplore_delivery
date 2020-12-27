import {Component, NgZone, OnInit} from '@angular/core';
import {Branch} from '../../models/branch';
import {NavParamService} from '../../services/nav-param.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Dialogs} from '@ionic-native/dialogs/ngx';
import {AlertController, LoadingController, NavController} from '@ionic/angular';
import {Router} from '@angular/router';
import {BranchOfficeService} from '../../services/branch-office.service';
declare var google;
@Component({
  selector: 'app-edit-adress',
  templateUrl: './edit-address.page.html',
  styleUrls: ['./edit-address.page.scss'],
})
export class EditAddressPage implements OnInit {
  currentAddress: Branch = {}
  edAddressForm: FormGroup
  GoogleAutocomplete: any;
  autocomplete: { input: string; };
  autocompleteItems: any[];

  constructor(
      private navParamsService: NavParamService,
      private formBuilder: FormBuilder,
      public zone: NgZone,
      public dialog: Dialogs,
      public loadingController: LoadingController,
      public atrCtrl: AlertController,
      private router: Router,
      private branchesService: BranchOfficeService,
      public navCtrl: NavController
  ) {
    this.currentAddress = this.navParamsService.getNavData()
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = {input: ''};
    this.autocompleteItems = [];

  }

  ngOnInit() {
    this.initialize()
  }

  initialize(){
    this.edAddressForm = this.formBuilder.group({
      idSucursal: [this.currentAddress.idSucursal],
      nomSucursal: [this.currentAddress.nomSucursal, Validators.required],
      numTelefono: [this.currentAddress.numTelefono, [Validators.minLength(9), Validators.maxLength(9)]],
      direccion: [this.currentAddress.direccion, Validators.required],
      isDefault: [+this.currentAddress.isDefault, Validators.required],
      instrucciones:['']
    });
  }

  get controls(){
    return this.edAddressForm.controls
  }

  ClearAutocomplete() {
    this.autocompleteItems = [];
    this.autocomplete.input = '';
  }

  UpdateSearchResults() {
    if (this.edAddressForm.get('direccion').value == '') {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions({input: this.edAddressForm.get('direccion').value, componentRestrictions: {country: 'hn'}},
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
    this.edAddressForm.get('direccion').setValue(item.description)
    this.autocompleteItems = [];
  }

  save() {
    this.presentLoading()
    const branchSubs = this.branchesService.editBranch(this.edAddressForm.value)
        .subscribe(response => {
          branchSubs.unsubscribe()
          this.loadingController.dismiss()
          this.openSuccessDelivery(response.message)
        }, error => {
          error.subscribe(error => {
            this.loadingController.dismiss();
            this.openErrorAlert(error.statusText)
          })
        });
  }

  async openSuccessDelivery(msg) {
    const alert = await this.atrCtrl.create({
      header: 'Éxito!',
      message: msg,
      buttons: ['OK']
    });

    await alert.present();

    alert.onDidDismiss().then(() => {
      this.navParamsService.setData({edited:true})
      this.navCtrl.navigateBack('my-addresses')
    });
  }

  async openConfirmSave() {
    const alert = await this.atrCtrl.create({
      header: 'Confirmar Registro',
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
      buttons: ['OK']
    });

    await alert.present();

    alert.onDidDismiss().then(() => {
      alert.dismiss()
    });
  }

}
