# UnifiedTransform.js - Combining CSS/SVG Transforms into a single Transform

[![NPM Package](https://img.shields.io/npm/v/unifiedtransform.svg?style=flat)](https://npmjs.org/package/unifiedtransform "View this project on npm")
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

**UnifiedTransform.js** is a JavaScript library to combine multiple CSS transform commands by multiplying the matrices one after the other. This is especially useful when you want to retain the combined effect of individual transformations after removing the DOM hierarchy where each level previously applied its own transform.

## Example / Motivation

Previous:

```html
<div style="transform: translate(15px, 400px) scale(0.3);">
  <div style="transform: rotate(85deg);">
    <div style="transform: translateY(100px) rotate(33deg);">rawr</div>
  </div>
</div>
```

Then apply **UnitTransform.js**:

```js
import UnifiedTransform from 'unifiedtransform';

const cm = new UnifiedTransform;

cm.transform('translate(15px, 400px) scale(0.3)');
cm.rotate(85);
cm.transform('translateY(100px) rotate(33deg)')

document.getElementById("newDom").style.transform = cm.toTransformString());
```

Which simplies the HTML to:

```html
<div id="newDom">rawr</div>
```

## Methods

### UnifiedTransform transform(str)

Parses a transform string and applies each transformation one after the other

### UnifiedTransform translate(tx, ty)

Specifies a 2D translation by the vector (tx, ty)

### UnifiedTransform scale(sx, sy = null)

Specifies a 2D scale operation by the (sx, sy) scaling vector described by the 2 parameters. If the second parameter is omitted, the scaling is applied symmetrically. 

### UnifiedTransform rotate(angle, x, y)

Specifies a 2D rotation by the angle specified in the parameter about the origin of the element or optionally the given point (x, y)

### UnifiedTransform skewX(degrees)

Specifies a 2D skew transformation along the X axis by the given angle.

### UnifiedTransform skewY(degrees)

Specifies a 2D skew transformation along the Y axis by the given angle.

### UnifiedTransform applyMatrix(m)

Specifies a 2D transformation in the form of a transformation matrix of the six values [a, b, c, d, x, y]

### Array eval(x, y)

Evaluates a point using the current transformation matrix and returns the new point

### Array toMatrix(2D = false)

Gets the 3x3 transform matrix of the current homogeneous transformation, optionally as a 2D array.

### String toTransformString()

Gets a CSS transform string to apply the current matrix


## Installation

Installing UnifiedTransform is as easy as cloning this repo or use the following command:

```
npm install unifiedtransform
```

## Using UnifiedTransform.js with TypeScript

```js
import UnifiedTransform from "unifiedtransform";
const cm = new UnifiedTransform();
...
```



## Coding Style

As every library I publish, UnifiedTransform.js is also built to be as small as possible after compressing it with Google Closure Compiler in advanced mode. Thus the coding style orientates a little on maxing-out the compression rate. Please make sure you keep this style if you plan to extend the library.

## Building the library

After cloning the Git repository run:

```
npm install
npm run build
```

## Run a test

Testing the source against the shipped test suite is as easy as

```
npm run test
```

## Copyright and Licensing

Copyright (c) 2024, [Robert Eisele](https://raw.org/)
Licensed under the MIT license.
