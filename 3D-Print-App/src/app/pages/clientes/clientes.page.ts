import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Cliente, firebaseUrls } from 'src/app/models';
import { ApiService } from 'src/app/services/api.service';

import { Storage } from '@ionic/storage-angular';
import { AlertController } from '@ionic/angular';
import { LoginUserService } from 'src/app/services/login-user.service';
@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.page.html',
  styleUrls: ['./clientes.page.scss'],
})
export class ClientesPage implements OnInit {
  public donwloadingDataB = true;
  public clients: Cliente[];
  public clientesFiltrados: Cliente[];
  public activeUserAdmin = false;
  constructor( private userService : LoginUserService ,private alertController: AlertController, private router: Router, private apiService:  ApiService ,private storage: Storage ) { }

  async ngOnInit() {
    this.activeUserAdmin = this.userService.getUsuario().admin;
    this.donwloadingDataB = true;
    await this.getClientes();
  }
  navegarCreate(){
    this.router.navigate(['nuevo-cliente',{createClient: this.clients.length}]);
  }

  async navegarEdit(client : Cliente){
    await this.storage.create();
    await this.storage.set('client', client);
    this.router.navigate(['nuevo-cliente',{editClient: client.nombre}]);
  }
  async borrarClient(client : Cliente){
    await this.alertController.create({
        subHeader: 'Seguro que desea borrar el cliente: ' +client.nombre  ,
        buttons: [
          {
            text: 'Aceptar',
            handler: () => {
               this.apiService.addLog('Borrro el cliente: ' + client.nombre);
               this.apiService.remove(firebaseUrls.clientes, client.id ).then((data) => {
                this.alertController.create({
                  subHeader: 'El cliente se elimino correctamente!'  ,
                  buttons: [
                    {
                      text: 'Continuar',
                      handler: () => {
                        this.getClientes(); 
                      }
                    },
                  ]
                }).then(res => {
                  res.present();
                });
                
              });
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

  search(){
    this.clientesFiltrados =[];
    //var filtro = (<HTMLInputElement>document.getElementById("filtroBusquedaClient")).value;
    //var inputValue = (<HTMLInputElement>document.getElementById("textInputClient")).value;
    var aux = document.getElementsByName("filtroBusquedaClient");
    var filtro = (<HTMLInputElement>aux.item(aux.length-1)).value;
    var aux2 = document.getElementsByName("textInputClient");
    var inputValue = (<HTMLInputElement>aux2.item(aux2.length-1)).value;

    for (let i = 0; i < this.clients.length; i++){
      if(filtro == "name" && this.clients[i].nombre.toLowerCase().includes( inputValue.toLowerCase())){
        this.clientesFiltrados.push(this.clients[i]);
      }
      if(filtro == "tel" && this.clients[i].telefono.includes(inputValue) ){
        this.clientesFiltrados.push(this.clients[i]);
      }
    }
  }
  async getClientes(){
    const aux = this.apiService.getAll(firebaseUrls.clientes).snapshotChanges().pipe(
      map(cambiar=> cambiar.map(c => ({
        id: c.payload.key, ... c.payload.val()
      })))
    ).subscribe(data =>{
      this.clients =data;
      aux.unsubscribe();
    }).add( () =>{
      this.clientesFiltrados = this.clients;
      this.donwloadingDataB = false;
    }); 
  }

}
