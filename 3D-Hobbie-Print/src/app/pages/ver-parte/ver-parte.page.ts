import { Component, OnInit } from '@angular/core';
import { Constantes, Cotizacion, firebaseUrls, Modelo3d, Parte } from 'src/app/models';
import { Storage } from '@ionic/storage-angular';
import { ApiService } from 'src/app/services/api-firebase.service';
import { map } from 'rxjs';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-ver-parte',
  templateUrl: './ver-parte.page.html',
  styleUrls: ['./ver-parte.page.scss'],
})
export class VerPartePage implements OnInit {
  public parte : Parte;
  public ventaEntrega = false;
  public constantes : Constantes;
  public donwloadingDataB = true;
  public escala = 100;
  public gramos = 0;
  public horas = 0;
  public cantidad = 1;
  public materiales = [];
  public costoMaterial = [];
  public detalle = "ninguno";
  public soporte = false;
  public dimAltura = 1;
  public dimLargo = 1;
  public dimAncho = 1;
  public  parteVendida = false;

  public modelo3dPadre : Modelo3d;

  constructor( private apiService:  ApiService,private router: Router,private storage: Storage, public alertController: AlertController) { }

  async ngOnInit() {
    if(window.location.href.includes('verParteVendida')){
      this.parteVendida = true;
      if(window.location.href.includes('SeEntrego=true'))
        this.ventaEntrega = true;
    }
      
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
      this.llenarMateriales(this.constantes.costosMateriales);
      sub.unsubscribe();
    })
   
  }
  getMatCosto(index: number){
    return this.costoMaterial[index];
  }

  getMaterialCost(){
    return this.costoMaterial[0];
  }

  llenarMateriales(costosMat : number[]){
    if(costosMat.includes(this.parte.costoMaterial)){
      var matAux = ['Filamento','Resina'];
      this.materiales.push(this.parte.material);
      this.costoMaterial.push(this.parte.costoMaterial);
      costosMat.forEach(cMat =>{
        if(!this.costoMaterial.includes(cMat))
          this.costoMaterial.push(cMat);
      })
      matAux.forEach(mat =>{
        if(!this.materiales.includes(mat))
          this.materiales.push(mat);
      })
    }
    else{
      this.materiales = [this.parte.material + ' antiguo','Filamento','Resina'];
      this.costoMaterial = [this.parte.costoMaterial].concat(costosMat);
    }
      this.donwloadingDataB = false;  
  }

  llenarDatos(part : Parte){
    this.escala = part.escala;
    this.gramos = part.gramos;
    this.horas = part.horasDeImpresion;
    this.cantidad = part.cantidad;
    this.detalle = part.detalles;
    this.soporte = part.soporte;
    this.dimAltura = part.dimensiones[0];
    this.dimLargo = part.dimensiones[1];
    this.dimAncho =part.dimensiones[2];
  }
  async getDataStorage(){
    await this.storage.get('verParte').then(async (part) => {
      this.parte = part;
      this.llenarDatos(part);
      this.getConstantes();
    });
    await this.storage.get('modelo3D').then(async (modelo) => {
      this.modelo3dPadre = modelo;  
    });
  }

  async actualizarParte(){
    if( await this.calcular()){
      // dimensiones (Altura, Largo, Ancho)
      this.parte.dimensiones = [this.dimAltura, this.dimLargo , this.dimAncho ];
      this.parte.cantidad = this.cantidad;
      this.parte.escala = this.escala;
      this.parte.detalles = this.detalle;
      //Estado => 0 : nada, 1 : en cola de impresion, 2 impresos
      var aux = document.getElementsByName("materiales2");
      var tipoMaterial = (<HTMLInputElement>aux.item(aux.length-1)).value;
      this.parte.material = tipoMaterial.replace(' antiguo' , '');
      this.parte.soporte = this.soporte;
      var auxParte : Parte;
      auxParte={
        id : this.parte.id,
        nombre : this.parte.nombre,
        material : this.parte.material,
        costoMaterial : this.parte.costoMaterial,
        costo : this.parte.costo,
        cantidad : this.parte.cantidad,
        cantidadImpresa : this.parte.cantidadImpresa,
        precio : this.parte.precio,
        soporte : this.parte.soporte,
        dimensiones : this.parte.dimensiones,
        detalles : this.parte.detalles,
        escala : this.parte.escala,
        gramos : this.parte.gramos,
        horasDeImpresion : this.parte.horasDeImpresion,
        estado : this.parte.estado
      }
      if(this.parteVendida)
        await this.apiService.update(firebaseUrls.partesVendidas, this.parte.idDb ,auxParte).then(async (data) => { 
          this.alertController.create({
            subHeader: 'La parte se actualizo correctamente!'  ,
            buttons: [
              {
                text: 'volver',
                handler: async () => {
                  this.router.navigate(['ver-venta',{actualizoParte: this.parte.id}])
                }
              },
            ]
          }).then(res => {
            res.present();
          });
        });

      else
        await this.apiService.update(firebaseUrls.partes, this.parte.idDb ,auxParte).then(async (data) => { 
            this.alertController.create({
              subHeader: 'La parte se actualizo correctamente!'  ,
              buttons: [
                {
                  text: 'volver',
                  handler: async () => {
                    this.router.navigate(['partes',{actuParte: this.parte.id}])
                  }
                },
              ]
            }).then(res => {
              res.present();
            });
        });
    }
  }

  async calcular(): Promise<boolean>{
    if( this.horas>0 && this.gramos>0){
      var aux = document.getElementsByName("materiales2");
      var tipoMaterial = (<HTMLInputElement>aux.item(aux.length-1)).value;
      var index2 = this.materiales.indexOf(tipoMaterial);
      var costoMaterial = this.costoMaterial[index2];
      if(this.parte.horasDeImpresion !=  this.horas  || this.parte.gramos != this.gramos || costoMaterial !=  this.parte.costoMaterial){
        var metrosPla = (330*this.gramos) / 1000;
        var rollo6Meses = metrosPla/7425;
        var costoPla = (this.gramos*costoMaterial) / 1000;
        var costoEnergia = this.horas*this.constantes.kwH;
        var costoNozzle = this.constantes.nozzle*rollo6Meses;
        var costoCorrea = this.constantes.correa*rollo6Meses;
        var costoTuboGarganta = this.constantes.tuboGarganta*rollo6Meses;
        var costoCama = this.constantes.heatbed*rollo6Meses;
        var aporteInversion = this.constantes.inversion*rollo6Meses;
        var aporteImprevisto = this.constantes.imprevistos*rollo6Meses;
        var costoTotalProduccion = costoPla+costoEnergia+ costoNozzle+ costoCorrea+ costoTuboGarganta+ costoCama+aporteInversion+aporteImprevisto;
        var precio =costoTotalProduccion*2;
        this.parte.precio = this.quitarDecimales(precio); 
        this.parte.costo  = this.quitarDecimales(costoTotalProduccion); 
        // Lleno el objeto desde aqui ..
        this.parte.costoMaterial = costoMaterial;
        this.parte.gramos = this.gramos;
        this.parte.horasDeImpresion =this.horas;
      }
      return true;
    }
    else{
      return true;
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
