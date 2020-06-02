import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewdevelopmentComponent } from './newdevelopment.component';

describe('NewdevelopmentComponent', () => {
  let component: NewdevelopmentComponent;
  let fixture: ComponentFixture<NewdevelopmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewdevelopmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewdevelopmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
