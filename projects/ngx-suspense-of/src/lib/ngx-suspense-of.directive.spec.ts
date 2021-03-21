import { Component, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { concat, Observable, of, throwError } from 'rxjs';
import { delay, startWith } from 'rxjs/operators';
import { Loading, loading, NgxSuspenseDirectiveContext, NgxSuspenseOfDirective, NgxSuspenseState } from './ngx-suspense-of.directive';

interface TestingObject {
  field: string;
}

interface TestingObservables {
  arrayCommon: Observable<number[]>;
  arrayEmpty: Observable<number[]>;
  arrayError: Observable<number[]>;
  objectCommon: Observable<TestingObject>;
  objectEmpty: Observable<TestingObject>;
  objectError: Observable<TestingObject>;
  noObservable: Observable<any>;
  infiniteLoading: Observable<Loading>;
  noLoadingEmbed: Observable<Loading>;
  noEmptyEmbed: Observable<number[]>;
  noErrorEmbed: Observable<number[]>;
  alternativeLoading: Observable<Loading>;
  alternativeEmpty: Observable<number[]>;
  alternativeError: Observable<number[]>;
}

const LOADING_DELAY = 250; // in ms

export const expectToSubscribe = <T>(args: T[], done: () => void) => {
  let i = 0;
  return () => {
    if (i === args.length - 1) {
      done();
    }
    return args[i++];
  };
};

describe('NgxSuspenseOfDirective', () => {
  @Component({
    template: `
    <ng-container [ngSwitch]="selected">
      <ng-container *ngSwitchCase="'arrayCommon'">
        <ng-container [ngTemplateOutlet]="data" [ngTemplateOutletContext]="{ observable: observables?.arrayCommon }"></ng-container>
      </ng-container>
      <ng-container *ngSwitchCase="'arrayEmpty'">
        <ng-container [ngTemplateOutlet]="data" [ngTemplateOutletContext]="{ observable: observables?.arrayEmpty }"></ng-container>
      </ng-container>
      <ng-container *ngSwitchCase="'arrayError'">
        <ng-container [ngTemplateOutlet]="data" [ngTemplateOutletContext]="{ observable: observables?.arrayError }"></ng-container>
      </ng-container>
      <ng-container *ngSwitchCase="'objectCommon'">
        <ng-container [ngTemplateOutlet]="data" [ngTemplateOutletContext]="{ observable: observables?.objectCommon }"></ng-container>
      </ng-container>
      <ng-container *ngSwitchCase="'objectEmpty'">
        <ng-container [ngTemplateOutlet]="data" [ngTemplateOutletContext]="{ observable: observables?.objectEmpty }"></ng-container>
      </ng-container>
      <ng-container *ngSwitchCase="'objectError'">
        <ng-container [ngTemplateOutlet]="data" [ngTemplateOutletContext]="{ observable: observables?.objectError }"></ng-container>
      </ng-container>
      <ng-container *ngSwitchCase="'noObservable'">
        <ng-container [ngTemplateOutlet]="data" [ngTemplateOutletContext]="{ observable: observables?.noObservable }"></ng-container>
      </ng-container>
      <ng-container *ngSwitchCase="'infiniteLoading'">
        <ng-container [ngTemplateOutlet]="data" [ngTemplateOutletContext]="{ observable: observables?.infiniteLoading }"></ng-container>
      </ng-container>
      <ng-container *ngSwitchCase="'noLoadingEmbed'">
        <ng-container
          *ngxSuspense="
            let data of observable?.noLoadingEmbed;
            empty: empty;
            error: error"
        >
          <pre>{{ data | json }}</pre>
        </ng-container>
      </ng-container>
      <ng-container *ngSwitchCase="'noEmptyEmbed'">
        <ng-container
          *ngxSuspense="
            let data of observable?.noEmptyEmbed;
            loading: loading;
            error: error"
        >
          <pre>{{ data | json }}</pre>
        </ng-container>
      </ng-container>
      <ng-container *ngSwitchCase="'noErrorEmbed'">
        <ng-container
          *ngxSuspense="
            let data of observables?.noErrorEmbed;
            loading: loading;
            empty: empty"
        >
          <pre>{{ data | json }}</pre>
        </ng-container>
      </ng-container>
      <ng-container *ngSwitchCase="'alternativeLoading'">
        <ng-container
          [ngTemplateOutlet]="data"
          [ngTemplateOutletContext]="{
            observable: observables?.infiniteLoading,
            alternativeLoading: useAlternative
          }">
        </ng-container>
      </ng-container>
      <ng-container *ngSwitchCase="'alternativeEmpty'">
        <ng-container
          [ngTemplateOutlet]="data"
          [ngTemplateOutletContext]="{
            observable: observables?.infiniteLoading,
            alternativeEmpty: useAlternative
          }">
        </ng-container>
      </ng-container>
      <ng-container *ngSwitchCase="'alternativeError'">
        <ng-container
          [ngTemplateOutlet]="data"
          [ngTemplateOutletContext]="{
            observable: observables?.alternativeError,
            alternativeError: useAlternative
          }">
        </ng-container>
      </ng-container>
    </ng-container>
    <ng-template
      #data
      let-observable="observable"
      let-alternativeLoading="alternativeLoading"
      let-alternativeEmpty="alternativeEmpty"
      let-alternativeError="alternativeError"
    >
      <ng-container
        *ngxSuspense="
          let data of observable;
          loading: alternativeLoading ? altLoading : loading;
          empty: alternativeEmpty ? altEmpty : empty;
          error: alternativeError ? altError : error"
      >
        <pre>{{ data | json }}</pre>
      </ng-container>
    </ng-template>
    <ng-template #loading>Loading ...</ng-template>
    <ng-template #altLoading>Alt - Loading ...</ng-template>
    <ng-template #empty>Incoming data are empty</ng-template>
    <ng-template #altEmpty>Alt - Incoming data are empty</ng-template>
    <ng-template #error let-tryAgain let-error="error">
      <pre>{{ error }}</pre>
      <button (click)="tryAgain()">Try again</button>
    </ng-template>
    <ng-template #altError let-tryAgain let-error="error">
      <pre>Alt - {{ error }}</pre>
      <button (click)="tryAgain()">Try again</button>
    </ng-template>
    `
  })
  class TestDirectiveComponent {
    @ViewChild(NgxSuspenseOfDirective) public directive: NgxSuspenseOfDirective<any>;

    public observables: TestingObservables = {
      arrayCommon: of([1, 2, 3, 4, 5]).pipe(delay(LOADING_DELAY)),
      arrayEmpty: of([]).pipe(delay(LOADING_DELAY)),
      arrayError: concat(of([]).pipe(delay(LOADING_DELAY)), throwError(new Error('Some custom error'))),
      objectCommon: of({ field: 'some value' }).pipe(delay(LOADING_DELAY)),
      objectEmpty: of(null).pipe(delay(LOADING_DELAY)),
      objectError: concat(of(null).pipe(delay(LOADING_DELAY)), throwError(new Error('Some custom error'))),
      noObservable: null,
      infiniteLoading: of(loading),
      noLoadingEmbed: of(loading),
      noEmptyEmbed: of([]).pipe(delay(LOADING_DELAY)),
      noErrorEmbed: concat(of([]).pipe(delay(LOADING_DELAY)), throwError(new Error('Some custom error'))),
      alternativeLoading: of(loading),
      alternativeEmpty: of([]).pipe(delay(LOADING_DELAY)),
      alternativeError: concat(of([]).pipe(delay(LOADING_DELAY)), throwError(new Error('Some custom error')))
    };

    public selected: keyof TestingObservables;
    public useAlternative = false;
  }

  let fixture: ComponentFixture<TestDirectiveComponent>;
  let templateRef: jasmine.SpyObj<TemplateRef<NgxSuspenseDirectiveContext<any>>>;
  let viewContainer: jasmine.SpyObj<ViewContainerRef>;

  beforeEach(() => {
    templateRef = jasmine.createSpyObj('TemplateRef<NgxSuspenseDirectiveContext<any>>',['elementRef', 'createEmbeddedView']);
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

  it('should use arrayCommon', ((done) => {
    const expectedVals = expectToSubscribe<NgxSuspenseState<number[]>>(
      [{ state: 'loading' }, { state: 'data', data: [1, 2, 3, 4, 5] }],
      () => done()
    );
    const component = fixture.componentInstance;
    component.selected = 'arrayCommon';
    fixture.detectChanges();
    component.observables.arrayCommon.pipe(
      delay(LOADING_DELAY),
      startWith(loading))
    .subscribe((res) => {
      fixture.detectChanges();
      expect(component.directive.state).toEqual(expectedVals());
    });
  }));

  it('should use arrayEmpty', ((done) => {
    const expectedVals = expectToSubscribe<NgxSuspenseState<number[]>>(
      [{ state: 'loading' }, { state: 'empty' }],
      () => done()
    );
    const component = fixture.componentInstance;
    component.selected = 'arrayEmpty';
    fixture.detectChanges();
    component.observables.arrayEmpty.pipe(
      delay(LOADING_DELAY),
      startWith(loading))
    .subscribe((res) => {
      fixture.detectChanges();
      expect(component.directive.state).toEqual(expectedVals());
    });
  }));

  it('should use arrayError', ((done) => {
    const component = fixture.componentInstance;
    component.selected = 'arrayError';
    fixture.detectChanges();
    expect(component.directive.state).toEqual({ state: 'loading' });
    of(null).pipe(delay(LOADING_DELAY)).subscribe(res => {
      expect(component.directive.state.state).toEqual('error');
      done();
    });
  }));

  it('should use objectCommon', ((done) => {
    const expectedVals = expectToSubscribe<NgxSuspenseState<TestingObject>>(
      [{ state: 'loading' }, { state: 'data', data: { field: 'some value' } }],
      () => done()
    );
    const component = fixture.componentInstance;
    component.selected = 'objectCommon';
    fixture.detectChanges();
    component.observables.objectCommon.pipe(
      delay(LOADING_DELAY),
      startWith(loading))
    .subscribe((res) => {
      fixture.detectChanges();
      expect(component.directive.state).toEqual(expectedVals());
    });
  }));

  it('should use objectEmpty', ((done) => {
    const expectedVals = expectToSubscribe<NgxSuspenseState<TestingObject>>(
      [{ state: 'loading' }, { state: 'empty' }],
      () => done()
    );
    const component = fixture.componentInstance;
    component.selected = 'objectEmpty';
    fixture.detectChanges();
    component.observables.objectEmpty.pipe(
      delay(LOADING_DELAY),
      startWith(loading))
    .subscribe((res) => {
      fixture.detectChanges();
      expect(component.directive.state).toEqual(expectedVals());
    });
  }));

  it('should use objectError', ((done) => {
    const component = fixture.componentInstance;
    component.selected = 'objectError';
    fixture.detectChanges();
    expect(component.directive.state).toEqual({ state: 'loading' });
    of(null).pipe(delay(LOADING_DELAY)).subscribe(res => {
      expect(component.directive.state.state).toEqual('error');
      done();
    });
  }));

  it('should use noObservable', (() => {
    const component = fixture.componentInstance;
    component.selected = 'noObservable';
    fixture.detectChanges();
    expect(component.directive.state).toEqual({ state: 'loading' });
  }));

  it('should use infiniteLoading', (() => {
    const component = fixture.componentInstance;
    component.selected = 'infiniteLoading';
    fixture.detectChanges();
    expect(component.directive.state).toEqual({ state: 'loading' });
  }));

  it('should use noLoadingEmbed', (() => {
    const component = fixture.componentInstance;
    component.selected = 'noLoadingEmbed';
    fixture.detectChanges();
    expect(component.directive.state).toEqual({ state: 'loading' });
  }));

  it('should use noEmptyEmbed', ((done) => {
    const expectedVals = expectToSubscribe<NgxSuspenseState<number[]>>(
      [{ state: 'loading' }, { state: 'empty' }],
      () => done()
    );
    const component = fixture.componentInstance;
    component.selected = 'noEmptyEmbed';
    fixture.detectChanges();
    component.observables.noEmptyEmbed.pipe(
      delay(LOADING_DELAY),
      startWith(loading))
    .subscribe((res) => {
      fixture.detectChanges();
      expect(component.directive.state).toEqual(expectedVals());
    });
  }));

  it('should use noErrorEmbed', ((done) => {
    const component = fixture.componentInstance;
    component.selected = 'noErrorEmbed';
    fixture.detectChanges();
    expect(component.directive.state).toEqual({ state: 'loading' });
    of(null).pipe(delay(LOADING_DELAY)).subscribe(res => {
      expect(component.directive.state.state).toEqual('error');
      done();
    });
  }));

  it('should use alternativeLoading', ((done) => {
    const component = fixture.componentInstance;
    component.selected = 'alternativeLoading';
    fixture.detectChanges();
    expect(component.directive.state).toEqual({ state: 'loading' });
    component.useAlternative = true;
    fixture.detectChanges();
    of(null).pipe(delay(LOADING_DELAY)).subscribe(res => {
      expect(component.directive.state).toEqual({ state: 'loading' });
      done();
    });
  }));

  it('should use alternativeEmpty', ((done) => {
    const expectedVals = expectToSubscribe<NgxSuspenseState<number[]>>(
      [{ state: 'loading' }, { state: 'empty' }],
      () => done()
    );
    const component = fixture.componentInstance;
    component.selected = 'alternativeEmpty';
    fixture.detectChanges();

    component.observables.noEmptyEmbed.pipe(
      delay(LOADING_DELAY),
      startWith(loading))
    .subscribe((res) => {
      if(res !== loading) {
        component.useAlternative = true;
      }
      fixture.detectChanges();
      expect(component.directive.state).toEqual(expectedVals());
    });
  }));

  it('should use alternativeError', ((done) => {
    const component = fixture.componentInstance;
    component.selected = 'alternativeError';
    fixture.detectChanges();
    expect(component.directive.state).toEqual({ state: 'loading' });
    of(null).pipe(delay(LOADING_DELAY)).subscribe(res => {
      component.useAlternative = true;
      fixture.detectChanges();
      expect(component.directive.state.state).toEqual('error');
      done();
    });
  }));

  it('should ngTemplateContextGuard return true', (() => {
    expect(NgxSuspenseOfDirective.ngTemplateContextGuard(null, null)).toEqual(true);
  }));
});
