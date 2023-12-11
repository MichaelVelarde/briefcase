import { Injectable } from '@angular/core';
import {  AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  dbRef: AngularFireList<any> ;  
  objectRef: AngularFireObject<any>; 

  constructor(private db?: AngularFireDatabase) {
  }
  getAll(path: string){
    this.dbRef = this.db.list(path)
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

}
