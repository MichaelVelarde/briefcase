import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage'
import { finalize } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class FirebaseImageService {

  constructor(private storage: AngularFireStorage) { }

  uploadFile( file : any , path : string , nombre : string): Promise<string> {
    return new Promise(resolve =>{
      const filePath = path+'/' + nombre;
      const ref = this.storage.ref(filePath);
      const task = ref.put(file);
      task.snapshotChanges().pipe(
        finalize ( ()=>{
              ref.getDownloadURL().subscribe( res =>{
                const donwloadURL = res;
                resolve(donwloadURL);
                return;
              })
        })
      ).subscribe();
    }); 
  }

  /*uploadImage(imageURI) {
    return new Promise<any>((resolve, reject) => {
      let storageRef = firebase.storage().ref();
      let imageRef = storageRef.child('image').child('imageName');
      this.encodeImageUri(imageURI, function(image64) {
        imageRef.putString(image64, 'data_url')
        .then(snapshot => {
          resolve(snapshot.ref.getDownloadURL())
        }, err => {
          reject(err);
        })
      })
    })
  }

  encodeImageUri(imageUri, callback) {
    var c = document.createElement('canvas');
    var ctx = c.getContext("2d");
    var img = new Image();
    img.onload = function () {
      var aux:any = this;
      c.width = aux.width;
      c.height = aux.height;
      ctx.drawImage(img, 0, 0);
      var dataURL = c.toDataURL("image/jpeg");
      callback(dataURL);
    };
    img.src = imageUri;
  };
  */
}
