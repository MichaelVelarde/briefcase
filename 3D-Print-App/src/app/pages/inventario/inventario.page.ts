import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Almacen, firebaseUrls, Inventario, User} from 'src/app/models';
import { ApiService } from 'src/app/services/api.service';
import { Storage } from '@ionic/storage-angular';
import { LoginUserService } from 'src/app/services/login-user.service';
import { AlertController } from '@ionic/angular';
import { Directory,  } from "@capacitor/filesystem";
import write_blob from 'capacitor-blob-writer';

const APP_DIRECTORY = Directory.Documents;

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.page.html',
  styleUrls: ['./inventario.page.scss'],
})
export class InventarioPage implements OnInit {
  public almacenes : Almacen[];
  public nextId : number;
  public inventario : Inventario [];
  public inventarioFiltrado: Inventario [];
  public donwloadingDataB = true;
  public activeUserAdmin = false;
  

  constructor( private userService : LoginUserService , private alertController: AlertController,private router: Router, private apiService:  ApiService ,private storage: Storage ) { }

  async ngOnInit() {
    this.activeUserAdmin = this.userService.getUsuario().admin;
    this.donwloadingDataB = true;
    await this.getItems();
    await this.getAlmacenes();
  }
  async navegarCreate(){
      await this.storage.create();
      await this.storage.set('item', {id : this.nextId});
      this.router.navigate(['nuevo-articulo',{createItem: this.nextId}]);
  }

  async downloadCSV(csv : any, filename : string) {
    var csvFile = new Blob([csv], {type: "text/csv"});
    await write_blob({
      directory: APP_DIRECTORY,
      path: filename,
      blob: csvFile,
      on_fallback(error) {
        console.error('error: ', error);
      }
    }).then(res => {
      this.alertController.create({
        subHeader: 'El archivo se descargo en: '+ res ,
        buttons: [
          {
            text: 'Continuar',
          },
        ]
      }).then(res => {
        res.present();
      });
    })
    this.donwloadingDataB = false;
  }
  
  async exportTableToCSV() {
    this.donwloadingDataB = true;
    const filename = 'CantidadesInventario.csv';
    const inventario = this.inventario ;
    var csv = [];
    var title = ['Id' , 'Nombre' , 'Precio' , 'Meta: _stock_at_222' , 'Meta: _stock_at_221', "Inventario"];
    var cantSAnta =0 ;
    var cantLaPaz =0 ;
    csv.push(title);  
    for (var i = 0; i < inventario.length; i++) {
        cantSAnta =this.getCantidadCiudad (inventario[i] , 'Santa Cruz');
        cantLaPaz =this.getCantidadCiudad (inventario[i] , 'La Paz')
        var row = [], 
        cols = [inventario[i].id , inventario[i].nombre.replace(',' , ' ') , inventario[i].precio,cantSAnta , cantLaPaz , cantSAnta+cantLaPaz ];
        for (var j = 0; j < cols.length; j++) 
            row.push(cols[j]);
        csv.push(row.join(","));        
    }
    // Download CSV file
    this.downloadCSV(csv.join("\r\n"), filename);
  }
  getCantidadCiudad ( item : Inventario , ciudad: string ){
    var cantidad  = 0;
    if (item.almacenesKeys[0] != 'Empty'){
      for(var i = 0; i < item.almacenesKeys.length; i++){
          let auxAlmacen = this.almacenes.find( almacen => almacen.idDb == item.almacenesKeys[i] )
          if(auxAlmacen != undefined && auxAlmacen.ciudad == ciudad)
          cantidad = cantidad + item.almacenesCantidades[i];
      }
    }
    return cantidad;
  }
  
  search(){
    this.inventarioFiltrado =[];
    //var filtro = (<HTMLInputElement>document.getElementById("filtroBusqueda")).value;
    //var inputValue = (<HTMLInputElement>document.getElementById("textInput")).value;
    var aux = document.getElementsByName("filtroBusquedaIven");
    var filtro = (<HTMLInputElement>aux.item(aux.length-1)).value;
    var aux2 = document.getElementsByName("textInputIven");
    var inputValue = (<HTMLInputElement>aux2.item(aux2.length-1)).value;

    for (let i = 0; i < this.inventario.length; i++){
      if(filtro == "name" && this.inventario[i].nombre.toLowerCase().includes( inputValue.toLowerCase())){
        this.inventarioFiltrado.push(this.inventario[i]);
      }
      if(filtro == "id" && this.inventario[i].id == parseInt(inputValue) ){
        this.inventarioFiltrado.push(this.inventario[i]);
      }
    }
  }

  filterAlmacen(idAlmacen : string ){
    if(idAlmacen == "All")
    this.inventarioFiltrado = this.inventario;
    else{
      this.inventarioFiltrado =[];
      for (let i = 0; i < this.inventario.length; i++) {
        if( this.inventario[i].almacenesKeys.includes(idAlmacen))
          this.inventarioFiltrado.push(this.inventario[i]);
      }
    }
  }
  //get Inventario
  async getItems(){
    const aux = this.apiService.getAll(firebaseUrls.inventario).snapshotChanges().pipe(
      map(cambiar=> cambiar.map(c => ({
        idDb: c.payload.key, ... c.payload.val()
      })))
    ).subscribe(data =>{
      this.inventario =data;
      aux.unsubscribe();
    }).add( () =>{
      this.inventarioFiltrado = this.inventario;
      this.nextId = this.inventario[this.inventario.length -1].id +1;
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
    }).add( () =>{
      this.donwloadingDataB = false;
    }); 
  }
  async verItem(item : Inventario){
    await this.storage.create();
    await this.storage.set('item', item);
    this.router.navigate(['ver-articulo',{id : item.id}])
  }
  async borrarItem(item : Inventario){
    await this.alertController.create({
        subHeader: 'Seguro que desea borrar el articulo: ' +item.nombre  ,
        buttons: [
          {
            text: 'Aceptar',
            handler: () => {
                this.apiService.addLog('Borro el articulo con id: ' + item.id);
                this.apiService.remove(firebaseUrls.inventario, item.idDb ).then((data) => {
                this.alertController.create({
                  subHeader: 'el articulo se elimino correctamente!'  ,
                  buttons: [
                    {
                      text: 'Continuar',
                      handler: () => {
                        this.getItems(); 
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
  /*
  async borrarAllCantidadesItems(){
    var key = "";
    var itemsAux = this.inventario;
    for (var i = 0; i < itemsAux.length; i++) {
      itemsAux[i].almacenesCantidades = ["Empty"];
      itemsAux[i].almacenesKeys = ["Empty"];
      itemsAux[i].cantTotal = 0;
      key = itemsAux[i].idDb;
      delete itemsAux[i].idDb;
      await this.apiService.update(firebaseUrls.inventario ,key, itemsAux[i])    
    }
    console.log("all done")
  }

  
  async clonarItems(){
    
    var itemAux : Inventario2;
    itemAux = {
      almacenesCantidades :[],
      almacenesKeys :[],
      cantTotal : 0,
      costoInversion : 0,
      id :0,
      nameImage : '',
      nombre : '',
      precio : '',
      unidad : ''};
    for (var i = 0; i < this.inventario.length; i++) {
      itemAux.almacenesCantidades = this.inventario[i].almacenesCantidades;
      itemAux.almacenesKeys = this.inventario[i].almacenesKeys;
      itemAux.cantTotal = this.inventario[i].cantTotal;
      itemAux.costoInversion = 0;
      itemAux.id = this.inventario[i].id;
      itemAux.nameImage = this.inventario[i].nameImage;
      itemAux.nombre = this.inventario[i].nombre;
      itemAux.precio = this.inventario[i].precio;
      itemAux.unidad = this.inventario[i].unidad;
      await this.apiService.add("Inventario" , itemAux)    
    }
    console.log("all done")
  }*/


}
