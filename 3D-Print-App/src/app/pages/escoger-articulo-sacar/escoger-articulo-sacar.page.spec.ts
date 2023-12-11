import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EscogerArticuloSacarPage } from './escoger-articulo-sacar.page';

describe('EscogerArticuloSacarPage', () => {
  let component: EscogerArticuloSacarPage;
  let fixture: ComponentFixture<EscogerArticuloSacarPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EscogerArticuloSacarPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EscogerArticuloSacarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
