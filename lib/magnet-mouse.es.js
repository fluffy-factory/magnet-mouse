var MagnetMouse = (function () {
  'use strict';

  class MagnetMouse {

    constructor(config) {

      let defaults = {
        elementMagnet: '.magnet-mouse',
        elementFollow: '.follow-mouse',
        magnet: {
          active: true,
          position: 'center'
        },
        activationDistance: 20,
        activeClass: 'magnet-mouse-active',
        throttle: 10
      };

      this.config = {...defaults, ...config};
      this.elementMagnet = document.querySelectorAll(this.config.elementMagnet);
      this.elementFollow = document.querySelectorAll(this.config.elementFollow);
    }

    // Avoid consecutive calls by introducing a delay.
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

    // Return position X and Y of mouse
    static getPositionMouse(e) {
      let mouseX = e.pageX;
      let mouseY = e.pageY;

      return {
        x: mouseX,
        y: mouseY
      };
    };

    // Return position of each element
    getPositionElement() {

      let $this = this;
      let elements = [];

      this.elementMagnet.forEach(function (element) {
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

    // Magnet element to the mouse with the position specified
    magnetElement(posElement, posMouse) {
      let $this = this;

      posElement.forEach(function (data) {
        if (data.xMin < posMouse.x && data.xMax > posMouse.x && data.yMin < posMouse.y && data.yMax > posMouse.y) {

          let x, y;

          switch ($this.config.magnet.position) {

            case 'top-left':
              x = posMouse.x - (data.xMin + $this.config.activationDistance);
              y = posMouse.y - (data.yMin + $this.config.activationDistance);
              break;

            case 'top-right':
              x = posMouse.x - (data.xMin + data.elem.width + $this.config.activationDistance);
              y = posMouse.y - (data.yMin + $this.config.activationDistance);
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
              x = posMouse.x - (data.xMin + $this.config.activationDistance + data.elem.width / 2);
              y = posMouse.y - (data.yMin + $this.config.activationDistance);
              break;

            case 'bottom-center':
              x = posMouse.x - (data.xMin + $this.config.activationDistance + data.elem.width / 2);
              y = posMouse.y - (data.yMin + data.elem.height + $this.config.activationDistance);
              break;

            default:
              x = posMouse.x - (data.xMin + $this.config.activationDistance + data.elem.width / 2);
              y = posMouse.y - (data.yMin + $this.config.activationDistance + data.elem.height / 2);
          }

          data.elem.node.style.transform = 'translate3d(' + x + 'px,' + y + 'px, 0)';
          data.elem.node.classList.add($this.config.activeClass);

          if ($this.elementFollow.length > 0) {
            $this.elementFollow.forEach(function (element) {
              element.classList.add('follow-mouse-active');
            });
          }

        } else {
          data.elem.node.classList.remove($this.config.activeClass);
          data.elem.node.style.transform = '';

          if ($this.elementFollow.length > 0) {
            $this.elementFollow.forEach(function (element) {
              element.classList.remove('follow-mouse-active');
            });
          }
        }
      });
    };

    // Add class to each element when the mouse enter in their zone
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

      // On resize, calculate position of element
      this.resizeFunction = MagnetMouse.throttle(() => {
        posElement = $this.getPositionElement();
      }, $this.config.throttle);

      // On mouse move, magnet element to the mouse or just hover function
      this.mouseFunction = MagnetMouse.throttle((e) => {
        posMouse = MagnetMouse.getPositionMouse(e);

        if ($this.config.magnet.active) {
          $this.magnetElement(posElement, posMouse);
        } else {
          $this.hoverElement(posElement, posMouse);
        }

        if (this.elementFollow.length > 0) {
          this.elementFollow.forEach(function (element) {
            element.style.transform = 'translate3d(' + posMouse.x + 'px,' + posMouse.y + 'px, 0)';
          });
        }

      }, $this.config.throttle);

      window.addEventListener('resize', this.resizeFunction);

      // Calculate position of element when page load
      document.addEventListener('DOMContentLoaded', function () {
        posElement = $this.getPositionElement();
      });

      window.addEventListener('mousemove', this.mouseFunction);
    }

    destroy() {
      window.removeEventListener('mousemove', this.mouseFunction);
      window.removeEventListener('resize', this.resizeFunction);

      let $this = this;

      this.elementMagnet.forEach(function (element) {
        element.classList.remove($this.config.activeClass);
        element.style.transform = '';
      });

      this.elementFollow.forEach(function (element) {
        element.style.opacity = 0;
      });
    }
  }

  return MagnetMouse;

}());
