import { Component, OnInit } from '@angular/core';
import {  Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Cliente, firebaseUrls, Proforma, Venta } from 'src/app/models';
import { ApiService } from 'src/app/services/api.service';

import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-escoger-cliente',
  templateUrl: './escoger-cliente.page.html',
  styleUrls: ['./escoger-cliente.page.scss'],
})
export class EscogerClientePage implements OnInit {
  public venta : Venta;
  public proforma : Proforma;
  public paso : number;
  public isAproforma : boolean;
  public clients: Cliente[];
  public clientesFiltrados: Cliente[];
  constructor(private router: Router, private storage: Storage , private apiService: ApiService ) {
    
    
  }

 async ngOnInit() {
  this.getClientes();

  if(window.location.href.includes('proforma')){
    await this.getDataStorageProforma();
    this.isAproforma = true;
  }
  else
  await this.getDataStorageVenta();
  
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
    const aux = this.apiService.getAll(firebaseUrls.clientes).snapshotChanges().pipe(
      map(cambiar=> cambiar.map(c => ({
        id: c.payload.key, ... c.payload.val()
      })))
    ).subscribe(data =>{
      this.clients =data;
      aux.unsubscribe();
    }).add( () =>{
      this.clientesFiltrados = this.clients;
    }); 
  }

  async getDataStorageVenta(){
    await this.storage.get('venta').then((venta) => {
      this.venta = venta;
    });
    if(this.venta.keyCliente != undefined){
      await this.storage.get('paso').then((numero) => {
        this.paso = numero;
      });
    }
  }
  async getDataStorageProforma(){
    await this.storage.get('proforma').then((proforma) => {
      this.proforma = proforma;
    });
    if(this.proforma.nombreCliente != undefined){
      await this.storage.get('paso').then((numero) => {
        this.paso = numero;
      });
    }
  }
  async setClient(keyClient : string , name : string , nit :string){
    if(this.isAproforma)
      this.setClientProforma(name,nit);
    else
      this.setClientVenta(keyClient,name);

  }
  async setClientProforma(name : string , nit :string ){
    if(this.proforma.nombreCliente != undefined){
      this.proforma.nombreCliente = name;
      this.proforma.nitCliente = nit;
      await this.storage.set('proforma', this.proforma);
      this.router.navigate(['crear-proforma',{client: this.paso}])
    }
    else{
      this.proforma.nombreCliente = name;
      this.proforma.nitCliente= nit;
      this.proforma.articulosCant = [];
      this.proforma.articulosPrecios = [];
      this.proforma.articulosids = [];
      this.proforma.articulosNombres = [];
      await this.storage.set('proforma', this.proforma);
      this.router.navigate(['crear-proforma',{client: 1}])
    }


  }

 async setClientVenta(keyClient : string , name : string ){
  if(this.venta.keyCliente != undefined){
    this.venta.keyCliente = keyClient;
    await this.storage.set('client', name);
    await this.storage.set('venta', this.venta);
    this.router.navigate(['nueva-venta',{client: this.paso}])
  }
  else{
    this.venta.keyCliente = keyClient;
    this.venta.articulosCant= [];
    this.venta.articulosCostoInversion = [];
    this.venta.articulosCantCadaLocal= [];
    this.venta.articulosLocalesKeys= [];
    this.venta.articulosDescuentos= [];
    this.venta.articulosPrecios= [];
    this.venta.articuloskeys= [];
    await this.storage.set('client', name);
    await this.storage.set('venta', this.venta);
    this.router.navigate(['nueva-venta',{client: 1}])
  }
 }
}
