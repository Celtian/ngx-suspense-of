/* eslint-disable @typescript-eslint/no-explicit-any */
import { JsonPipe, NgTemplateOutlet } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, concat, of, throwError } from 'rxjs';
import { delay, startWith } from 'rxjs/operators';
import { Loading, NgxSuspenseOfDirective, NgxSuspenseState, loading } from './ngx-suspense-of.directive';

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
    imports: [NgxSuspenseOfDirective, NgTemplateOutlet, JsonPipe],
    template: `
      @switch (selected) {
        @case ('arrayCommon') {
          <ng-container
            [ngTemplateOutlet]="data"
            [ngTemplateOutletContext]="{ observable: observables?.arrayCommon }"
          />
        }
        @case ('arrayEmpty') {
          <ng-container [ngTemplateOutlet]="data" [ngTemplateOutletContext]="{ observable: observables?.arrayEmpty }" />
        }
        @case ('arrayError') {
          <ng-container [ngTemplateOutlet]="data" [ngTemplateOutletContext]="{ observable: observables?.arrayError }" />
        }
        @case ('objectCommon') {
          <ng-container
            [ngTemplateOutlet]="data"
            [ngTemplateOutletContext]="{ observable: observables?.objectCommon }"
          />
        }
        @case ('objectEmpty') {
          <ng-container
            [ngTemplateOutlet]="data"
            [ngTemplateOutletContext]="{ observable: observables?.objectEmpty }"
          />
        }
        @case ('objectError') {
          <ng-container
            [ngTemplateOutlet]="data"
            [ngTemplateOutletContext]="{ observable: observables?.objectError }"
          />
        }
        @case ('noObservable') {
          <ng-container
            [ngTemplateOutlet]="data"
            [ngTemplateOutletContext]="{ observable: observables?.noObservable }"
          />
        }
        @case ('infiniteLoading') {
          <ng-container
            [ngTemplateOutlet]="data"
            [ngTemplateOutletContext]="{ observable: observables?.infiniteLoading }"
          />
        }
        @case ('noLoadingEmbed') {
          <ng-container *ngxSuspense="let data of observable?.noLoadingEmbed; empty: empty; error: error">
            <pre>{{ data | json }}</pre>
          </ng-container>
        }
        @case ('noEmptyEmbed') {
          <ng-container *ngxSuspense="let data of observable?.noEmptyEmbed; loading: loading; error: error">
            <pre>{{ data | json }}</pre>
          </ng-container>
        }
        @case ('noErrorEmbed') {
          <ng-container *ngxSuspense="let data of observables?.noErrorEmbed; loading: loading; empty: empty">
            <pre>{{ data | json }}</pre>
          </ng-container>
        }
        @case ('alternativeLoading') {
          <ng-container
            [ngTemplateOutlet]="data"
            [ngTemplateOutletContext]="{
              observable: observables?.infiniteLoading,
              alternativeLoading: useAlternative
            }"
          />
        }
        @case ('alternativeEmpty') {
          <ng-container
            [ngTemplateOutlet]="data"
            [ngTemplateOutletContext]="{
              observable: observables?.infiniteLoading,
              alternativeEmpty: useAlternative
            }"
          />
        }
        @case ('alternativeError') {
          <ng-container
            [ngTemplateOutlet]="data"
            [ngTemplateOutletContext]="{
              observable: observables?.alternativeError,
              alternativeError: useAlternative
            }"
          />
        }
      }
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
            error: alternativeError ? altError : error
          "
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

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      imports: [TestDirectiveComponent]
    }).createComponent(TestDirectiveComponent);

    fixture.detectChanges();
  });

  it('should create an instance', () => {
    const component = fixture.componentInstance;
    fixture.detectChanges();
    fixture.whenStable().then((done) => {
      expect(component.directive).toBeTruthy();
      done();
    });
  });

  it('should use arrayCommon', (done) => {
    const expectedVals = expectToSubscribe<NgxSuspenseState<number[]>>(
      [{ state: 'loading' }, { state: 'data', data: [1, 2, 3, 4, 5] }],
      () => done()
    );
    const component = fixture.componentInstance;
    component.selected = 'arrayCommon';
    fixture.detectChanges();
    component.observables.arrayCommon.pipe(delay(LOADING_DELAY), startWith(loading)).subscribe(() => {
      fixture.detectChanges();
      expect(component.directive.state).toEqual(expectedVals());
    });
  });

  it('should use arrayEmpty', (done) => {
    const expectedVals = expectToSubscribe<NgxSuspenseState<number[]>>([{ state: 'loading' }, { state: 'empty' }], () =>
      done()
    );
    const component = fixture.componentInstance;
    component.selected = 'arrayEmpty';
    fixture.detectChanges();
    component.observables.arrayEmpty.pipe(delay(LOADING_DELAY), startWith(loading)).subscribe(() => {
      fixture.detectChanges();
      expect(component.directive.state).toEqual(expectedVals());
    });
  });

  it('should use arrayError', (done) => {
    const component = fixture.componentInstance;
    component.selected = 'arrayError';
    fixture.detectChanges();
    expect(component.directive.state).toEqual({ state: 'loading' });
    of(null)
      .pipe(delay(LOADING_DELAY))
      .subscribe(() => {
        expect(component.directive.state.state).toEqual('error');
        done();
      });
  });

  it('should use objectCommon', (done) => {
    const expectedVals = expectToSubscribe<NgxSuspenseState<TestingObject>>(
      [{ state: 'loading' }, { state: 'data', data: { field: 'some value' } }],
      () => done()
    );
    const component = fixture.componentInstance;
    component.selected = 'objectCommon';
    fixture.detectChanges();
    component.observables.objectCommon.pipe(delay(LOADING_DELAY), startWith(loading)).subscribe(() => {
      fixture.detectChanges();
      expect(component.directive.state).toEqual(expectedVals());
    });
  });

  it('should use objectEmpty', (done) => {
    const expectedVals = expectToSubscribe<NgxSuspenseState<TestingObject>>(
      [{ state: 'loading' }, { state: 'empty' }],
      () => done()
    );
    const component = fixture.componentInstance;
    component.selected = 'objectEmpty';
    fixture.detectChanges();
    component.observables.objectEmpty.pipe(delay(LOADING_DELAY), startWith(loading)).subscribe(() => {
      fixture.detectChanges();
      expect(component.directive.state).toEqual(expectedVals());
    });
  });

  it('should use objectError', (done) => {
    const component = fixture.componentInstance;
    component.selected = 'objectError';
    fixture.detectChanges();
    expect(component.directive.state).toEqual({ state: 'loading' });
    of(null)
      .pipe(delay(LOADING_DELAY))
      .subscribe(() => {
        expect(component.directive.state.state).toEqual('error');
        done();
      });
  });

  it('should use noObservable', () => {
    const component = fixture.componentInstance;
    component.selected = 'noObservable';
    fixture.detectChanges();
    expect(component.directive.state).toEqual({ state: 'loading' });
  });

  it('should use infiniteLoading', () => {
    const component = fixture.componentInstance;
    component.selected = 'infiniteLoading';
    fixture.detectChanges();
    expect(component.directive.state).toEqual({ state: 'loading' });
  });

  it('should use noLoadingEmbed', () => {
    const component = fixture.componentInstance;
    component.selected = 'noLoadingEmbed';
    fixture.detectChanges();
    expect(component.directive.state).toEqual({ state: 'loading' });
  });

  it('should use noEmptyEmbed', (done) => {
    const expectedVals = expectToSubscribe<NgxSuspenseState<number[]>>([{ state: 'loading' }, { state: 'empty' }], () =>
      done()
    );
    const component = fixture.componentInstance;
    component.selected = 'noEmptyEmbed';
    fixture.detectChanges();
    component.observables.noEmptyEmbed.pipe(delay(LOADING_DELAY), startWith(loading)).subscribe(() => {
      fixture.detectChanges();
      expect(component.directive.state).toEqual(expectedVals());
    });
  });

  it('should use noErrorEmbed', () => {
    const component = fixture.componentInstance;
    component.selected = 'noErrorEmbed';
    fixture.detectChanges();
    fixture.whenStable().then((done) => {
      expect(component.directive.state).toEqual({ state: 'loading' });
      of(null)
        .pipe(delay(LOADING_DELAY))
        .subscribe(() => {
          expect(component.directive.state.state).toEqual('error');
          done();
        });
    });
  });

  it('should use alternativeLoading', () => {
    const component = fixture.componentInstance;
    component.selected = 'alternativeLoading';
    fixture.detectChanges();
    fixture.whenStable().then((done) => {
      expect(component.directive.state).toEqual({ state: 'loading' });
      component.useAlternative = true;
      fixture.detectChanges();
      of(null)
        .pipe(delay(LOADING_DELAY))
        .subscribe(() => {
          expect(component.directive.state).toEqual({ state: 'loading' });
          done();
        });
    });
  });

  it('should use alternativeEmpty', () => {
    const component = fixture.componentInstance;
    component.selected = 'alternativeEmpty';
    fixture.detectChanges();
    fixture.whenStable().then((done) => {
      const expectedVals = expectToSubscribe<NgxSuspenseState<number[]>>(
        [{ state: 'loading' }, { state: 'empty' }],
        () => done()
      );

      component.observables.noEmptyEmbed.pipe(delay(LOADING_DELAY), startWith(loading)).subscribe((res) => {
        if (res !== loading) {
          component.useAlternative = true;
        }
        fixture.detectChanges();
        expect(component.directive.state).toEqual(expectedVals());
      });
    });
  });

  it('should use alternativeError', () => {
    const component = fixture.componentInstance;
    component.selected = 'alternativeError';
    fixture.detectChanges();
    fixture.whenStable().then((done) => {
      expect(component.directive.state).toEqual({ state: 'loading' });
      of(null)
        .pipe(delay(LOADING_DELAY))
        .subscribe(() => {
          component.useAlternative = true;
          fixture.detectChanges();
          expect(component.directive.state.state).toEqual('error');
          done();
        });
    });
  });

  it('should ngTemplateContextGuard return true', () => {
    expect(NgxSuspenseOfDirective.ngTemplateContextGuard(null, null)).toEqual(true);
  });
});
