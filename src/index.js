export default class MagnetMouse {

  constructor(config) {

    let defaults = {
      magnet: {
        element: '.magnet-mouse',
        class: 'magnet-mouse-active',
        enabled: true,
        distance: 20,
        position: 'center'
      },
      follow: {
        element: '.follow-mouse',
        class: 'follow-mouse-active'
      },
      throttle: 10,
      inCallback: null,
      outCallback: null,
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
      source.forEach(function (e, i) {
        if (typeof destination[i] === 'undefined') {
          destination[i] = cloneIfNecessary(e, optionsArgument)
        } else if (isMergeableObject(e)) {
          destination[i] = deepmerge(target[i], e, optionsArgument)
        } else if (target.indexOf(e) === -1) {
          destination.push(cloneIfNecessary(e, optionsArgument))
        }
      });
      return destination
    }

    function mergeObject(target, source, optionsArgument) {
      let destination = {};
      if (isMergeableObject(target)) {
        Object.keys(target).forEach(function (key) {
          destination[key] = cloneIfNecessary(target[key], optionsArgument)
        })
      }
      Object.keys(source).forEach(function (key) {
        if (!isMergeableObject(source[key]) || !target[key]) {
          destination[key] = cloneIfNecessary(source[key], optionsArgument)
        } else {
          destination[key] = deepmerge(target[key], source[key], optionsArgument)
        }
      });
      return destination
    }

    function deepmerge(target, source, optionsArgument) {
      let array = Array.isArray(source);
      let options = optionsArgument || {arrayMerge: defaultArrayMerge};
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

        if ($this.elementFollow.length > 0) {
          $this.elementFollow.forEach(function (element) {
            element.classList.add($this.config.follow.class);
          });
        }

        // Callback when mouse enter in element else add class
        if ($this.config.inCallback !== null && typeof $this.config.inCallback === 'function') {

          $this.config.inCallback.call(this, data);

        } else {

          // Move element accordiing the mouse
          data.elem.node.style.transform = 'translate3d(' + x + 'px,' + y + 'px, 0)';
          data.elem.node.classList.add($this.config.magnet.class);

        }
      } else {

        if ($this.elementFollow.length > 0) {
          $this.elementFollow.forEach(function (element) {
            element.classList.remove($this.config.follow.class);
          });
        }

        // Callback when mouse leave in element else remove class
        if ($this.config.outCallback !== null && typeof $this.config.outCallback === 'function') {

          $this.config.outCallback.call(this, data);

        } else {

          // Places the element in the initial position
          data.elem.node.classList.remove($this.config.magnet.class);
          data.elem.node.style.transform = '';

        }
      }
    });
  };

  static mobileAndTabletcheck() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
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
    let posMouse, posElement, $this = this, mobileTablet = MagnetMouse.mobileAndTabletcheck();

    if (!mobileTablet) {
      // On resize, calculate position of element
      this.resizeFunction = MagnetMouse.throttle(() => {
        posElement = $this.getPositionElement();
      }, $this.config.throttle);

      // On mouse move, magnet element to the mouse or just hover function
      this.mouseFunction = MagnetMouse.throttle((e) => {
        posMouse = MagnetMouse.getPositionMouse(e);

        if ($this.config.magnet.enabled) {
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

    } else {

      $this.elementFollow.parentNode.removeChild($this.elementFollow);

    }
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