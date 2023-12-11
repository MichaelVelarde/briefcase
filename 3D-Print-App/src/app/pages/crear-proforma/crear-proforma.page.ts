import { Component, OnInit } from '@angular/core';
import { Proforma } from 'src/app/models';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Filesystem, Directory,  } from "@capacitor/filesystem";

import { FileOpener } from '@ionic-native/file-opener/ngx';
import write_blob from 'capacitor-blob-writer';

const APP_DIRECTORY = Directory.Documents;

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-crear-proforma',
  templateUrl: './crear-proforma.page.html',
  styleUrls: ['./crear-proforma.page.scss'],
})
export class CrearProformaPage implements OnInit {
  public donwloadingDataB :boolean;
  public ciudad = 'La Paz';
  public correo = 'ventas@skbolivia.com';
  public validez : number = 7;
  public fecha = '';
  public proforma?: Proforma;
  public numeroProforma : number = 1;
  public paso : number = 1;
  public nameClient : string = 'Escoge un cliente';
  public direccion : string = 'calle villa azpiazu 1383 zona villa fatima';
  public telefono : number = 70520857;
  public leyenda : string = 'Tiempo de entrega immediata, garantia contra defectos de fabrica de 1 año exeptuando partes gastadas por uso o mala manipulacion';

  constructor(private fileOpener: FileOpener,public alertController: AlertController, private router: Router, private storage: Storage) { }

  async ngOnInit() {
    this.donwloadingDataB = true;
    await this.storage.create();
    await this.getDataStorage();
    let d = new Date();
    let date = d.setDate(d.getDate());
    this.fecha = new Date(date).toISOString().slice(0, 10);
  }

  async getDataStorage(){
    await this.storage.get('proforma').then((proforma) => {
      this.proforma = proforma;
      this.numeroProforma = this.proforma.nro;
    });
    if(this.proforma.nombreCliente != undefined){
      this.nameClient = this.proforma.nombreCliente
      if(this.proforma.articulosids.length >0){
        await this.storage.get('paso').then((numero) => {
          this.paso = numero;
        });
      }
    }
    this.donwloadingDataB = false;
  }


  async escogerCliente(){
    if(this.proforma.nombreCliente == undefined)
      this.router.navigate(['escoger-cliente',{proforma: 1}])
    else{
      await this.storage.set('proforma', this.proforma );
      await this.storage.set('paso', this.paso +1 );
      this.router.navigate(['escoger-cliente',{proforma: this.paso +1}])
    }
  }
  async addItem(){
    if(this.proforma.articulosids.length >0){
      await this.storage.set('paso', this.paso +1 );
      this.router.navigate(['escoger-articulo',{proforma: this.paso +1}])
    }
    else{
      await this.storage.set('paso', this.paso);
      this.router.navigate(['escoger-articulo',{proforma: this.paso}])
    }
  }
  async deleteItem(index : number){ 
    this.proforma.articulosCant.splice(index,1);
    this.proforma.articulosNombres.splice(index,1);
    this.proforma.articulosids.splice(index,1);
    this.proforma.articulosPrecios.splice(index,1);
    await this.storage.set('proforma', this.proforma);
  }

  getBase64ImageFromURL(url) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");
    
      img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
    
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
    
        var dataURL = canvas.toDataURL("image/png");
    
        resolve(dataURL);
      };
    
      img.onerror = error => {
        reject(error);
      };
    
      img.src = url;
    });}


    async  pdfDownload(){
    this.donwloadingDataB = true;
    this.leyenda = this.leyenda.toUpperCase();
    this.direccion = this.direccion.toUpperCase();
    this.proforma.nro = this.numeroProforma;
    var tablaProforma = [];
    var costoItem = 0;
    var costoTotal = 0
    tablaProforma.push([ {text: 'CODIGO',
    fillColor: '#000000',
    color: '#FFFFFF', alignment : 'center'}, 
    {text: 'CONCEPTO',
    fillColor: '#000000',
    color: '#FFFFFF',alignment : 'center'}, 
    {text: 'CANTIDAD',
    fillColor: '#000000',
    color: '#FFFFFF',alignment : 'center'},
    {text: 'C. UNITARIO',
    fillColor: '#000000',
    color: '#FFFFFF',alignment : 'center'}, 
    {text: 'TOTAL',
    fillColor: '#000000',
    color: '#FFFFFF',alignment : 'center'} ] )

    for (let i = 0; i < this.proforma.articulosids.length; i++){
      costoItem = this.proforma.articulosCant[i]*this.proforma.articulosPrecios[i];
      costoTotal = costoTotal + costoItem;
      /*tablaProforma.push(
        [ this.proforma.articulosids[i] , 
        this.proforma.articulosNombres[i], 
        this.proforma.articulosCant[i], 
        this.proforma.articulosPrecios[i], 
        costoItem ])*/
      tablaProforma.push(
        [ {text: this.proforma.articulosids[i],fontSize: 10} , 
        {text: this.proforma.articulosNombres[i],fontSize: 10}, 
        {text: this.proforma.articulosCant[i],fontSize: 10}, 
        {text: this.proforma.articulosPrecios[i],fontSize: 10}, 
        {text:  costoItem ,fontSize: 10}])
    }
    tablaProforma.push([ {text: '--',alignment : 'center'} , {text: '--',alignment : 'center'}, {text: '--',alignment : 'center'}, {text: 'TOTAL',fillColor: '#000000',color: '#FFFFFF',alignment : 'center'},  costoTotal+' Bs' ])
              
    
    const docDef = {
      // a string or { width: number, height: number }
      pageSize: 'A4',
    
      // by default we use portrait, you can change it to landscape if you wish
      pageOrientation: 'portrait',
    
      // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
      pageMargins: [ 20, 10, 40, 60 ],
      content: [
        {
          columns: [
            {
              image: await this.getBase64ImageFromURL(
                "../assets/img/logoPrueba.png"
              ),
                width: 100,
                height: 70
            },
            {
              stack: [
                this.ciudad,
                this.direccion,
                {text: 'TELF: ' + this.telefono,bold : true}, 
                {text: this.correo,bold : true , color: '#0000FF', lineHeight :1}, 
                
              ],
              fontSize: 10,
              width: '35%',
            },
            {
              stack: [
                'SEÑORES: ' + this.proforma.nombreCliente,
                'NIT : ' + this.proforma.nitCliente,
                'Proforma: ' + this.proforma.nro,
                'Fecha: ' + this.fecha, 
                {text: 'VALIDEZ DE LA OFERTA '+ this.validez+' DIAS',bold : true }, 
                
              ],
              fontSize: 10,
              width: '35%',
            }
            
          ],
          columnGap: 25
        },

        {
          table:{
            headerRows: 1,
            widths: [ 'auto', '*', 'auto', 'auto', 50 ],
            body: tablaProforma
          }
        },
        {text: this.leyenda ,bold : true , alignment : 'center'},
      ]
    }
    //this.pdfObj = pdfMake.createPdf(docDef).download('proforma'+this.proforma.nro +'.pdf');
    const pdfDocGenerator = pdfMake.createPdf(docDef);
    pdfDocGenerator.getBlob((blob) => {
      this.writeAndOpenFile(blob  ,'proforma'+this.proforma.nro +'.pdf' );
    });
  }
 /*
  downloadPdf2(pdfObj : any) {
        pdfObj.getBuffer((buffer) => {
        var blob = new Blob([buffer], { type: 'application/pdf' });
        // Save the PDF to the data Directory of our App
        this.file.writeFile(this.file.dataDirectory, 'myletter.pdf', blob, { replace: true }).then(fileEntry => {
          // Open the PDf with the correct OS tools
          this.fileOpener.open(this.file.dataDirectory + 'myletter.pdf', 'application/pdf')
            .then(() => this.presentAlert('opened'))
            .catch(error => this.presentAlert(error)); // Error thrown here.
        })
        .catch(error => {
          // an error
          this.presentAlert(error);
        })
      });
    
  }*/
  async writeAndOpenFile(data: Blob, fileName: string) {
    var reader = new FileReader();
    reader.readAsDataURL(data);
    reader.onloadend = async function () {
        var base64data = reader.result;
        try {
            const result = await Filesystem.writeFile({
                path: fileName,
                data: <string>base64data,
                directory: Directory.Data,
                recursive: true
            });
            let fileOpener: FileOpener = new FileOpener();
            fileOpener.open(result.uri, data.type)
                .then(() => console.log('File is opened'))
                .catch(e => console.log('Error opening file', e));

            
        } catch (e) {
            alert('Unable to write file ' + e);
        }
    }
    this.donwloadingDataB = false;
    this.router.navigate(['ventas',{Profor: this.paso +1}])
}

  async downloadPdf(pdf : any, filename : string) {
    await write_blob({
      directory: APP_DIRECTORY,
      path: filename,
      blob: pdf,
      on_fallback(error) {
        console.error('error: ', error);
      }
    }).then(res => { 
      this.fileOpener.open(APP_DIRECTORY + filename, 'application/pdf').then(() => alert('opened'))
      .catch(error => alert(error));
          

      /*
      Filesystem.getUri({
        directory:APP_DIRECTORY,
        path: res
      }).then((getUriResult) => {
        const path = getUriResult.uri;
        this.fileOpener.open(path, 'application/pdf')
      }, (error) => {
        console.log(error);
      });*/

      /*
      this.alertController.create({
        subHeader: 'La proforma se descargo en: '+ res ,
        buttons: [
          {
            text: 'Continuar',
            handler: () => {
              
              this.donwloadingDataB = false;
              this.router.navigate(['ventas',{Profor: this.paso +1}])
              
            }
          },
        ]
      }).then(res => {
        res.present();
      });*/
    })
  }
  changePrecio(pos : number){
    this.alertController.create({
      subHeader: 'Precio para: '+ this.proforma.articulosNombres[pos],
      inputs:[{
            name:'number',
            placeholder: '0',
            type: 'number',
            min: '0',
        }],
      buttons: [
        {
          text: 'Aceptar',
           handler: async data =>{
            this.proforma.articulosPrecios[pos] = parseInt(data.number); 
            await this.storage.set('proforma', this.proforma);
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
}
