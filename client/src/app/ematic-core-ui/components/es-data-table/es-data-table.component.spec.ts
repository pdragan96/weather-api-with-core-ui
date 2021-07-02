import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EsDataTableComponent } from './es-data-table.component';

xdescribe('Component: Table', () => {
  let component: EsDataTableComponent;
  let fixture: ComponentFixture<EsDataTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EsDataTableComponent],
      providers: [
        {
          useClass: class {
            sort: () => void;
          }
        }
      ]
    });

    fixture = TestBed.createComponent(EsDataTableComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
