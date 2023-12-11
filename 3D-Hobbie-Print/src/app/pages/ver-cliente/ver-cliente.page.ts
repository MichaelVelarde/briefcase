import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { Storage } from '@ionic/storage-angular';
import { Cliente, firebaseUrls } from 'src/app/models';
import { ApiService } from 'src/app/services/api-firebase.service';

@Component({
  selector: 'app-ver-cliente',
  templateUrl: './ver-cliente.page.html',
  styleUrls: ['./ver-cliente.page.scss'],
})
export class VerClientePage implements OnInit {
  public cliente : Cliente;
  public donwloadingDataB = true;

  constructor(private apiService:  ApiService, private storage: Storage) { }

  async ngOnInit() {
    this.donwloadingDataB = true;
    await this.getDataStorage();
  }
  async getDataStorage(){
    await this.storage.get('verClient-Key').then(async (key) => {
       this.getClient(key);
    });
  }
  getClient(key : string){
    let sub = this.apiService.getOne(firebaseUrls.clientes , key ).snapshotChanges().pipe(
      map(c=>  ({
        idDb: c.payload.key, ... c.payload.val()
      })) 
    )
    .subscribe( async data => {
      this.cliente = data;
      this.donwloadingDataB = false;
      sub.unsubscribe();
    })

  }

}
