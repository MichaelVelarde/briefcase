import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Almacen, firebaseUrls, ImageSnippet, Inventario } from 'src/app/models';
import { FirebaseImageService } from 'src/app/services/firebase-image.service';
import { AlertController  } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nuevo-articulo',
  templateUrl: './nuevo-articulo.page.html',
  styleUrls: ['./nuevo-articulo.page.scss'],
})

export class NuevoArticuloPage implements OnInit {
  public selectedFile: ImageSnippet | undefined;
  public item : Inventario;
  public nombre : string = "";
  public precio : string = "";
  public inversion : string = "";
  public almacenes : Almacen[];
  public donwloadingDataB = true;
  
  
  

  constructor( private router: Router, private apiService : ApiService, private alertController: AlertController,private firebaseImage : FirebaseImageService , private storage: Storage) { }

  async ngOnInit() {
    await this.getDataStorage();
    await this.getAlmacenes();
  }
  async getDataStorage(){
    await this.storage.get('item').then((item) => {
      this.item = item;
    });
    this.item.almacenesCantidades = ['Empty'];
    this.item.almacenesKeys = ['Empty'];
    this.item.cantTotal = 0;    
  }
  async getAlmacenes(){
    const aux = this.apiService.getAll(firebaseUrls.almacenes).snapshotChanges().pipe(
      map(cambiar=> cambiar.map(c => ({
        idDb: c.payload.key, ... c.payload.val()
      })))
    ).subscribe(data =>{
      this.almacenes =data;
      aux.unsubscribe();
    }).add( ()=>{
      this.donwloadingDataB = false;
    })
  }
  getCantidadAlmacen(key :string){
    let indexAlmacen = this.item.almacenesKeys.findIndex( id => id == key);
    if(indexAlmacen >= 0)
      return this.item.almacenesCantidades[indexAlmacen];
    else
      return 0;
  }
  editCantidadAlmacen(almacen :Almacen){
    const cantidadAntigua = this.getCantidadAlmacen(almacen.idDb);
    const index = this.item.almacenesKeys.findIndex( id => id == almacen.idDb);
    this.alertController.create({
      subHeader: 'Cantidad en el almacen ' + almacen.nombre ,
      inputs:[{
            name:'number',
            placeholder: cantidadAntigua,
            type: 'number',
            min: '0',
        }],
      buttons: [
        {
          text: 'Aceptar',
          handler: data =>{
            let nuevaCant = parseInt(data.number);
            if(index >= 0){
              if(nuevaCant > 0){
                this.item.cantTotal = this.item.cantTotal + (nuevaCant - cantidadAntigua);
                this.item.almacenesCantidades[index] = nuevaCant;
              }
              else{
                this.item.cantTotal = this.item.cantTotal  - cantidadAntigua;
                this.item.almacenesCantidades.splice(index, 1)
                this.item.almacenesKeys.splice(index, 1)
                if(this.item.almacenesKeys.length == 0){
                  this.item.almacenesKeys.push("Empty");
                  this.item.almacenesCantidades.push("Empty");
                }
              }
            }
            else{
              if(nuevaCant > 0){
                if(this.item.almacenesKeys.includes("Empty")){
                  this.item.almacenesKeys.pop();
                  this.item.almacenesCantidades.pop();
                }
                this.item.cantTotal = this.item.cantTotal + nuevaCant;
                this.item.almacenesCantidades.push(nuevaCant);
                this.item.almacenesKeys.push(almacen.idDb);
              }
            }
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

  
  pickImage(event : any) {
    
    const file: File = event.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', (event: any) => {
    
      this.selectedFile = new ImageSnippet(event.target.result, file);
    });

    reader.readAsDataURL(file);
  }

  async saveItem(){
    var unitType = (<HTMLInputElement>document.getElementById("valorUnidad")).value;
    this.item.unidad = unitType;
    this.donwloadingDataB = true;
    if(this.nombre == "" || this.precio == "" ||this.inversion == "" || this.selectedFile == undefined){
      alert("Debes llenar todos los datos.");
    }
    else{
      const path = "inventario" ;
      const name = "Articulo" + this.item.id;
      const res = await this.firebaseImage.uploadFile(this.selectedFile.file, path,name);
      console.log(res);
      this.item.id = parseInt(''+this.item.id);
      this.item.nameImage = res;
      this.item.nombre = this.nombre;
      this.item.precio = ''+this.precio;
      this.item.costoInversion = parseInt(this.inversion);
      delete this.item.idDb;
      this.apiService.addLog('Agrego el articulo con id: ' + this.item.id);
      await this.apiService.add(firebaseUrls.inventario, this.item).then( ()=>{
        this.donwloadingDataB = false;
        this.alertController.create({
          subHeader: 'El articulo se creo correctamente!'  ,
          buttons: [
            {
              text: 'Continuar',
              handler: () => {
                this.router.navigate(['inventario',{nItem: this.item.id}])
              }
            },
          ]
        }).then(res => {
          res.present();
        });
      })
      
    }
  }
    
    /*
    this.imagePicker.hasReadPermission()
    .then(result => {
      if (result === false) {
        this.imagePicker.requestReadPermission();
      }
      else if (result === true) {
        this.imagePicker.getPictures({
          // the amout of images that the user can select
          maximumImagesCount: 1
        }).then(results => {
          for (var i = 0; i < results.length; i++) {
           // this.uploadImageToFirebase(results[i]);
           this.firebaseImage.uploadFile(results[i]);
          }
        }, err => console.log(err));
      }
    }, err => console.log(err));
  }
  uploadImageToFirebase(imagePath : string) {
    let image = imagePath.replace('file://', '')
    //console.log(image);
    // uploads image to firebase storage
    this.firebaseImage.uploadImage(image)
    .then(photoURL => {
      this.alertController.create({
        subHeader: 'La imagen se subio correctamente!'  ,
        buttons: [
          {
            text: 'Continuar',
          },
        ]
      }).then(res => {
        res.present();
      });
    })*/
  
}
