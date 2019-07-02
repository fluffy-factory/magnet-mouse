var MagnetMouse = (function () {
  'use strict';

  class MagnetMouse {
    constructor({element = 'div', test = 'eee'}) {
      this.element = element;
      this.test = test;
    }

    getPositionMouse(e) {
      let mouseX = e.pageX;
      let mouseY = e.pageY;

      return {
        x: mouseX,
        y: mouseY
      };
    };

    getPositionElement(element) {
      let rect = element.getBoundingClientRect();
      let x = window.pageXOffset || document.documentElement.scrollLeft;
      let y = window.pageYOffset || document.documentElement.scrollTop;

      return {
        x: rect.left + x,
        y: rect.top + y
      }
    };

  }

  return MagnetMouse;

}());
