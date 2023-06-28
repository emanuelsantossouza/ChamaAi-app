import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginModalPage } from './login-modal.page';

describe('LoginModalPage', () => {
  let component: LoginModalPage;
  let fixture: ComponentFixture<LoginModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LoginModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
