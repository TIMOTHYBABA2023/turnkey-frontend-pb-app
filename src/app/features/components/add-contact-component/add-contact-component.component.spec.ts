import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddContactComponentComponent } from './add-contact-component.component';

describe('AddContactComponentComponent', () => {
  let component: AddContactComponentComponent;
  let fixture: ComponentFixture<AddContactComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddContactComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddContactComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
