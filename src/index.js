const defaultMagnetSettings = {
  element: 'div',
};

const getPositionMouse = (e) => {
  let mouseX = e.pageX;
  let mouseY = e.pageY;

  return {
    x: mouseX,
    y: mouseY
  };
};

const getPositionElement = (element) => {
  let rect = element.getBoundingClientRect();
  let x = window.pageXOffset || document.documentElement.scrollLeft;
  let y = window.pageYOffset || document.documentElement.scrollTop;

  return {
    x: rect.left + x,
    y: rect.top + y
  }
};

export function magnetMouse() {
  let div = document.querySelector(defaultMagnetSettings.element);

  window.addEventListener('mousemove', function (e) {
    let pos = getPositionMouse(e);

    console.log(pos.y);
  });


  window.addEventListener('resize', function (e) {
    let divOffset = getPositionElement(div);

    console.log(divOffset.y);
  });
};