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

const test = (element) => {
  let div = document.querySelector(element);

  console.log(div);
  
  window.addEventListener('mousemove', function (e) {
    let pos = getPositionMouse(e);

    console.log(pos.y);
  });


  window.addEventListener('resize', function (e) {
    let divOffset = getPositionElement(div);

    console.log(divOffset.y);
  });
};

export default class MagnetMouse {
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