import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Constantes, firebaseUrls, Venta } from 'src/app/models';
import { Storage } from '@ionic/storage-angular';
import { ApiService } from 'src/app/services/api-firebase.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-crear-venta',
  templateUrl: './crear-venta.page.html',
  styleUrls: ['./crear-venta.page.scss'],
})
export class CrearVentaPage implements OnInit {
  public donwloadingDataB = true;
  public venta?: Venta;
  public nombre : string = "";
  public socios = ['Chio' , 'Aho' , 'Ero'];
  public factura = false;
  public nameClient = "Venta para la tienda";
  
  constructor(private apiService:  ApiService,public alertController: AlertController, private router: Router,private storage: Storage) { }

  async ngOnInit() {
    this.donwloadingDataB = true;
    await this.getConstantes();
    await this.getDataStorage();
  }

  async getConstantes(){
    var constantes : Constantes;
    const sub = this.apiService.getOne(firebaseUrls.constantes, firebaseUrls.keyConstantes).snapshotChanges().pipe(
      map(c=>  ({
        idDb: c.payload.key, ... c.payload.val()
      })) 
    )
    .subscribe( async data => {
      constantes = data;
      this.socios = constantes.socios;
      sub.unsubscribe();
    })
   
  }

  async getDataStorage(){
    await this.storage.get('venta').then((venta) => {
      this.venta = venta;
    });
    if(this.venta.keyCliente != undefined){
      await this.storage.get('clientName').then((name) => {
        this.factura = this.venta.factura;
        this.nombre = this.venta.nombre;
        this.nameClient = name
      });
    }
    this.donwloadingDataB = false;
  }

  async escogerCliente(){
  this.venta.factura = this.factura;
  this.venta.nombre = this.nombre;
   await this.storage.set('venta', this.venta);
   this.router.navigateByUrl("/escoger-cliente")
  }

  async agregarVenta(){
    if(this.nombre == " ")
      this.alertController.create({
        subHeader: 'Debe llenar el campo => nombre'  ,
        buttons: [
          {
            text: 'cerrar',
          },
        ]
      }).then(res => {
        res.present();
      });
    else{
    this.venta.keysModelo3D = ['Empty'];
    this.venta.precio = 0;
    this.venta.costo = 0;
    this.venta.factura = this.factura;
    this.venta.nombre = this.nombre;
    var aux = document.getElementsByName("cotizadorSocio");
    var valorCotizador = (<HTMLInputElement>aux.item(aux.length-1)).value;
    this.venta.realizadaPor = valorCotizador;
    this.venta.seEntrego = false;
    this.venta.fechaEntrega = "Sin fecha";
    this.venta.precioPintado = 0;
    if ( this.nameClient == "Venta para la tienda")
      this.venta.keyCliente = "Pagina Web";
    await this.apiService.add(firebaseUrls.ventas, this.venta ).then((data) => {
      this.alertController.create({
        subHeader: 'La venta '+ this.venta.nombre + ' se creo correctamente!'  ,
        buttons: [
          {
            text: 'Continuar',
            handler: () => {
              this.venta.id = this.venta.id +1;
              this.router.navigate(['venta',{nVenta: this.venta.id}])
            }
          },
        ]
      }).then(res => {
        res.present();
      });
      
    });
    }

  }

}
