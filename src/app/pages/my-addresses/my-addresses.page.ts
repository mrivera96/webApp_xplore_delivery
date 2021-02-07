import { Component, OnInit } from '@angular/core';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import { LoadingController, NavController } from '@ionic/angular';
import { Branch } from 'src/app/models/branch';
import { BranchOfficeService } from 'src/app/services/branch-office.service';
import { NavParamService } from '../../services/nav-param.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-my-adresses',
    templateUrl: './my-addresses.page.html',
    styleUrls: ['./my-addresses.page.scss'],
})
export class MyAddressesPage implements OnInit {
    myAddresses: Branch[] = [];

    constructor(
        private branchesService: BranchOfficeService,
        public loadingController: LoadingController,
        private dialogs: Dialogs,
        private navParamsService: NavParamService,
        private router: Router,
        public navCtrl: NavController
    ) {
    }

    ngOnInit() {
        this.loadData();
    }

    ionViewWillEnter() {
        if (this.navParamsService.getNavData().edited || this.navParamsService.getNavData().create) {
            this.loadData();
        }
    }

    loadData() {
        this.presentLoading();
        const branSubs = this.branchesService
            .getBranchOffices().subscribe(response => {
                this.myAddresses = response.data;
                this.loadingController.dismiss();
                branSubs.unsubscribe();
            }, error => {
                this.loadingController.dismiss();

                this.openErrorDialog('Ha ocurrido un error al cargar los datos. Intenta de nuevo recargando la página.');
                branSubs.unsubscribe();
            });
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

    editAddress(address) {
        this.navParamsService.setData(address);
        this.navCtrl.navigateForward('edit-address');
    }

}
