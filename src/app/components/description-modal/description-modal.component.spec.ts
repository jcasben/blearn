import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptionModalComponent } from './description-modal.component';

describe('DescriptionModalComponent', () => {
  let component: DescriptionModalComponent;
  let fixture: ComponentFixture<DescriptionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DescriptionModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DescriptionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
