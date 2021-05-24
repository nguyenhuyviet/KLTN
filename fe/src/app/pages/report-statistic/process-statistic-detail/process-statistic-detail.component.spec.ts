import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessStatisticDetailComponent } from './process-statistic-detail.component';

describe('ProcessStatisticDetailComponent', () => {
  let component: ProcessStatisticDetailComponent;
  let fixture: ComponentFixture<ProcessStatisticDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessStatisticDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessStatisticDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
