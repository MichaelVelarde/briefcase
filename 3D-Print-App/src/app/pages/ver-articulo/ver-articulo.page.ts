import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Almacen, firebaseUrls, Inventario } from 'src/app/models';
import { ApiService } from 'src/app/services/api.service';
import { Storage } from '@ionic/storage-angular';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { LoginUserService } from 'src/app/services/login-user.service';

@Component({
  selector: 'app-ver-articulo',
  templateUrl: './ver-articulo.page.html',
  styleUrls: ['./ver-articulo.page.scss'],
})
export class VerArticuloPage implements OnInit {
  public item?: Inventario;
  public almacenes : Almacen[];
  public donwloadingDataB  = true;
  public activeUserAdmin = false;
  
  constructor(private userService : LoginUserService ,private router: Router,public alertController: AlertController,private apiService:  ApiService,private storage: Storage) { }

  async ngOnInit() {
    this.activeUserAdmin = this.userService.getUsuario().admin;
    this.donwloadingDataB  = true;
    this.getStorage();
    this.getAlmacenes();
    //console.log(this.item);
  }
  async getStorage(){
    await this.storage.get('item').then((item) => {
      this.item = item;
    });
  }
  async getAlmacenes(){
    const aux = this.apiService.getAll(firebaseUrls.almacenes).snapshotChanges().pipe(
      map(cambiar=> cambiar.map(c => ({
        idDb: c.payload.key, ... c.payload.val()
      })))
    ).subscribe(data =>{
      this.almacenes =data;
      aux.unsubscribe();
    }).add( ()=>{
      this.donwloadingDataB = false;
    })
  }
  async actualizarArticulo(){
    let key  = this.item.idDb;
    delete this.item.idDb;
    this.apiService.addLog('Edito el articulo con id: ' + this.item.id);
    await this.apiService.update( firebaseUrls.inventario, key , this.item ).then((data) => {
      this.alertController.create({
        subHeader: 'El articulo se actualizo correctamente!'  ,
        buttons: [
          {
            text: 'Continuar',
            handler: () => {
              this.router.navigate(['inventario',{updateI: this.item.id}])
            }
          },
        ]
      }).then(res => {
        res.present();
      });
      
    });
  }
  getCantidadAlmacen(key :string){
    let indexAlmacen = this.item.almacenesKeys.findIndex( id => id == key);
    if(indexAlmacen >= 0)
      return this.item.almacenesCantidades[indexAlmacen];
    else
      return 0;
  }
  editCantidadAlmacen(almacen :Almacen){
    const cantidadAntigua = this.getCantidadAlmacen(almacen.idDb);
    const index = this.item.almacenesKeys.findIndex( id => id == almacen.idDb);
    this.alertController.create({
      subHeader: 'Cantidad en el almacen ' + almacen.nombre ,
      inputs:[{
            name:'number',
            placeholder: cantidadAntigua,
            type: 'number',
            min: '0',
        }],
      buttons: [
        {
          text: 'Aceptar',
          handler: data =>{
            let nuevaCant = parseInt(data.number);
            if(index >= 0){
              if(nuevaCant > 0){
                this.item.cantTotal = this.item.cantTotal + (nuevaCant - cantidadAntigua);
                this.item.almacenesCantidades[index] = nuevaCant;
              }
              else{
                this.item.cantTotal = this.item.cantTotal  - cantidadAntigua;
                this.item.almacenesCantidades.splice(index, 1)
                this.item.almacenesKeys.splice(index, 1)
                if(this.item.almacenesKeys.length == 0){
                  this.item.almacenesKeys.push("Empty");
                  this.item.almacenesCantidades.push("Empty");
                }
              }
            }
            else{
              if(nuevaCant > 0){
                if(this.item.almacenesKeys.includes("Empty")){
                  this.item.almacenesKeys.pop();
                  this.item.almacenesCantidades.pop();
                }
                this.item.cantTotal = this.item.cantTotal + nuevaCant;
                this.item.almacenesCantidades.push(nuevaCant);
                this.item.almacenesKeys.push(almacen.idDb);
              }
            }
        }
        },
        {
          text: 'Cancelar',
        }
      ]
    }).then(res => {
      res.present();
    });
  }

  editPrecio(){
    const precioAntiguo = this.item.precio;
    this.alertController.create({
      subHeader: 'Escriba el precio que desea para: ' + this.item.nombre  ,
      inputs:[{
            name:'number',
            placeholder: precioAntiguo,
            type: 'number',
            min: '0',
        }],
      buttons: [
        {
          text: 'Aceptar',
          handler: data =>{
            let nuevoPrecio = parseInt(data.number);
            if(nuevoPrecio > 0){
              this.item.precio = ""+nuevoPrecio;
            }
            else{
              this.alertController.create({
                subHeader: 'Debe introducir un precio valido!', buttons: [{ text: 'Continuar',} ]
              }).then(res => {res.present();});
            }
        }
        },
        {
          text: 'Cancelar',
        }
      ]
    }).then(res => {
      res.present();
    });
  }
  editInversion(){
    const precioAntiguo = ""+this.item.costoInversion;
    this.alertController.create({
      subHeader: 'Escriba la inversion utilizada en: ' + this.item.nombre  ,
      inputs:[{
            name:'number',
            placeholder: precioAntiguo,
            type: 'number',
            min: '0',
        }],
      buttons: [
        {
          text: 'Aceptar',
          handler: data =>{
            let nuevoPrecio = parseInt(data.number);
            if(nuevoPrecio > 0 ){
              this.item.costoInversion = nuevoPrecio;
            }
            else
              this.alertController.create({
                subHeader: 'Debe introducir un valor de inversion valida!', buttons: [{ text: 'Continuar',} ]
              }).then(res => {res.present();});
        }
        },
        {
          text: 'Cancelar',
        }
      ]
    }).then(res => {
      res.present();
    });
  }

}
