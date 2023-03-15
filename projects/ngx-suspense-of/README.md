<p align="center">
  <a href="https://github.com/Celtian/ngx-suspense-of" target="blank"><img src="assets/logo.svg?sanitize=true" alt="" width="120"></a>
  <h1 align="center">NgxSuspenseOf</h1>
</p>

[![npm version](https://badge.fury.io/js/ngx-suspense-of.svg)](https://badge.fury.io/js/ngx-suspense-of)
[![Package License](https://img.shields.io/npm/l/ngx-suspense-of.svg)](https://www.npmjs.com/ngx-suspense-of)
[![NPM Downloads](https://img.shields.io/npm/dm/ngx-suspense-of.svg)](https://www.npmjs.com/ngx-suspense-of)
[![Build & Publish](https://github.com/celtian/ngx-suspense-of/workflows/Build%20&%20Publish/badge.svg)](https://github.com/celtian/ngx-suspense-of/actions)
[![codecov](https://codecov.io/gh/Celtian/ngx-suspense-of/branch/master/graph/badge.svg?token=1IRUKIKM0D)](https://codecov.io/gh/celtian/ngx-suspense-of/)
[![stars](https://badgen.net/github/stars/celtian/ngx-suspense-of)](https://github.com/celtian/ngx-suspense-of/)
[![forks](https://badgen.net/github/forks/celtian/ngx-suspense-of)](https://github.com/celtian/ngx-suspense-of/)
[![HitCount](http://hits.dwyl.com/celtian/ngx-suspense-of.svg)](http://hits.dwyl.com/celtian/ngx-suspense-of)

> Angular directive for repeating HTML element by count

> ✓ _Angular 15, Ivy and SSR compatible_

Here's the [demo](http://celtian.github.io/ngx-suspense-of/) or [stackblitz live preview](https://stackblitz.com/edit/ngx-suspense-of) or [codesandbox live preview](https://codesandbox.io/s/ngx-suspense-of-60z62)

- Lightweight
- No dependencies!
- Directive way

## Install

1. Use yarn (or npm) to install the package

```terminal
yarn add ngx-suspense-of
```

2. Add NgxSuspenseOfModule into your module `imports`

```typescript
  import { NgxSuspenseOfModule } from 'ngx-suspense-of';

  @NgModule({
   // ...
   imports: [
     // ...
     NgxSuspenseOfModule
   ]
  })
```

## Compatibility

| Angular   | ngx-suspense-of | Install                      |
| --------- | --------------- | ---------------------------- |
| >= 12     | 1.x             | `yarn add ngx-suspense-of`   |
| >= 5 < 13 | 0.x             | `yarn add ngx-suspense-of@0` |

## Quick start

### Example code

```html
<ng-container
  *ngxSuspense="
    let data of observable;
    loading: loading;
    empty: empty;
    error: error"
>
  <pre>{{ data | json }}</pre>
</ng-container>
<ng-template #loading>Loading ...</ng-template>
<ng-template #empty>Incoming data are empty</ng-template>
<ng-template #error let-tryAgain let-error="error">
  <pre>{{ error }}</pre>
  <button (click)="tryAgain()">Try again</button>
</ng-template>
```

## Dependencies

_None_

## License

Copyright &copy; 2021 - 2023 [Dominik Hladik](https://github.com/Celtian)

All contents are licensed under the [MIT license].

[mit license]: LICENSE
