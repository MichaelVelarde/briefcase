import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Cliente, firebaseUrls } from 'src/app/models';
import { ApiService } from 'src/app/services/api.service';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-nuevo-cliente',
  templateUrl: './nuevo-cliente.page.html',
  styleUrls: ['./nuevo-cliente.page.scss'],
})
export class NuevoClientePage implements OnInit {
  public client : Cliente;
  public nombre : string = "";
  public telefono : string = "";
  public ciudad : string = "";
  public nit : string = "Sin Nit";
  public editCLient = false;
  constructor(private router: Router, private apiService : ApiService, private alertController: AlertController,private storage: Storage) { }

  async ngOnInit() {
    if(window.location.href.includes('editClient')){
      await this.getDataStorage();
      this.editCLient = true;
    }
  }

  async getDataStorage(){
    await this.storage.get('client').then((client) => {
      this.client = client;
    });
    this.nombre = this.client.nombre;
    this.telefono = this.client.telefono;
    this.ciudad = this.client.ciudad;
    this.nit = this.client.nit;
  }

  async editClient(){
    if(this.nombre == "" || this.telefono == ""||this.ciudad == ""  ||this.nit == ""  ){
      alert("Debes llenar todos los datos.");
    }
    else{
      const key = this.client.id;
      this.client = {
        nombre: this.nombre, 
        telefono: this.telefono,
        ciudad: this.ciudad,
        nit: this.nit,
      };
      this.apiService.addLog('Edito el cliente: ' + this.client.nombre);
      await this.apiService.update(firebaseUrls.clientes,key, this.client).then( ()=>{
        this.alertController.create({
          subHeader: 'El cliente se actualizo correctamente!'  ,
          buttons: [
            {
              text: 'Continuar',
              handler: () => {
                this.router.navigate(['clientes',{nClient: this.client.nombre}])
              }
            },
          ]
        }).then(res => {
          res.present();
        });
      })
      
    }
  }
  async saveClient(){
    if(this.nombre == "" || this.telefono == ""||this.ciudad == ""  ||this.nit == ""  ){
      alert("Debes llenar todos los datos.");
    }
    else{
      this.client = {
        nombre: this.nombre, 
        telefono: this.telefono,
        ciudad: this.ciudad,
        nit: this.nit,
      };
      this.apiService.addLog('Agrego el cliente: ' + this.client.nombre);
      await this.apiService.add(firebaseUrls.clientes, this.client).then( ()=>{
        this.alertController.create({
          subHeader: 'El cliente se creo correctamente!'  ,
          buttons: [
            {
              text: 'Continuar',
              handler: () => {
                this.router.navigate(['clientes',{nClient: this.client.nombre}])
              }
            },
          ]
        }).then(res => {
          res.present();
        });
      })
      
    }
  }
  

}
