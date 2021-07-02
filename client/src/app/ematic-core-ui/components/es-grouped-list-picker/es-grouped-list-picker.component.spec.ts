import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsGroupedListPickerComponent } from './es-grouped-list-picker.component';

xdescribe('EsGroupedListPickerComponent', () => {
  let component: EsGroupedListPickerComponent;
  let fixture: ComponentFixture<EsGroupedListPickerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EsGroupedListPickerComponent]
    });

    fixture = TestBed.createComponent(EsGroupedListPickerComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
