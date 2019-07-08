var MagnetMouse = (function () {
  'use strict';

  class MagnetMouse {

    constructor(config) {

      let defaults = {
        magnet: {
          element: '.magnet-mouse',
          class: 'magnet-mouse-active',
          active: true,
          distance: 20,
          position: 'center'
        },
        follow: {
          element: '.follow-mouse',
          class: 'follow-mouse-active'
        },
        throttle: 10
      };

      function isMergeableObject(val) {
        let nonNullObject = val && typeof val === 'object';

        return nonNullObject
          && Object.prototype.toString.call(val) !== '[object RegExp]'
          && Object.prototype.toString.call(val) !== '[object Date]'
      }

      function emptyTarget(val) {
        return Array.isArray(val) ? [] : {}
      }

      function cloneIfNecessary(value, optionsArgument) {
        let clone = optionsArgument && optionsArgument.clone === true;
        return (clone && isMergeableObject(value)) ? deepmerge(emptyTarget(value), value, optionsArgument) : value
      }

      function defaultArrayMerge(target, source, optionsArgument) {
        let destination = target.slice();
        source.forEach(function(e, i) {
          if (typeof destination[i] === 'undefined') {
            destination[i] = cloneIfNecessary(e, optionsArgument);
          } else if (isMergeableObject(e)) {
            destination[i] = deepmerge(target[i], e, optionsArgument);
          } else if (target.indexOf(e) === -1) {
            destination.push(cloneIfNecessary(e, optionsArgument));
          }
        });
        return destination
      }

      function mergeObject(target, source, optionsArgument) {
        let destination = {};
        if (isMergeableObject(target)) {
          Object.keys(target).forEach(function (key) {
            destination[key] = cloneIfNecessary(target[key], optionsArgument);
          });
        }
        Object.keys(source).forEach(function (key) {
          if (!isMergeableObject(source[key]) || !target[key]) {
            destination[key] = cloneIfNecessary(source[key], optionsArgument);
          } else {
            destination[key] = deepmerge(target[key], source[key], optionsArgument);
          }
        });
        return destination
      }

      function deepmerge(target, source, optionsArgument) {
        let array = Array.isArray(source);
        let options = optionsArgument || { arrayMerge: defaultArrayMerge };
        let arrayMerge = options.arrayMerge || defaultArrayMerge;

        if (array) {
          return Array.isArray(target) ? arrayMerge(target, source, optionsArgument) : cloneIfNecessary(source, optionsArgument)
        } else {
          return mergeObject(target, source, optionsArgument)
        }
      }

      this.config = deepmerge(defaults, config);

      this.elementMagnet = document.querySelectorAll(this.config.magnet.element);
      this.elementFollow = document.querySelectorAll(this.config.follow.element);
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
          xMin: rect.left + x - $this.config.magnet.distance,
          xMax: rect.left + x + rect.width + $this.config.magnet.distance,
          yMin: rect.top + y - $this.config.magnet.distance,
          yMax: rect.top + y + rect.height + $this.config.magnet.distance,
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
              x = posMouse.x - (data.xMin + $this.config.magnet.distance);
              y = posMouse.y - (data.yMin + $this.config.magnet.distance);
              break;

            case 'top-right':
              x = posMouse.x - (data.xMin + data.elem.width + $this.config.magnet.distance);
              y = posMouse.y - (data.yMin + $this.config.magnet.distance);
              break;

            case 'bottom-left':
              x = posMouse.x - (data.xMin + $this.config.magnet.distance);
              y = posMouse.y - (data.yMin + data.elem.height + $this.config.magnet.distance);
              break;

            case 'bottom-right':
              x = posMouse.x - (data.xMin + data.elem.width + $this.config.magnet.distance);
              y = posMouse.y - (data.yMin + data.elem.height + $this.config.magnet.distance);
              break;

            case 'top-center':
              x = posMouse.x - (data.xMin + $this.config.magnet.distance + data.elem.width / 2);
              y = posMouse.y - (data.yMin + $this.config.magnet.distance);
              break;

            case 'bottom-center':
              x = posMouse.x - (data.xMin + $this.config.magnet.distance + data.elem.width / 2);
              y = posMouse.y - (data.yMin + data.elem.height + $this.config.magnet.distance);
              break;

            default:
              x = posMouse.x - (data.xMin + $this.config.magnet.distance + data.elem.width / 2);
              y = posMouse.y - (data.yMin + $this.config.magnet.distance + data.elem.height / 2);
          }

          data.elem.node.style.transform = 'translate3d(' + x + 'px,' + y + 'px, 0)';
          data.elem.node.classList.add($this.config.magnet.class);

          if ($this.elementFollow.length > 0) {
            $this.elementFollow.forEach(function (element) {
              element.classList.add($this.config.follow.class);
            });
          }

        } else {
          data.elem.node.classList.remove($this.config.magnet.class);
          data.elem.node.style.transform = '';

          if ($this.elementFollow.length > 0) {
            $this.elementFollow.forEach(function (element) {
              element.classList.remove($this.config.follow.class);
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
          data.elem.node.classList.add($this.config.magnet.class);
        } else {
          data.elem.node.classList.remove($this.config.magnet.class);
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
        element.classList.remove($this.config.magnet.class);
        element.style.transform = '';
      });

      this.elementFollow.forEach(function (element) {
        element.style.opacity = 0;
      });
    }
  }

  return MagnetMouse;

}());
