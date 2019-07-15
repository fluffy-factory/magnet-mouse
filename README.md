<h1 align="center">
  <a href="https://github.com/fluffy-factory/magnet-mouse"><img width="200" src="/docs/assets/img/magnet-mouse.png"></a>
  <br>
  Magnet mouse
</h1>

<blockquote align="center">
  <em>Magnet-mouse.js</em> is a JavaScript animation library which allows DOM elements to follow the mouse with many parameters.<br>
  It works with <strong>DOM attributes, JavaScript Objects and CSS properties</strong>.
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

For the transition of the element when the cursor hovers it, you must add CSS:

```css
.magnet {
  transition: transform .3s ease;
}
```

## Documentation

### Options

```json5
{
  magnet: {
    element: '.magnet-mouse', /* Element to magnet */
    class: 'magnet-mouse-active', /* Adds a class when the magnet effect begins */
    enabled: true, /* Enables the magnet effect */
    distance: 20, /* Distance (in px) when the magnet effect around element activates */
    position: 'center' /* Position of mouse relative to the element when magnet effect is active */
  }, 
  follow: {
    element: '.follow-mouse', /* Element that follows the mouse */
    class: 'follow-mouse-active' /* Add class to element that follows the mouse when enter in the magnet effect */
  },
  throttle: 10, /* Time (in ms) between each eventListener calls */
  inCallback: null, /* Callback when mouse enters in the magnet effect */
  outCallback: null /* Callback when mouse leaves in the magnet effect */
}
```

For position, you have multiple choices :

```javascript
position: 'center' /* center by default, top-left, top-right, bottom-left, bottom-right, top-center, bottom-center */
```

When using callbacks, the target element's properties are accessible:

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

Result returns:

```json5
{
  elem: {
    height: 58, /* Height of the element (in px) */
    width: 126.65625, /* Width of the element (in px) */
    node: 'div.magnet.one' /* Node of the element */
  },
  xMax: 1106.65625, /* Right position of the element  */
  xMin: 940, /* Left position of the element */
  yMax: 194, /* Bottom position of the element */
  yMin: 96 /* Top position of the element */
}
```

### Methods

### init

Initializes Magnet mouse

```javascript
mm.init();
```

#### getPositionElement

Returns the position of each element (same json above)

```javascript
mm.getPositionElements();
```

#### getPositionMouse

Returns the mouse's position (posX and posY)

```javascript
mm.getPositionMouse(window.event);
```

### destroy

Destroys a Magnet mouse (Removes eventListener and CSS classes)

```javascript
mm.destroy();
```

## Demos and examples

* [Basic usage](https://fluffy-factory.github.io/magnet-mouse/#basic-usage)
* [Follow mouse](https://fluffy-factory.github.io/magnet-mouse/#follow-mouse)
* [Position](https://fluffy-factory.github.io/magnet-mouse/#position)
* [Callback](https://fluffy-factory.github.io/magnet-mouse/#callback)
* [Examples](https://fluffy-factory.github.io/magnet-mouse/#examples)
* [Menu](https://fluffy-factory.github.io/magnet-mouse/#menu)
* [Fun follow](https://fluffy-factory.github.io/magnet-mouse/#fun-follow)

## Mobile and tablet

On mobile and tablets there is no mouse, so the plugin is automatically disabled on these platforms.

## <img src="/docs/assets/img/magnet-mouse.png" width="30"/>&nbsp;&nbsp;Magnet mouse

[Website](https://fluffy-factory.github.io/magnet-mouse/) |  [MIT License](https://github.com/fluffy-factory/magnet-mouse/blob/master/LICENCE.md) | © 2019 [Fluffy Factory](https://github.com/fluffy-factory)