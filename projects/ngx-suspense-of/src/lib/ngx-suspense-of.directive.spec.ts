/*
import { Component, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxSuspenseOfDirective, RepeatDirectiveContext } from './ngx-suspense-of.directive';

describe('NgxSuspenseOfDirective', () => {
  @Component({
    template: `
    <div
      *ngxSuspense="3;
      let index = index;
      let even = even;
      let odd = odd;
      let first = first;
      let last = last;">
      {{ index }} {{ even }} {{ odd }} {{ first }} {{ last }}
    </div>`
  })
  class TestDirectiveComponent {
    @ViewChild(NgxSuspenseOfDirective) public directive: NgxSuspenseOfDirective;

    public count = 3;

    public increment(): void {
      if (this.count < 100) {
        this.count++;
      }
    }

    public decrement(): void {
      if (this.count > 0) {
        this.count--;
      }
    }
  }

  let fixture: ComponentFixture<TestDirectiveComponent>;
  let templateRef: jasmine.SpyObj<TemplateRef<RepeatDirectiveContext>>;
  let viewContainer: jasmine.SpyObj<ViewContainerRef>;

  beforeEach(() => {
    templateRef = jasmine.createSpyObj('TemplateRef<RepeatDirectiveContext>',['elementRef', 'createEmbeddedView']);
    viewContainer = jasmine.createSpyObj('ViewContainerRef', ['length', 'remove', 'createEmbeddedView', 'createComponent']);

    fixture = TestBed.configureTestingModule({
      declarations: [ TestDirectiveComponent, NgxSuspenseOfDirective ],
      providers: [
        { provide: TemplateRef, useValue: templateRef },
        { provide: ViewContainerRef, useValue: viewContainer },
      ]
    }).createComponent(TestDirectiveComponent)

    fixture.detectChanges();
  });

  it('should create an instance', () => {
    const directive = new NgxSuspenseOfDirective(templateRef, viewContainer);
    expect(directive).toBeTruthy();
  });
});
*/
