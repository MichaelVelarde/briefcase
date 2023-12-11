import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Constantes, Cotizacion, firebaseUrls, Modelo3d, Parte } from 'src/app/models';
import { Storage } from '@ionic/storage-angular';
import { ApiService } from 'src/app/services/api-firebase.service';
import { map } from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'app-crear-parte',
  templateUrl: './crear-parte.page.html',
  styleUrls: ['./crear-parte.page.scss'],
})
export class CrearPartePage implements OnInit {
  public modelo3d : Modelo3d;
  public parte : Parte;
  public materiales = ["Filamento", "Resina"];
  public donwloadingDataB = true;
  public nombre = "";
  public escala = 100;
  public gramos = 0;
  public precio = 0;
  public costo = 0;
  public horas = 0;
  public cantidad = 1;
  public detalle = "ninguno";
  public soporte = false;
  public dimAltura = 1;
  public dimLargo = 1;
  public dimAncho = 1;
  // Constantes a cargar:
  public constantes : Constantes;

  constructor( private router: Router,private storage: Storage, public alertController: AlertController,  private apiService:  ApiService) { }

  async ngOnInit() {
    this.donwloadingDataB = true;
    await this.getConstantes();
    await this.getDataStorage();
  }
  async getConstantes(){
    const sub = this.apiService.getOne(firebaseUrls.constantes, firebaseUrls.keyConstantes).snapshotChanges().pipe(
      map(c=>  ({
        idDb: c.payload.key, ... c.payload.val()
      })) 
    )
    .subscribe( async data => {
      this.constantes = data;
      sub.unsubscribe();
    })
  }
  getMatCosto(index: number){
    return this.constantes.costosMateriales[index];
  }

  
  async getDataStorage(){
    await this.storage.get('modelo3D').then( (modeo3d)=>{
      this.modelo3d= modeo3d;
    })
    await this.storage.get('parte').then((parte) => {
      this.parte = parte;
      this.parte.horasDeImpresion = 0;
      this.parte.gramos = 0;
    });
    this.donwloadingDataB = false;
  }
  async agregarParte(){
    if( this.nombre !=""){
      if( await this.calcular()){
        // dimensiones (Altura, Largo, Ancho)
        this.parte.dimensiones = [this.dimAltura, this.dimLargo , this.dimAncho ];
        this.parte.cantidad = this.cantidad;
        this.parte.cantidadImpresa = 0;
        this.parte.escala = this.escala;
        this.parte.detalles = this.detalle;
        //Estado => 0 : nada, 1 : en cola de impresion, 2 impresos
        this.parte.estado = 0;
        var aux = document.getElementsByName("tipoMaterial");
        var tipoMaterial = (<HTMLInputElement>aux.item(aux.length-1)).value;
        this.parte.material = tipoMaterial;
        this.parte.nombre = this.nombre;
        this.parte.soporte = this.soporte;
        await this.apiService.add(firebaseUrls.partes, this.parte ).then(async (data) => {
          await this.addPartToModel3D(data.key);  
        });
      }
    }
    else{
      
      this.alertController.create({
        subHeader: 'Debe llenar el campo nombre!'  ,
        buttons: [
          {
            text: 'cerrar',
          },
        ]
      }).then(res => {
        res.present();
      });
    }
  }  
  async addPartToModel3D(keyPart : string){
    var auxModel3d : Modelo3d;
    if(this.modelo3d.keysParte[0] == 'Empty')
      this.modelo3d.keysParte = [keyPart]
    else
      this.modelo3d.keysParte.push(keyPart);
    auxModel3d ={
      id : this.modelo3d.id,
      nombre : this.modelo3d.nombre,
      precio : this.modelo3d.precio,
      costo : this.modelo3d.costo,
      keysParte : this.modelo3d.keysParte,
    }
    await this.apiService.update(firebaseUrls.modelo3d, this.modelo3d.idDb,auxModel3d).then(
      ()=>{
        this.alertController.create({
          subHeader: 'La parte con id ' + this.parte.id + " se creo correctamente!, desea continuar agregando partes o volver al modelo3d?"  ,
          buttons: [
            {
              text: 'Continuar',
              handler: async () => {
                this.parte.id = this.parte.id +1;
                this.parte.nombre = "";
            }
          },
          {
            text: 'volver',
            handler: async () => {
              this.router.navigate(['partes',{nParte: this.parte.id}])
          }
          },
          ]}).then(res => {
          res.present();
        }); 
      }
    )
  }
  /*
   await this.storage.create();
              await this.storage.set('cotizacion', {id :this.parte.keyCotizacion});
              this.router.navigate(['crear-cotizacion',{createCotizacion: 1}]);
              this.router.navigate(['cotizaciones',{nVenta: this.parte.keyCotizacion + this.parte.id}])
  */
  async calcular(): Promise<boolean>{
    if( this.horas>0 && this.gramos>0){
      if(this.parte.horasDeImpresion !=  this.horas  || this.parte.gramos != this.gramos){
        var costoMaterial = 0;
        var aux = document.getElementsByName("tipoMaterial");
        var tipoMaterial = (<HTMLInputElement>aux.item(aux.length-1)).value;
        if(tipoMaterial == 'Filamento')
           costoMaterial = this.constantes.costosMateriales[0];
        else
           costoMaterial = this.constantes.costosMateriales[1];
        var metrosPla = (330*this.gramos) / 1000;
        var rollo6Meses = metrosPla/7425;
        var costoPla = (this.gramos*costoMaterial ) / 1000;
        var costoEnergia = this.horas*this.constantes.kwH;
        var costoNozzle = this.constantes.nozzle*rollo6Meses;
        var costoCorrea = this.constantes.correa*rollo6Meses;
        var costoTuboGarganta = this.constantes.tuboGarganta*rollo6Meses;
        var costoCama = this.constantes.heatbed*rollo6Meses;
        var aporteInversion = this.constantes.inversion*rollo6Meses;
        var aporteImprevisto = this.constantes.imprevistos*rollo6Meses;
        var costoTotalProduccion = costoPla+costoEnergia+ costoNozzle+ costoCorrea+ costoTuboGarganta+ costoCama+aporteInversion+aporteImprevisto;
        var precio =costoTotalProduccion*2;
        this.precio = this.quitarDecimales(precio); 
        this.costo = this.quitarDecimales(costoTotalProduccion); 
        // Lleno el objeto desde aqui ..
        this.parte.costo = this.costo;
        this.parte.precio = this.precio;
        this.parte.costoMaterial = costoMaterial;
        this.parte.gramos = this.gramos;
        this.parte.horasDeImpresion =this.horas;
      }
      return true;
    }
    else{
      this.alertController.create({
        subHeader: 'Los gramos y las horas deben ser mayor a 0!'  ,
        buttons: [
          {
            text: 'cerrar',
          },
        ]
      }).then(res => {
        res.present();
      });
      return false;
    } 
  }

  quitarDecimales(num : number){
    var s = num.toString();
    if(s.includes('.')){
      var pos = s.indexOf('.');
      var numStr = s.slice(0, pos+3);
      return Number(numStr);
    }
    else
     return num;
  }
  
}




