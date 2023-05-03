import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterpeterComponent } from './interpeter.component';

describe('InterpeterComponent', () => {
  let component: InterpeterComponent;
  let fixture: ComponentFixture<InterpeterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterpeterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterpeterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
