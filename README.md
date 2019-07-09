<h1 align="center">
  <a href="https://github.com/fluffy-factory/magnet-mouse"><img width="200" src="/docs/assets/img/magnet-mouse.png"></a>
  <br>
  Magnet mouse
</h1>

<blockquote align="center">
  <em>Magnet-mouse.js</em> is a JavaScript animation library which allows elements of the DOM to follow the mouse with many parameters.<br>
  It works with DOM attributes, JavaScript Objects and CSS properties.
</blockquote>

<p align="center">
  <a href="#getting-started">Getting started</a>&nbsp;|&nbsp;<a href="#documentation">Documentation</a>&nbsp;|&nbsp;<a href="https://fluffy-factory.github.io/magnet-mouse/" target="_blank">Demos and examples</a>
</p>

## Getting started

### Download

Via npm

```
npm install fluffy-factory/magnet-mouse --save
```

or manual [download](https://github.com/fluffy-factory/magnet-mouse/archive/master.zip).

### Installation

3 possibilities to install the plugin (import, require or by file include).

#### Import

```javascript
import MagnetMouse from 'magnet-mouse';
```

#### Require

```javascript
const magnetMouse = require('magnet-mouse');
```

#### File include

Link `magnet-mouse.min.js` in your HTML :

```html
<script src="magnet-mouse.min.js"></script>
```

### Basic usage

```javascript
let mm = new MagnetMouse({
  magnet: {
    element: '.magnet'
  }
});

mm.init();
```

You can destroy it everywhere with:

```javascript
mm.destroy();
```

## Documentation

### Options

```json5
{
  magnet: {
    element: '.magnet-mouse', /* Element to magnet */
    class: 'magnet-mouse-active', /* Add class when magnet effect begin */
    enabled: true, /* Enabled magnet effect */
    distance: 20, /* Distance (in px) when magnet effect around element is active */
    position: 'center' /* Position of mouse on the element when magnet effect is active */
  }, 
  follow: {
    element: '.follow-mouse', /* Element that follows the mouse */
    class: 'follow-mouse-active' /* Add class to element that follows the mouse when enter in the magnet effect */
  },
  throttle: 10, /* Time (in ms) between each eventListener call */
  inCallback: null, /* Callback when mouse enter in the magnet effect */
  outCallback: null /* Callback when mouse leave in the magnet effect */
}
```

For position you have multiple choices :

```javascript
position: 'center' /* center by default, top-left, top-right, bottom-left, bottom-right, top-center, bottom-center */
```

When you want use the callback you have access to element properties:

```javascript
let mm = new MagnetMouse({
  magnet: {
    element: '.magnet'
  },
  inCallback: function (data) {
    console.log(data);
  }
});

```

Result return:

```json5
{
  elem: {
    height: 58, /* Height of element (in px) */
    width: 126.65625, /* Width of element (in px) */
    node: 'div.magnet.one' /* Node of element */
  },
  xMax: 1106.65625, /* Position right of element  */
  xMin: 940, /* Position left of element */
  yMax: 194, /* Position bottom of element */
  yMin: 96 /* Position top of element */
}
```

### Methods

#### getPositionElement

Return position of each element (same json above)

```javascript
mm.getPositionElements();
```

### init

Init instance of Magnet mouse

```javascript
mm.init();
```

### destroy

Destroy instance of Magnet mouse (Remove eventListener and class CSS)

```javascript
mm.destroy();
```

## Demos and examples

<a href="https://fluffy-factory.github.io/magnet-mouse/" target="_blank">See the demo</a>.
<br><br>

## <img src="/docs/assets/img/magnet-mouse.png" width="30"/>&nbsp;&nbsp;Magnet mouse

[Website](https://fluffy-factory.github.io/magnet-mouse/) |  [MIT License](https://github.com/fluffy-factory/magnet-mouse/blob/master/LICENCE.md) | © 2019 Fluffy Factory