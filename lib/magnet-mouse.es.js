/*
 * magnet-mouse.js v1.0.0
 * (c) 2019 Guillaume Egloff
 */

var defaultMagnetSettings = {
  element: 'div',
};

var getPositionMouse = function (e) {
  var mouseX = e.pageX;
  var mouseY = e.pageY;

  return {
    x: mouseX,
    y: mouseY
  };
};

var getPositionElement = function (element) {
  var rect = element.getBoundingClientRect();
  var x = window.pageXOffset || document.documentElement.scrollLeft;
  var y = window.pageYOffset || document.documentElement.scrollTop;

  return {
    x: rect.left + x,
    y: rect.top + y
  }
};

function magnetMouse() {
  var div = document.querySelector(defaultMagnetSettings.element);

  window.addEventListener('mousemove', function (e) {
    var pos = getPositionMouse(e);

    console.log(pos.y);
  });


  window.addEventListener('resize', function (e) {
    var divOffset = getPositionElement(div);

    console.log(divOffset.y);
  });
}

export { magnetMouse };
