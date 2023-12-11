import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VerArticuloSacadoPage } from './ver-articulo-sacado.page';

describe('VerArticuloSacadoPage', () => {
  let component: VerArticuloSacadoPage;
  let fixture: ComponentFixture<VerArticuloSacadoPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VerArticuloSacadoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VerArticuloSacadoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
