import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PostfeedPage } from './postfeed.page';

describe('PostfeedPage', () => {
  let component: PostfeedPage;
  let fixture: ComponentFixture<PostfeedPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostfeedPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PostfeedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
