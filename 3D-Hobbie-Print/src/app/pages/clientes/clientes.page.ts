import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Cliente, firebaseUrls } from 'src/app/models';


import { Storage } from '@ionic/storage-angular';
import { AlertController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api-firebase.service';
import { Subscription, SubscriptionLike } from 'rxjs';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.page.html',
  styleUrls: ['./clientes.page.scss'],
})
export class ClientesPage implements OnInit {
  public donwloadingDataB = true;
  public nextId : number = 1;
  public clients: Cliente[];
  public clientesFiltrados: Cliente[];

  constructor(private alertController: AlertController, private router: Router, private apiService:  ApiService ,private storage: Storage) { }

  async ngOnInit() {
    this.donwloadingDataB = true;
    await this.getClientes();
  }
  async navegarCreate(){
    await this.storage.create();
    await this.storage.set('idNextClient', this.nextId);
    this.router.navigate(['crear-cliente',{createClient: this.clients.length}]);
  }

  async navegarEdit(client : Cliente){
    await this.storage.create();
    await this.storage.set('client', client);
    this.router.navigate(['crear-cliente',{editClient: client.nombre}]);
  }

  alertaBorrarClient(client : Cliente){
    this.alertController.create({
        subHeader: 'Seguro que desea borrar el cliente: ' +client.nombre  ,
        buttons: [
          {
            text: 'Aceptar',
            handler: async () => {
              this.donwloadingDataB = true;
              await  this.borrarCliente(client.idDb);
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

  async borrarCliente(keyClient : string){
    await this.apiService.remove(firebaseUrls.clientes , keyClient);
    this.donwloadingDataB = false;
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
    this.apiService.getAll(firebaseUrls.clientes).snapshotChanges().pipe(
      map(cambiar=> cambiar.map(c => ({
        idDb: c.payload.key, ... c.payload.val()
      })))
    ).subscribe(data =>{
      this.clients =data;
      if(this.clients.length>0)
        this.nextId = this.clients[this.clients.length-1].id +1;
      this.clientesFiltrados = this.clients;
      this.donwloadingDataB = false;
    });

  }

}
