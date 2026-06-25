import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxSuspenseOfDirective } from '../../../ngx-suspense-of/src/public-api';
import { appConfig } from './app.config';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, NgxSuspenseOfDirective],
      providers: appConfig.providers
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should get github link`, () => {
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.github-logo').href).toContain('https://github.com/celtian/ngx-suspense-of');
  });
});
