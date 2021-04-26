import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListStepDoneComponent } from './list-step-done.component';

describe('ListStepDoneComponent', () => {
  let component: ListStepDoneComponent;
  let fixture: ComponentFixture<ListStepDoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListStepDoneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListStepDoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
