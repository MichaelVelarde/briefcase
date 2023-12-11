import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { firebaseUrls, Log, User } from 'src/app/models';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-ver-log',
  templateUrl: './ver-log.page.html',
  styleUrls: ['./ver-log.page.scss'],
})
export class VerLogPage implements OnInit {
  public users: User [];
  public logs: Log [];
  public donwloadingDataB = true;

  constructor(private apiService:  ApiService) { }

  async ngOnInit() {
    this.donwloadingDataB = true;
    await this.getLogs();
    await this.getUsers();
  }
  getUserName(key : string){
    return this.users.find(user => user.id == key ).user;
  }

  async getLogs(){
    const aux = this.apiService.getAll(firebaseUrls.log).snapshotChanges().pipe(
      map(cambiar=> cambiar.map(c => ({
        idDb: c.payload.key, ... c.payload.val()
      })))
    ).subscribe(data =>{
      this.logs =data;
      aux.unsubscribe();
    });
  }
  
  async getUsers(){
    const aux = this.apiService.getAll(firebaseUrls.usuarios).snapshotChanges().pipe(
      map(cambiar=> cambiar.map(c => ({
        id: c.payload.key, ... c.payload.val()
      })))
    ).subscribe(data =>{
      this.users =data;
      aux.unsubscribe();
    }).add( ()=>{
      this.donwloadingDataB = false;
    })
  }

}
