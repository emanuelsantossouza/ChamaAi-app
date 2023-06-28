import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PesquisaPage } from './pesquisa.page';

describe('PesquisaPage', () => {
  let component: PesquisaPage;
  let fixture: ComponentFixture<PesquisaPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PesquisaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
