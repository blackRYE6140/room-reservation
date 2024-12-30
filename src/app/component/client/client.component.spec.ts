import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientComponent } from './client.component';

describe('ClientComponent', () => {
  let fixture: ComponentFixture<ClientComponent>;
  let component: ClientComponent;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
