import { JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { concat, Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { NgxSuspenseOfDirective, NgxSuspenseState } from '../../../ngx-suspense-of/src/public-api';
import { VERSION } from '../environments/version';

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
}

const LOADING_DELAY = 1500; // in ms

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true,
  imports: [NgxSuspenseOfDirective, JsonPipe]
})
export class AppComponent implements OnInit {
  public title = 'ngx-suspense-of';
  public version = VERSION;

  public readonly code = `
  <ng-container *ngxSuspense="let data of observable; loading: loading; empty: empty; error: error">
    <pre>{{ data | json }}</pre>
  </ng-container>
  <ng-template #loading>Loading ...</ng-template>
  <ng-template #empty>Incoming data are empty</ng-template>
  <ng-template #error let-tryAgain let-error="error">
    <pre>{{ error }}</pre>
    <button (click)="tryAgain()">Try again</button>
  </ng-template>
  `;

  public observables: TestingObservables;

  public ngOnInit(): void {
    this.observables = {
      arrayCommon: of([1, 2, 3, 4, 5]).pipe(delay(LOADING_DELAY)),
      arrayEmpty: of([]).pipe(delay(LOADING_DELAY)),
      arrayError: concat(of([]).pipe(delay(LOADING_DELAY)), throwError(new Error('Some custom error'))),
      objectCommon: of({ field: 'some value' }).pipe(delay(LOADING_DELAY)),
      objectEmpty: of(null).pipe(delay(LOADING_DELAY)),
      objectError: concat(of(null).pipe(delay(LOADING_DELAY)), throwError(new Error('Some custom error')))
    };
  }

  public onStateChange = <T>(state: NgxSuspenseState<T>): void => {
    console.log(state);
  };
}
