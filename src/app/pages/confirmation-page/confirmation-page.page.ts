import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { NavParamService } from 'src/app/services/nav-param.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-confirmation-page',
  templateUrl: './confirmation-page.page.html',
  styleUrls: ['./confirmation-page.page.scss'],
})
export class ConfirmationPagePage implements OnInit {
  data: any
  confirmationCod = []

  constructor(
    private navParams: NavParamService,
    private http: HttpClient,
    private authService: AuthService,
    public atrCtrl: AlertController,
    public loadingControler: LoadingController,
    public navCtrl: NavController
  ) { 
    this.data = this.navParams.getNavData()
  }

  ngOnInit() {
    this.sendCode()
  }

  sendCode(){
    const code = this.data.code
    const codeSubsc = this.http.get(`${environment.apiUrl}`, {params: {
      function: 'sendSMS',
      telefono: this.data.form.numTelefono.replace('-',''),
      sms: 'XPLORE DELIVERY: Tu codigo de verificacion es: ' + code
    }})
    .subscribe(response => {
      codeSubsc.unsubscribe()
    },error=>{
      
        codeSubsc.unsubscribe()
        console.log(error)
      
    })
  }

  confirmCode(){
    if(this.confirmationCod.length == 4){
      const vCode = this.confirmationCod[0] + '' + this.confirmationCod[1] + '' + this.confirmationCod[2] + '' +this.confirmationCod[3]
      
      if(vCode == this.data.code){
        this.presentLoading()

        const authSubs = this.authService.signUp(this.data.form)
        .subscribe(response => {
          this.loadingControler.dismiss()
          this.openSuccessDelivery(response.message)

        }, error => {
          error.subscribe(error => {
            this.loadingControler.dismiss()
            this.openErrorAlert(error.statusText)
          })

        })
      }else{
        this.openErrorAlert('El código ingresado es inválido')
      }
    }
  }

  async openSuccessDelivery(msg) {
    const alert = await this.atrCtrl.create({
        header: '¡Bienvido(a)!',
        message: msg,
        buttons: ['OK']
    });

    await alert.present();

    alert.onDidDismiss().then(() => {
        this.navCtrl.navigateRoot('sign-in');
    });
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

  async presentLoading() {
    const loading = await this.loadingControler.create({
      message: 'Por favor espera un momento...',
      translucent: true,
    });
    return await loading.present();
  }

}
