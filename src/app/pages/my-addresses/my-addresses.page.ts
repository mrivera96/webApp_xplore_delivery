import { Component, OnInit } from '@angular/core';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import { LoadingController } from '@ionic/angular';
import { Branch } from 'src/app/models/branch';
import { BranchOfficeService } from 'src/app/services/branch-office.service';
import {NavParamService} from '../../services/nav-param.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-my-adresses',
  templateUrl: './my-adresses.page.html',
  styleUrls: ['./my-adresses.page.scss'],
})
export class MyAdressesPage implements OnInit {
  myAddresses: Branch [] = []

  constructor(
    private branchesService: BranchOfficeService,
    public loadingController: LoadingController,
    private dialogs: Dialogs,
    private navParamsService: NavParamService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadData()
  }

  loadData(){
    this.presentLoading();
    const branSubs = this.branchesService
      .getBranchOffices().subscribe(response => {
        this.myAddresses = response.data
        this.loadingController.dismiss();
        branSubs.unsubscribe()
      }, error => {
        this.loadingController.dismiss();

        this.openErrorDialog('Ha ocurrido un error al cargar los datos. Intenta de nuevo recargando la página.')
        branSubs.unsubscribe()
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

  editAddress(address){
    this.navParamsService.setData(address)
    this.router.navigate(['edit-address'])
  }

}
