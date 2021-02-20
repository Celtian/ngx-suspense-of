<p align="center">
  <a href="https://github.com/Celtian/ngx-suspense-of" target="blank"><img src="assets/logo.svg?sanitize=true" alt="" width="120"></a>
  <h1 align="center">NgxSuspenseOf</h1>
</p>

[![npm version](https://badge.fury.io/js/ngx-suspense-of.svg)](https://badge.fury.io/js/ngx-suspense-of)
[![Package License](https://img.shields.io/npm/l/ngx-suspense-of.svg)](https://www.npmjs.com/ngx-suspense-of)
[![NPM Downloads](https://img.shields.io/npm/dm/ngx-suspense-of.svg)](https://www.npmjs.com/ngx-suspense-of)
[![Build & Publish](https://github.com/celtian/ngx-suspense-of/workflows/Build%20&%20Publish/badge.svg)](https://github.com/celtian/ngx-suspense-of/actions)
[![volkswagen status](https://auchenberg.github.io/volkswagen/volkswargen_ci.svg?v=1)](https://github.com/auchenberg/volkswagen)
[![codecov](https://codecov.io/gh/Celtian/ngx-suspense-of/branch/master/graph/badge.svg?token=1IRUKIKM0D)](https://codecov.io/gh/celtian/ngx-suspense-of/)
[![stars](https://badgen.net/github/stars/celtian/ngx-suspense-of)](https://github.com/celtian/ngx-suspense-of/)
[![forks](https://badgen.net/github/forks/celtian/ngx-suspense-of)](https://github.com/celtian/ngx-suspense-of/)
[![HitCount](http://hits.dwyl.com/celtian/ngx-suspense-of.svg)](http://hits.dwyl.com/celtian/ngx-suspense-of)

> Angular directive for repeating HTML element by count

> ✓ _Angular 11, Ivy and SSR compatible_

Here's the [demo](http://celtian.github.io/ngx-suspense-of/) or [stackblitz live preview](https://stackblitz.com/edit/ngx-suspense-of)

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

## Quick start

### Example code

```html
<div
  *ngxSuspense="3; 
    let index = index;
    let even = even;
    let odd = odd;
    let first = first;
    let last = last;"
>
  {{ index }} {{ even }} {{ odd }} {{ first }} {{ last }}
</div>
```

### Result

```code
  0 true false true false
  1 false true false false
  2 true false false true
```

## Dependencies

_None_

## License

Copyright &copy; 2021 [Dominik Hladik](https://github.com/Celtian)

All contents are licensed under the [MIT license].

[mit license]: LICENSE
