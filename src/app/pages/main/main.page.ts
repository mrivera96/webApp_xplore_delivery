import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleMap, GoogleMaps, GoogleMapsAnimation, GoogleMapsEvent, Marker, MyLocation } from '@ionic-native/google-maps';
import { Platform } from '@ionic/angular';
import { Customer } from 'src/app/models/customer';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  map: GoogleMap;
  currentUser: Customer
  constructor(
    private platform: Platform,
    private authService: AuthService,
    private router: Router
  ) { 
    this.platform.backButton.subscribeWithPriority(10, () => {
      
    })
  }

  ngOnInit() {
    /* await this.platform.ready();
    await this.loadMap();
    await this.localizar() */
    this.currentUser = this.authService.currentUserValue.cliente
  }

  loadMap() {
    // Esta función inicializa la propiedad de clase
    // map
    // que va a contener el control de nuestro mapa de google

    // Para crear nuestro mapa debemos enviar como parametros
    // el id del div en donde se va a renderizar el mapa (paso anterior)
    // y las opciones que configuran nuestro mapa
    this.map = GoogleMaps.create("map_canvas", {
      camera: {
        target: {
          lat: -2.1537488,
          lng: -79.8883037
        },
        zoom: 18,
        tilt: 30
      }
    });
  }

  async localizar() {
    // Limpiamos todos los elementos de nuestro mapa
    this.map.clear();

    // Ejecutamos el método getMyLocation de nuestra propiedad de clase
    // map
    // para obtener nuestra ubicación actual
    this.map
      .getMyLocation()
      .then((location: MyLocation) => {

        // Movemos la camara a nuestra ubicación con una pequeña animación
        this.map.animateCamera({
          target: location.latLng,
          zoom: 17,
          tilt: 30
        });

        // Agregamos un nuevo marcador
        let marker: Marker = this.map.addMarkerSync({
          title: "Estoy aquí!",
          snippet: "This plugin is awesome!",
          position: location.latLng,
          animation: GoogleMapsAnimation.BOUNCE
        });

        // Mostramos un InfoWindow
        marker.showInfoWindow();

        // Podemos configurar un evento que se ejecute cuando
        // se haya dado clic
        marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
          
        });
      })
      .catch(error => {
        // En caso de que haya un problema en obtener la
        // ubicación
        
        console.log(error.error_message);
      });
  }
  showAlert(){
    alert('Clicked')
  }

  onLogOut(){
    this.authService.logout().subscribe(data => {
      this.router.navigate(['login'])
    })
    
  }
  

}
