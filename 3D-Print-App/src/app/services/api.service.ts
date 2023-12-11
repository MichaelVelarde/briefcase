import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import {  AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { LoginUserService } from './login-user.service';
import { firebaseUrls, Log } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  dbRef: AngularFireList<any>;  
  objectRef: AngularFireObject<any>;
  public log : Log;  

  constructor(private userService :LoginUserService, private db?: AngularFireDatabase) {
  }
  getAll(path: string){
    this.dbRef = this.db.list(path);
    return this.dbRef;
  }
  getOne(path: string , id : string){
    this.objectRef = this.db.object(path + '/' + id);
    return this.objectRef;
  }
  add(path: string, obj: any){
    this.dbRef = this.db.list(path);
    return this.dbRef.push(obj)
  }
  update(path: string, id : string , obj :any){
    this.dbRef = this.db.list(path);
    return this.dbRef.update (id, obj) ;
  }
  remove(path: string, id: string){
    this.dbRef = this.db.list(path);
    return this.dbRef.remove(id);
  }
  addLog( accion: string){
    const loginUser = this.userService.getUsuario();
    var currentdate = new Date(); 
    const dateA = currentdate.getFullYear() + "/" + (currentdate.getMonth()+1)+ "/" +currentdate.getDate() 
    const timeA = currentdate.getHours() + ":" + currentdate.getMinutes()
    this.log = {
      userIdDb: loginUser.id, 
      accion : accion, 
      date : dateA,
      time : timeA
    }
    this.dbRef = this.db.list(firebaseUrls.log);
    return this.dbRef.push(this.log)
  }

}
