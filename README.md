<h1 align="center">
  <a href="https://github.com/fluffy-factory/magnet-mouse"><img width="200" src="/docs/assets/img/magnet-mouse.png"></a>
  <br>
  Magnet mouse
</h1>

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