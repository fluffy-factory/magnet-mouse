export default class MagnetMouse {

  constructor(config) {

    let defaults = {
      element: '.btn',
      magnet: {
        active: true,
        position: 'center'
      },
      activationDistance: 20,
      activeClass: 'magnet-mouse-active',
      throttle: 50,
    };

    this.config = {...defaults, ...config};
  }

  static throttle(callback, delay) {
    let last;
    let timer;
    return function () {
      let context = this;
      let now = +new Date();
      let args = arguments;
      if (last && now < last + delay) {
        clearTimeout(timer);
        timer = setTimeout(function () {
          last = now;
          callback.apply(context, args);
        }, delay);
      } else {
        last = now;
        callback.apply(context, args);
      }
    };
  };

  static getPositionMouse(e) {
    let mouseX = e.pageX;
    let mouseY = e.pageY;

    return {
      x: mouseX,
      y: mouseY
    };
  };

  getPositionElement() {

    let $this = this;
    let element = document.querySelectorAll(this.config.element);
    let elements = [];

    element.forEach(function (element) {
      let rect = element.getBoundingClientRect();
      let x = window.pageXOffset || document.documentElement.scrollLeft;
      let y = window.pageYOffset || document.documentElement.scrollTop;

      elements.push({
        elem: {
          node: element,
          width: rect.width,
          height: rect.height
        },
        xMin: rect.left + x - $this.config.activationDistance,
        xMax: rect.left + x + rect.width + $this.config.activationDistance,
        yMin: rect.top + y - $this.config.activationDistance,
        yMax: rect.top + y + rect.height + $this.config.activationDistance,
      });
    });

    return elements;
  };

  magnetElement(posElement, posMouse) {
    let $this = this;

    posElement.forEach(function (data) {
      if (data.xMin < posMouse.x && data.xMax > posMouse.x && data.yMin < posMouse.y && data.yMax > posMouse.y) {

        let x, y;

        switch ($this.config.magnet.position) {

          case 'top-left':
            x = posMouse.x - (data.xMin + $this.config.activationDistance);
            y = posMouse.y + (data.yMin + $this.config.activationDistance / 2);
            break;

          case 'top-right':
            x = posMouse.x - (data.xMin + data.elem.width + $this.config.activationDistance);
            y = posMouse.y + (data.yMin + $this.config.activationDistance / 2);
            break;

          case 'bottom-left':
            x = posMouse.x - (data.xMin + $this.config.activationDistance);
            y = posMouse.y - (data.yMin + data.elem.height + $this.config.activationDistance);
            break;

          case 'bottom-right':
            x = posMouse.x - (data.xMin + data.elem.width + $this.config.activationDistance);
            y = posMouse.y - (data.yMin + data.elem.height + $this.config.activationDistance);
            break;

          case 'top-center':
            x = posMouse.x - (data.xMin + data.elem.width - $this.config.activationDistance / 2);
            y = posMouse.y + (data.yMin + $this.config.activationDistance / 2);
            break;

          case 'bottom-center':
            x = posMouse.x - (data.xMin + data.elem.width - $this.config.activationDistance / 2);
            y = posMouse.y - (data.yMin + data.elem.height + $this.config.activationDistance);
            break;

          default:
            x = posMouse.x - (data.xMin + data.elem.width - $this.config.activationDistance / 2);
            y = posMouse.y - (data.yMin + data.elem.height - $this.config.activationDistance / 2);
        }

        data.elem.node.style.transform = 'translate3d(' + x + 'px,' + y + 'px, 0)';
        data.elem.node.classList.add($this.config.activeClass);
      } else {
        data.elem.node.classList.remove($this.config.activeClass);
        data.elem.node.style.transform = '';
      }
    });
  };

  hoverElement(posElement, posMouse) {
    let $this = this;

    posElement.forEach(function (data) {
      if (data.xMin < posMouse.x && data.xMax > posMouse.x && data.yMin < posMouse.y && data.yMax > posMouse.y) {
        data.elem.node.classList.add($this.config.activeClass);
      } else {
        data.elem.node.classList.remove($this.config.activeClass);
      }
    });
  };

  init() {

    let posMouse, posElement, $this = this;

    window.addEventListener('resize', MagnetMouse.throttle(() => {
      posElement = $this.getPositionElement();

    }, $this.config.throttle));

    posElement = $this.getPositionElement();

    window.addEventListener('mousemove', MagnetMouse.throttle((e) => {
      posMouse = MagnetMouse.getPositionMouse(e);

      if ($this.config.magnet.active) {
        $this.magnetElement(posElement, posMouse);
      } else {
        $this.hoverElement(posElement, posMouse);
      }

    }, $this.config.throttle));

  }
}