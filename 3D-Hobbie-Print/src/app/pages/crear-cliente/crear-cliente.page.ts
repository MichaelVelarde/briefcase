import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Cliente, firebaseUrls } from 'src/app/models';
import { Storage } from '@ionic/storage-angular';
import { ApiService } from 'src/app/services/api-firebase.service';

@Component({
  selector: 'app-crear-cliente',
  templateUrl: './crear-cliente.page.html',
  styleUrls: ['./crear-cliente.page.scss'],
})
export class CrearClientePage implements OnInit {
  public client : Cliente;
  public nombre : string = "";
  public idClient : number = 1;
  public telefono : string = "";
  public ciudad : string = "";
  public nit : string = "Sin Nit";
  public editCLient = false;
  public donwloadingDataB = true;

  constructor(private router: Router, private apiService : ApiService, private alertController: AlertController,private storage: Storage) { }

  async ngOnInit() {
    this.donwloadingDataB = true;
    await this.getDataStorage();
  }
  
  async getDataStorage(){
    if(window.location.href.includes('editClient')){
      await this.storage.get('client').then((client) => {
        this.client = client;
        this.idClient = this.client.id;
        this.nombre = this.client.nombre;
        this.telefono = this.client.telefono;
        this.ciudad = this.client.ciudad;
        this.nit = this.client.nit;
        this.editCLient = true;
        this.donwloadingDataB = false;
      });
    }
    else
      await this.storage.get('idNextClient').then((id) => {
        this.idClient = id;
        this.donwloadingDataB = false;
      });
      
  }

  async editClient(){
    if(this.nombre == "" || this.telefono == ""||this.ciudad == ""  ||this.nit == ""  ){
      this.alertController.create({
        subHeader: 'Debes llenar todos los datos.'  ,
        buttons: [
          {
            text: 'Cerrar',
          },
        ]
      }).then(res => {
        res.present();
      });
    }
    else{
      const key = this.client.idDb;
      this.client = {
        id:  this.idClient,
        nombre: this.nombre, 
        telefono: this.telefono,
        ciudad: this.ciudad,
        nit: this.nit,
      };
      await this.apiService.update(firebaseUrls.clientes, key,  this.client);
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
      
    }
  }

  async saveClient(){
    if(this.nombre == "" || this.telefono == ""||this.ciudad == ""  ||this.nit == ""  ){
      this.alertController.create({
        subHeader: 'Debes llenar todos los datos.'  ,
        buttons: [
          {
            text: 'Cerrar',
          },
        ]
      }).then(res => {
        res.present();
      });
    }
    else{
      this.client = {
        id:  this.idClient,
        nombre: this.nombre, 
        telefono: this.telefono,
        ciudad: this.ciudad,
        nit: this.nit,
      };
      this.idClient = this.idClient +1;
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
