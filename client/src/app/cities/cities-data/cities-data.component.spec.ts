import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitiesDataComponent } from './cities-data.component';

describe('CitiesDataComponent', () => {
  let component: CitiesDataComponent;
  let fixture: ComponentFixture<CitiesDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CitiesDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CitiesDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
