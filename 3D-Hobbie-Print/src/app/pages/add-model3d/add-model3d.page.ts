import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { firebaseUrls, Modelo3d, Parte, Venta } from 'src/app/models';
import { Storage } from '@ionic/storage-angular';
import { ApiService } from 'src/app/services/api-firebase.service';
import { map } from 'rxjs';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-add-model3d',
  templateUrl: './add-model3d.page.html',
  styleUrls: ['./add-model3d.page.scss'],
})
export class AddModel3dPage implements OnInit {
  public model3ds : Modelo3d[];
  public modelSelected : Modelo3d;
  public keysPartes = [];
  public ventaActual : Venta;
  public model3dsFiltro : Modelo3d[];
  public modelsIds : number[];
  public donwloadingDataB = true;

  constructor(private alertController: AlertController,private router: Router, private storage: Storage , private apiService: ApiService) { }

  async ngOnInit() {
    await this.getDataStorage();
  }
  async getDataStorage(){
    await this.storage.get('venta').then((venta) => {
      this.ventaActual = venta;

    });
    await this.storage.get('modelId').then(async (modelsIds) => {
      this.modelsIds = modelsIds;
      await this.getModelos3D();
    });
  }

  async getModelos3D(){
    this.apiService.getAll(firebaseUrls.modelo3d).snapshotChanges().pipe(
      map(cambiar=> cambiar.map(c => ({
        idDb: c.payload.key, ... c.payload.val()
      })))
    ).subscribe(async data =>{
      this.model3ds =data;
      if(this.model3ds != undefined && this.model3ds.length >0 ){
        this.model3ds = this.model3ds.filter( model =>!  this.modelsIds.includes(model.id) );
        this.model3ds.reverse();
      }
      this.model3dsFiltro =  this.model3ds;
      this.donwloadingDataB = false;
    })
  }
  alertAddModel(model :  Modelo3d){
    this.alertController.create({
      subHeader: 'Esta seguro de agregar el modelo: ' +model.nombre  ,
      buttons: [
        {
          text: 'Aceptar',
          handler: async () => {
            this.donwloadingDataB = true;
            await  this.addMoldel3d(model);
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
  async addMoldel3d(model : Modelo3d){
    this.modelSelected = model;
    for (let key of model.keysParte) {
      await this.crearPartes(key, model.keysParte.length );
    }
  }
  async crearModel(){
    var auxModel =  this.modelSelected;
    auxModel.keysParte =this.keysPartes;
    delete auxModel.idDb;
    var auxVenta :Venta;
    auxVenta ={
      id : this.ventaActual.id,
      nombre : this.ventaActual.nombre,
      precio : this.ventaActual.precio,
      costo : this.ventaActual.costo,
      factura : this.ventaActual.factura,
      fechaEntrega : this.ventaActual.fechaEntrega,
      keyCliente : this.ventaActual.keyCliente,
      seEntrego : this.ventaActual.seEntrego,
      precioPintado : this.ventaActual.precioPintado,
      realizadaPor : this.ventaActual.realizadaPor,
      keysModelo3D : this.ventaActual.keysModelo3D
    }
    await this.apiService.add(firebaseUrls.modelo3dVendido, auxModel ).then(async (data) => {
      if(auxVenta.keysModelo3D[0] == 'Empty')
        auxVenta.keysModelo3D[0]= data.key
      else
        auxVenta.keysModelo3D.push(data.key)
      await this.apiService.update(firebaseUrls.ventas , this.ventaActual.idDb, auxVenta).then(
        async ()=>{
          this.ventaActual.keysModelo3D = auxVenta.keysModelo3D;
          await this.storage.set('venta', this.ventaActual);
          this.alertController.create({
            subHeader: 'Se agrego el modelo correctamente !'  ,
            buttons: [
              {
                text: 'Continuar',
                handler: () => {
                  this.donwloadingDataB = false;
                  this.router.navigate(['ver-venta',{SeAgregoModelo: auxModel.id}]);
                }
              },
            ]
          }).then(res => {
            res.present();
          });
        }
      )
    });

  }

  async crearPartes( key : string , largoFinal : number) {
    if(key == "Empty")
      this.keysPartes.push("Empty");
    else{
      var aux = this.apiService.getOne(firebaseUrls.partes , key).snapshotChanges().pipe(
        map(c=>  ({
          idDb: c.payload.key, ... c.payload.val()
        })) 
      )
      .subscribe( async data => {
        delete data.idDb;
        await this.apiService.add(firebaseUrls.partesVendidas, data ).then(async data2 => {
          this.keysPartes.push(data2.key);
          if(this.keysPartes.length == largoFinal )
            this.crearModel();
        });
        aux.unsubscribe();
      });
    }
    
       
    
  }


  search(){
    this.model3dsFiltro =[];
    var filtro = (<HTMLInputElement>document.getElementById("filtroBusqueda3")).value;
    var inputValue = (<HTMLInputElement>document.getElementById("textInput3")).value;
    for (let i = 0; i < this.model3ds.length; i++){
      if(filtro == "name" && this.model3ds[i].nombre.toLowerCase().includes( inputValue.toLowerCase())){
        this.model3dsFiltro.push(this.model3ds[i]);
      }
      if(filtro == "id" && this.model3ds[i].id == parseInt(inputValue) ){
        this.model3dsFiltro.push(this.model3ds[i]);
      }
    }
  }

}
