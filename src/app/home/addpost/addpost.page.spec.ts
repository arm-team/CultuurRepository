import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddpostPage } from './addpost.page';

describe('AddpostPage', () => {
  let component: AddpostPage;
  let fixture: ComponentFixture<AddpostPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddpostPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddpostPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
