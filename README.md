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