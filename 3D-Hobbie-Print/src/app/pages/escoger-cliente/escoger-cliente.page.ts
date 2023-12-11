import { Component, OnInit } from '@angular/core';
import { Cliente, Cotizacion, firebaseUrls, Venta } from 'src/app/models';
import {  Router } from '@angular/router';
import { map } from 'rxjs/operators';

import { Storage } from '@ionic/storage-angular';
import { ApiService } from 'src/app/services/api-firebase.service';

@Component({
  selector: 'app-escoger-cliente',
  templateUrl: './escoger-cliente.page.html',
  styleUrls: ['./escoger-cliente.page.scss'],
})
export class EscogerClientePage implements OnInit {
  public venta : Venta;
  public paso : number;
  public isAproforma : boolean;
  public clients: Cliente[];
  public donwloadingDataB = true;
  public clientesFiltrados: Cliente[];

  constructor(private router: Router, private storage: Storage , private apiService: ApiService) { }

  async ngOnInit() {
    this.donwloadingDataB = true;
    await this.getDataStorage();
    await this.getClientes();
  }
  async getDataStorage(){
    await this.storage.get('venta').then((venta) => {
      this.venta = venta;
    });
  }
  search(){
    this.clientesFiltrados =[];
    var filtro = (<HTMLInputElement>document.getElementById("filtroBusqueda2")).value;
    var inputValue = (<HTMLInputElement>document.getElementById("textInput2")).value;
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
    const sub= this.apiService.getAll(firebaseUrls.clientes).snapshotChanges().pipe(
      map(cambiar=> cambiar.map(c => ({
        idDb: c.payload.key, ... c.payload.val()
      })))
    ).subscribe(data =>{
      this.clients =data;
      this.clientesFiltrados = this.clients;
      this.donwloadingDataB = false;
      sub.unsubscribe();
    });
  }
  async setClient(keyClient : string , name : string ){
      this.venta.keyCliente = keyClient;
      await this.storage.set('venta', this.venta);
      await this.storage.set('clientName', name);
      this.router.navigate(['crear-venta',{client: name}])
    
   }
}
