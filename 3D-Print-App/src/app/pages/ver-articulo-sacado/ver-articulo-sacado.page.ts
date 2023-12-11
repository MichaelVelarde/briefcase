import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Storage } from '@ionic/storage-angular';
import { Almacen, firebaseUrls, Inventario, ItemSacado } from 'src/app/models';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-ver-articulo-sacado',
  templateUrl: './ver-articulo-sacado.page.html',
  styleUrls: ['./ver-articulo-sacado.page.scss'],
})
export class VerArticuloSacadoPage implements OnInit {
  public itemSacado?: ItemSacado;
  public almacenes : Almacen[];
  public items : Inventario[];
  public donwloadingDataB = true;

  constructor(private storage: Storage, private apiService:  ApiService) { }

  async ngOnInit() {
    this.donwloadingDataB = true;
    await this.getStorage();
    await this.getAlmacenes();
    await this.inicarItems();
  }
  async getStorage(){
    await this.storage.get('itemSacado').then((itemSacado) => {
      this.itemSacado = itemSacado;
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
    })
  }
  async inicarItems(){
    this.items = [];
    for (let i = 0; i < this.itemSacado.articuloskeys.length; i++){
       await this.getitems(this.itemSacado.articuloskeys[i]);
    }
    this.donwloadingDataB = false; 
  }
  async getitems(key : string){
    let aux = this.apiService.getOne(firebaseUrls.inventario , key).snapshotChanges().pipe(
      map(c=>  ({
        idDb: c.payload.key, ... c.payload.val()
      })) 
    )
    .subscribe( data => {
      this.items.push(data);
      aux.unsubscribe();
    });
  }
  getNombreAlmacen(i : number, j : number){
    return this.almacenes.find(almacen => almacen.idDb == this.itemSacado.articulosKeysCadaLocal[i][j] ).nombre;
  }
}
