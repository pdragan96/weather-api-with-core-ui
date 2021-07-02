import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsGroupedListComponent } from './es-grouped-list.component';

xdescribe('EsGroupedListComponent', () => {
  let component: EsGroupedListComponent;
  let fixture: ComponentFixture<EsGroupedListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EsGroupedListComponent]
    });

    fixture = TestBed.createComponent(EsGroupedListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
