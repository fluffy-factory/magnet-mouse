(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.MagnetMouse = factory());
}(this, function () { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      keys.push.apply(keys, Object.getOwnPropertySymbols(object));
    }

    if (enumerableOnly) keys = keys.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(source, true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(source).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  var MagnetMouse =
  /*#__PURE__*/
  function () {
    function MagnetMouse(config) {
      _classCallCheck(this, MagnetMouse);

      var magnet = {
        element: '.magnet-mouse',
        class: 'magnet-mouse-active',
        enabled: true,
        distance: 30,
        position: 'center'
      };
      var follow = {
        element: '.follow-mouse',
        class: 'follow-mouse-active'
      };
      var defaults = {
        follow: follow,
        magnet: magnet,
        throttle: 5,
        inCallback: null,
        outCallback: null
      };
      this.config = _objectSpread2({}, defaults, {}, config, {
        magnet: _objectSpread2({}, magnet, {}, config.magnet),
        follow: _objectSpread2({}, follow, {}, config.follow)
      });
      this.elementMagnet = document.querySelectorAll(this.config.magnet.element);
      this.elementFollow = document.querySelectorAll(this.config.follow.element);
    } // Avoid consecutive calls by introducing a delay.


    _createClass(MagnetMouse, [{
      key: "getMousePosition",
      // Return position X and Y of mouse
      value: function getMousePosition(e) {
        var mouseX = e.pageX;
        var mouseY = e.pageY;
        return {
          x: mouseX,
          y: mouseY
        };
      }
    }, {
      key: "getElementsPosition",
      // Return position of each element
      value: function getElementsPosition() {
        var _this = this;

        var elements = [];
        this.elementMagnet.forEach(function (element) {
          var rect = element.getBoundingClientRect();
          var x = window.pageXOffset || document.documentElement.scrollLeft;
          var y = window.pageYOffset || document.documentElement.scrollTop;
          elements.push({
            elem: {
              node: element,
              width: rect.width,
              height: rect.height
            },
            xMin: rect.left + x - _this.config.magnet.distance,
            xMax: rect.left + x + rect.width + _this.config.magnet.distance,
            yMin: rect.top + y - _this.config.magnet.distance,
            yMax: rect.top + y + rect.height + _this.config.magnet.distance
          });
        });
        return elements;
      }
    }, {
      key: "getPosition",
      // Return x,y of mouse with different position in config
      value: function getPosition(data, posMouse) {
        var x;
        var y;

        switch (this.config.magnet.position) {
          case 'top-left':
            x = posMouse.x - (data.xMin + this.config.magnet.distance);
            y = posMouse.y - (data.yMin + this.config.magnet.distance);
            break;

          case 'top-right':
            x = posMouse.x - (data.xMin + data.elem.width + this.config.magnet.distance);
            y = posMouse.y - (data.yMin + this.config.magnet.distance);
            break;

          case 'bottom-left':
            x = posMouse.x - (data.xMin + this.config.magnet.distance);
            y = posMouse.y - (data.yMin + data.elem.height + this.config.magnet.distance);
            break;

          case 'bottom-right':
            x = posMouse.x - (data.xMin + data.elem.width + this.config.magnet.distance);
            y = posMouse.y - (data.yMin + data.elem.height + this.config.magnet.distance);
            break;

          case 'top-center':
            x = posMouse.x - (data.xMin + this.config.magnet.distance + data.elem.width / 2);
            y = posMouse.y - (data.yMin + this.config.magnet.distance);
            break;

          case 'bottom-center':
            x = posMouse.x - (data.xMin + this.config.magnet.distance + data.elem.width / 2);
            y = posMouse.y - (data.yMin + data.elem.height + this.config.magnet.distance);
            break;

          default:
            x = posMouse.x - (data.xMin + this.config.magnet.distance + data.elem.width / 2);
            y = posMouse.y - (data.yMin + this.config.magnet.distance + data.elem.height / 2);
        }

        return {
          x: x,
          y: y
        };
      } // Default action on element (addClass + transform)

    }, {
      key: "defaultAction",
      value: function defaultAction(action, mouseElement, data) {
        if (action === 'onEnter') {
          if (this.elementFollow.length > 0) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
              for (var _iterator = this.elementFollow[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var element = _step.value;
                element.classList.add(this.config.follow.class);
              }
            } catch (err) {
              _didIteratorError = true;
              _iteratorError = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion && _iterator.return != null) {
                  _iterator.return();
                }
              } finally {
                if (_didIteratorError) {
                  throw _iteratorError;
                }
              }
            }
          } // Move element according the mouse


          data.elem.node.style.transform = 'translate3d(' + mouseElement.x + 'px,' + mouseElement.y + 'px, 0)';
          data.elem.node.classList.add(this.config.magnet.class);
        } else if (action === 'onLeave') {
          if (this.elementFollow.length > 0) {
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
              for (var _iterator2 = this.elementFollow[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var _element = _step2.value;

                _element.classList.remove(this.config.follow.class);
              }
            } catch (err) {
              _didIteratorError2 = true;
              _iteratorError2 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                  _iterator2.return();
                }
              } finally {
                if (_didIteratorError2) {
                  throw _iteratorError2;
                }
              }
            }
          } // Places the element in the initial position


          data.elem.node.style.transform = '';
          data.elem.node.classList.remove(this.config.magnet.class);
        }
      } // Magnet element to the mouse with the position specified

    }, {
      key: "magnetElement",
      value: function magnetElement(posElement, posMouse) {
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = posElement[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var data = _step3.value;
            var mouseElement = this.getPosition(data, posMouse);

            if (data.xMin < posMouse.x && data.xMax > posMouse.x && data.yMin < posMouse.y && data.yMax > posMouse.y) {
              this.defaultAction('onEnter', mouseElement, data); // Callback when mouse enter in element else add class

              if (this.config.inCallback !== null && typeof this.config.inCallback === 'function') {
                this.config.inCallback.call(this, data);
              }

              break;
            } else {
              this.defaultAction('onLeave', mouseElement, data); // Callback when mouse leave in element else remove class

              if (this.config.outCallback !== null && typeof this.config.outCallback === 'function') {
                this.config.outCallback.call(this, data);
              }
            }
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
              _iterator3.return();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }
      }
    }, {
      key: "hoverElement",
      // Add class to each element when the mouse enter in their zone
      value: function hoverElement(posElement, posMouse) {
        var _this2 = this;

        posElement.forEach(function (data) {
          var element = data.elem.node;

          if (data.xMin < posMouse.x && data.xMax > posMouse.x && data.yMin < posMouse.y && data.yMax > posMouse.y) {
            element.classList.add(_this2.config.magnet.class);
          } else {
            element.classList.remove(_this2.config.magnet.class);
          }
        });
      }
    }, {
      key: "init",
      value: function init() {
        var _this3 = this;

        var posMouse;
        var posElement;
        var mobileTablet = MagnetMouse.mobileAndTabletcheck(); // Check if user is in mobile or tablet

        if (!mobileTablet) {
          // On resize, calculate position of element
          this.resizeFunction = MagnetMouse.throttle(function () {
            posElement = _this3.getElementsPosition();
          }, this.config.throttle); // On mouse move, magnet element to the mouse or just hover function

          this.mouseFunction = MagnetMouse.throttle(function (e) {
            posMouse = _this3.getMousePosition(e);

            if (_this3.config.magnet.enabled) {
              _this3.magnetElement(posElement, posMouse);
            } else {
              _this3.hoverElement(posElement, posMouse);
            } // Follow mouse


            if (_this3.elementFollow.length > 0) {
              _this3.elementFollow.forEach(function (element) {
                element.style.transform = 'translate3d(' + (posMouse.x - window.pageXOffset) + 'px,' + (posMouse.y - window.pageYOffset) + 'px, 0)';
              });
            }
          }, this.config.throttle);
          window.addEventListener('resize', this.resizeFunction); // Calculate position of element when page load

          document.addEventListener('DOMContentLoaded', function () {
            posElement = _this3.getElementsPosition();
          });
          window.addEventListener('mousemove', this.mouseFunction);
        } else {
          // Remove element follow on mobile/tablet
          this.elementFollow.forEach(function (element) {
            element.remove();
          });
        }
      }
    }, {
      key: "destroy",
      value: function destroy() {
        var _this4 = this;

        window.removeEventListener('mousemove', this.mouseFunction);
        window.removeEventListener('resize', this.resizeFunction);
        this.elementMagnet.forEach(function (element) {
          element.classList.remove(_this4.config.magnet.class);
          element.style.transform = '';
        });
        this.elementFollow.forEach(function (element) {
          element.style.opacity = 0;
        });
      }
    }], [{
      key: "throttle",
      value: function throttle(callback, delay) {
        var last;
        var timer;
        return function () {
          var context = this;
          var now = +new Date();
          var args = arguments;

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
      }
    }, {
      key: "mobileAndTabletcheck",
      // Check if user is in mobile or tablet
      value: function mobileAndTabletcheck() {
        var check = false;

        (function (a) {
          if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
        })(navigator.userAgent || navigator.vendor || window.opera);

        return check;
      }
    }]);

    return MagnetMouse;
  }();

  return MagnetMouse;

}));