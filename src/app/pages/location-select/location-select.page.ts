import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Geolocation, GeolocationOptions, Geoposition } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import { BranchOfficeService } from 'src/app/services/branch-office.service';
import { Branch } from 'src/app/models/branch';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AlertController, LoadingController } from '@ionic/angular';
import { NavParamService } from 'src/app/services/nav-param.service';

declare var google;
@Component({
  selector: 'app-new-transfer',
  templateUrl: './new-transfer.page.html',
  styleUrls: ['./new-transfer.page.scss'],
})
export class NewTransferPage implements OnInit {
  locationOption
  myCurrentLocation: Geoposition
  myBranchOffices: Branch[]
  loaders = {
    'loadingData': false,
    'loadingSubmit': false,
    'loadingCalculatingDist': false
  }
  finalRecogida: string = ''
  finalDestino: string = ''
  //currCustomer: Customer
  directionsRenderer
  directionsService
  //myBranchOffices: Branch[] = []
  @ViewChild('originCords') originCords: ElementRef
  @ViewChild('destinationCords') destinationCords: ElementRef
  options: GeolocationOptions;
  placesDestination = []
  prohibitedDistance = false
  prohibitedDistanceMsg = ''
  gcordsOrigin = false
  gcordsDestination = false
  defaultBranch
  searchingOrigin = false
  searchingDest = false
  locationForm: FormGroup
  @ViewChild('map', { static: false }) mapElement: ElementRef
  map: any
  address: string
  lat: string
  long: string
  autocomplete: { input: string; }
  autocompleteItems: any[]
  location: any
  placeid: any
  GoogleAutocomplete: any
  GoogleAutocomplete2: any
  autocompleteItemsDest: any[]
  autocompleteDest: { input: string; }
  title: string
  confirmedLocation = false
  befDistance = 0
  befTime = 0
  befCost = 0.00


  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    public zone: NgZone,
    private dialogs: Dialogs,
    private branchService: BranchOfficeService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    public atrCtrl: AlertController,
    public loadingController: LoadingController,
    private navParamService: NavParamService
  ) {
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.GoogleAutocomplete2 = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
    this.autocompleteDest = { input: '' };
    this.autocompleteItemsDest = [];
    this.activeRoute.paramMap.subscribe(params => {
      this.title = params.get('action')
    })
  }

  ngOnInit() {
    this.initalize()
    this.loadMap()
    this.loadData()
  }

  initalize() {
    this.locationForm = this.formBuilder.group({
      puntoRecogida: ['', [Validators.required]],
      puntoDestino: ['', [Validators.required]]
    })

    this.directionsRenderer = new google.maps.DirectionsRenderer
    this.directionsService = new google.maps.DirectionsService
    this.locationOption = 1
  }

  loadData() {
    this.presentLoading()
    const branchSubscription = this.branchService.getBranchOffices().subscribe(response => {
      this.myBranchOffices = response.data
      this.myBranchOffices.forEach(bOffice => {
        if (bOffice.isDefault == true) {
          this.locationOption = 3
          this.defaultBranch = bOffice.idSucursal
          this.formControls.puntoRecogida.setValue(bOffice.direccion)
          this.finalRecogida = bOffice.direccion
          this.autocomplete.input = bOffice.direccion
        }
      })
      this.loadingController.dismiss()
      branchSubscription.unsubscribe()
    })
  }

  get formControls() {
    return this.locationForm.controls
  }

  getUserPosition() {
    this.options = {
      enableHighAccuracy: true
    };

    this.geolocation.getCurrentPosition(this.options).then((pos: Geoposition) => {
      this.myCurrentLocation = pos;
    }, (err: PositionError) => {
      console.log("error : " + err.message);
    });
  }

  clearLocationField() {
    this.formControls.puntoRecogida.setValue('')
  }

  setCurrentLocationOrigin(): void {
    this.autocomplete.input = ''
    this.geolocation.getCurrentPosition().then((resp) => {
      let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      //CUANDO TENEMOS LAS COORDENADAS SIMPLEMENTE NECESITAMOS PASAR AL MAPA DE GOOGLE TODOS LOS PARAMETROS.
      this.getAddressFromCoords(resp.coords.latitude, resp.coords.longitude);
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      this.map.addListener('tilesloaded', () => {
        this.getAddressFromCoords(this.map.center.lat(), this.map.center.lng())
        this.lat = this.map.center.lat()
        this.long = this.map.center.lng()
        this.autocomplete.input = '12345'//this.lat + ', ' + this.long
      });
    }).catch((error) => {
      console.log('Error getting location', error);
    });

  }

  setLocationOption(optionValue) {

  }

  setCurrentLocationDest(checked) {
    if (!checked) {
      if (navigator) {
        navigator.geolocation.getCurrentPosition(function () {
        }, function () {
        }, {})
        navigator.geolocation.getCurrentPosition(pos => {
          const destCords = Number(pos.coords.latitude) + ',' + Number(pos.coords.longitude)
          this.formControls.puntoDestino.setValue(destCords)
        })
      } else {
        alert('Por favor activa la ubicación para esta función')
      }
    } else {
      this.formControls.puntoDestino.setValue('')
    }
  }

  setCordsOrigin() {
    this.formControls.puntoRecogida.setValue(this.originCords.nativeElement.value)
    this.gcordsOrigin = false
  }

  setCordsDestination() {
    this.formControls.puntoDestino.setValue(this.destinationCords.nativeElement.value)
    this.gcordsDestination = false
  }

  loadMap() {
    //OBTENEMOS LAS COORDENADAS DESDE EL TELEFONO.
    this.geolocation.getCurrentPosition().then((resp) => {
      let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude)
      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      //CUANDO TENEMOS LAS COORDENADAS SIMPLEMENTE NECESITAMOS PASAR AL MAPA DE GOOGLE TODOS LOS PARAMETROS.
      this.getAddressFromCoords(resp.coords.latitude, resp.coords.longitude);
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      this.map.addListener('tilesloaded', () => {
        this.getAddressFromCoords(this.map.center.lat(), this.map.center.lng())
        this.lat = this.map.center.lat()
        this.long = this.map.center.lng()
      })
    }).catch((error) => {
      console.log('Error getting location', error);
    })
  }

  getAddressFromCoords(lattitude, longitude) {
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };
    this.nativeGeocoder.reverseGeocode(lattitude, longitude, options)
      .then((result: NativeGeocoderResult[]) => {
        this.address = "";
        let responseAddress = [];
        for (let [key, value] of Object.entries(result[0])) {
          if (value.length > 0)
            responseAddress.push(value);
        }
        responseAddress.reverse();
        for (let value of responseAddress) {
          this.address += value + ", ";
        }
        this.address = this.address.slice(0, -2);
      })
      .catch((error: any) => {
        this.address = "Address Not Available!";
      });
  }

  UpdateSearchResults() {
    if (this.autocomplete.input == '') {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input, componentRestrictions: { country: 'hn' } },
      (predictions, status) => {
        this.autocompleteItems = [];
        this.zone.run(() => {
          predictions.forEach((prediction) => {
            this.autocompleteItems.push(prediction);
          });
        });
      });
  }

  //FUNCION QUE LLAMAMOS DESDE EL ITEM DE LA LISTA.
  SelectSearchResult(item) {
    //AQUI PONDREMOS LO QUE QUERAMOS QUE PASE CON EL PLACE ESCOGIDO, GUARDARLO, SUBIRLO A FIRESTORE.
    //HE AÑADIDO UN ALERT PARA VER EL CONTENIDO QUE NOS OFRECE GOOGLE Y GUARDAMOS EL PLACEID PARA UTILIZARLO POSTERIORMENTE SI QUEREMOS.
    this.autocomplete.input = item.description
    this.autocompleteItems = []
  }


  //LLAMAMOS A ESTA FUNCION PARA LIMPIAR LA LISTA CUANDO PULSAMOS IONCLEAR.
  ClearAutocomplete() {
    this.autocompleteItems = []
    this.autocomplete.input = ''
  }

  UpdateSearchResultsDest() {
    if (this.autocompleteDest.input == '') {
      this.autocompleteItemsDest = [];
      return;
    }
    this.GoogleAutocomplete2.getPlacePredictions({ input: this.autocompleteDest.input, componentRestrictions: { country: 'hn' } },
      (predictions, status) => {
        this.autocompleteItemsDest = [];
        this.zone.run(() => {
          predictions.forEach((prediction) => {
            this.autocompleteItemsDest.push(prediction);
          });
        });
      });
  }

  //FUNCION QUE LLAMAMOS DESDE EL ITEM DE LA LISTA.
  SelectSearchResultDest(item) {
    //AQUI PONDREMOS LO QUE QUERAMOS QUE PASE CON EL PLACE ESCOGIDO, GUARDARLO, SUBIRLO A FIRESTORE.
    //HE AÑADIDO UN ALERT PARA VER EL CONTENIDO QUE NOS OFRECE GOOGLE Y GUARDAMOS EL PLACEID PARA UTILIZARLO POSTERIORMENTE SI QUEREMOS.
    this.autocompleteDest.input = item.description
    this.autocompleteItemsDest = []
  }


  //LLAMAMOS A ESTA FUNCION PARA LIMPIAR LA LISTA CUANDO PULSAMOS IONCLEAR.
  ClearAutocompleteDest() {
    this.autocompleteItemsDest = []
    this.autocompleteDest.input = ''
  }

  calculateAndDisplayRoute() {
    const that = this
    this.directionsService.route({
      origin: this.autocomplete.input,
      destination: this.autocompleteDest.input,
      travelMode: 'DRIVING'
    }, (response, status) => {
      if (status == 'OK') {
        that.directionsRenderer.setDirections(response);
        this.confirmedLocation = true
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    })
    this.directionsRenderer.setMap(this.map)

  }

  async openErrorDialog(msg) {
    const alert = await this.atrCtrl.create({
      header: 'Ha ocurrido un error',
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }

  continue() {
    this.router.navigate(['category-select'])
  }

  calculatedistanceBefore() {
    if (this.autocomplete.input != '' && this.autocompleteDest.input != '') {
      this.befDistance = 0
      this.befTime = 0
      this.prohibitedDistance = false
      this.loaders.loadingCalculatingDist = true

      const distanceSubscription = this.http.post<any>(`${environment.apiUrl}`, {
        function: 'calculateDistance',
        salida: this.autocomplete.input,
        entrega: this.autocompleteDest.input,
        tarifa: 0
      }).subscribe((response) => {
        this.loaders.loadingCalculatingDist = false
        this.befDistance = Number(response.distancia.split(" ")[0])
        this.befTime = response.tiempo
        distanceSubscription.unsubscribe()
      }, error => {
        if (error.subscribe()) {
          error.subscribe(error => {
            this.prohibitedDistanceMsg = error.statusText
            this.prohibitedDistance = true
            this.openErrorDialog(this.prohibitedDistanceMsg)
            this.loaders.loadingCalculatingDist = false
          })
        }
        distanceSubscription.unsubscribe()

      })
    }

  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Por favor espera un momento...',
      translucent: true,
    });
    return await loading.present();
  }

  goCategorySelect() {
    const data = {
      origin: this.autocomplete.input,
      destination: this.autocompleteDest.input,
      distance: this.befDistance,
      time: this.befTime
    }
    
    this.navParamService.setData(data)
    this.router.navigate(['category-select', this.title])
  }

}
