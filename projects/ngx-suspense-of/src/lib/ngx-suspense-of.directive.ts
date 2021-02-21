import { Directive, EmbeddedViewRef, Input, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

/**
 * @publicApi
 */
export class NgxSuspenseDirectiveContext<T> {
  constructor(public $implicit: T) {}
}

export const loading = Symbol();

export type Loading = typeof loading;

export interface NgxSuspenseState<T> {
  state: 'loading' | 'error' | 'data' | 'empty';
  data?: T;
  error?: any;
}

@Directive({
  selector: '[ngxSuspense][ngxSuspenseOf]'
})
export class NgxSuspenseOfDirective<T> implements OnDestroy {
  private sub: Subscription;
  private observable: Observable<T | Loading>;

  constructor(
    private templateRef: TemplateRef<NgxSuspenseDirectiveContext<T>>,
    private viewContainer: ViewContainerRef
  ) {}

  public state: NgxSuspenseState<T> = { state: 'loading' };
  private loadingTemplate: TemplateRef<any>;
  private errorTemplate: TemplateRef<any>;
  private emptyTemplate: TemplateRef<any>;
  private loadingEmbededView: EmbeddedViewRef<any>;
  private errorEmbededView: EmbeddedViewRef<any>;
  private emptyEmbededView: EmbeddedViewRef<any>;
  private templateEmbededView: EmbeddedViewRef<NgxSuspenseDirectiveContext<T>>;

  @Input() public set ngxSuspenseLoading(temp: TemplateRef<any>) {
    this.loadingTemplate = temp;
    if (this.state.state === 'loading') {
      this.setState(this.state);
    }
  }

  @Input() public set ngxSuspenseError(temp: TemplateRef<any>) {
    this.errorTemplate = temp;
    if (this.state.state === 'error') {
      this.setState(this.state);
    }
  }

  @Input() public set ngxSuspenseEmpty(temp: TemplateRef<any>) {
    this.emptyTemplate = temp;
    if (this.state.state === 'empty') {
      this.setState(this.state);
    }
  }

  @Input() public set ngxSuspenseOf(obs: Observable<T | Loading>) {
    if (obs) {
      this.observable = obs;
      this.processObservable();
    }
  }

  /**
   * Asserts the correct type of the context for the template that `NgIf` will render.
   *
   * The presence of this method is a signal to the Ivy template type-check compiler that the
   * `NgIf` structural directive renders its template with a specific context type.
   */
  public static ngTemplateContextGuard<T>(
    dir: NgxSuspenseOfDirective<T>,
    ctx: any
  ): ctx is NgxSuspenseDirectiveContext<T> {
    return true;
  }

  private processObservable(): void {
    this.setState({ state: 'loading' });

    if (this.sub) {
      this.sub.unsubscribe();
      this.sub = null;
    }

    this.sub = this.observable.subscribe(
      (res) => {
        if (typeof res === 'undefined' || res === null || (Array.isArray(res) && res.length === 0)) {
          this.setState({ state: 'empty' });
        } else if (res === loading) {
          this.setState({ state: 'loading' });
        } else {
          this.setState({ state: 'data', data: res });
        }
      },
      (error) => {
        this.setState({ state: 'error', error });
      }
    );
  }

  private setState(state: NgxSuspenseState<T>): void {
    this.state = state;

    this.viewContainer.detach();

    switch (state.state) {
      case 'data': {
        if (!this.templateEmbededView) {
          this.templateEmbededView = this.viewContainer.createEmbeddedView(
            this.templateRef,
            new NgxSuspenseDirectiveContext(state?.data)
          );
          this.templateEmbededView.markForCheck();
        } else {
          this.templateEmbededView.context.$implicit = state?.data;
          this.viewContainer.insert(this.templateEmbededView).markForCheck();
        }
        break;
      }
      case 'loading': {
        this.viewContainer.detach();
        if (this.loadingEmbededView) {
          this.viewContainer.insert(this.loadingEmbededView);
        } else if (this.loadingTemplate) {
          this.loadingEmbededView = this.viewContainer.createEmbeddedView(this.loadingTemplate);
        }
        break;
      }
      case 'error': {
        if (this.errorEmbededView) {
          this.errorEmbededView.context.error = state.error;
          this.errorEmbededView.context.$implicit = () => {
            this.processObservable();
          };
          this.viewContainer.insert(this.errorEmbededView).markForCheck();
        } else if (this.errorTemplate) {
          this.viewContainer
            .createEmbeddedView(this.errorTemplate, {
              $implicit: () => {
                this.processObservable();
              },
              error: state.error.toString()
            })
            .markForCheck();
        }
        break;
      }
      case 'empty': {
        if (this.emptyEmbededView) {
          this.viewContainer.insert(this.emptyEmbededView);
        } else if (this.emptyTemplate) {
          this.emptyEmbededView = this.viewContainer.createEmbeddedView(this.emptyTemplate);
        }
        break;
      }
    }
  }

  public ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
      this.sub = null;
    }
  }
}
