(function () {
'use strict';


function Grid (size) {
  this.size = size;

  this.colors = ['red', 'blue', 'green', 'brown', 'yellow'];

  this.defaultColor = 'grey';

  this.nextColor = '';
}


Grid.prototype.setNextColor = function () {
  let randomColorIndex = Math.floor(Math.random() * this.colors.length);
  this.nextColor = this.colors[randomColorIndex];
}


const gridController = {

  grid: null,

  // this should be called from intro view (not same as grid view)
  init: function () {
    // grid size shouldn't be hardcoded
    this.grid = new Grid(64);

    gridView.init();
  },


  getGrid: function () {
    return this.grid;
  },

  getDefaultColor: function () {
    return this.grid.defaultColor;
  },

  getNextColor: function () {
    this.grid.setNextColor();
    return this.grid.nextColor;
  },

  clearGrid: function () {
    this.grid.nextColor = this.grid.defaultColor;

    gridView.render();
  }
}



const gridView = {

  init: function () {

    this.gridEl = document.getElementById('grid');
    this.clearButtonEl = document.getElementById('clear-button');

    this.gridEl.addEventListener('mouseover', (e) => {
      console.log(gridController.getNextColor());
      e.target.style.backgroundColor = gridController.getNextColor();
    });

    this.clearButtonEl.addEventListener('click', () => {
      while (this.gridEl.firstChild) { 
        this.gridEl.removeChild(this.gridEl.firstChild);
      };
      gridController.clearGrid();
    });

    this.render();
  },

  render: function () {

    let grid = gridController.getGrid();

    let squareElWidth = this.gridEl.offsetWidth / grid.size;
    let squareElHeight = this.gridEl.offsetHeight / grid.size;
   
    // fill grid with squares of appropriate size
    for (var i = 0; i < grid.size; i++) {
      for (var j = 0; j < grid.size; j++) {
        this.addSquare(squareElWidth, squareElHeight);
      }
    }   
  },

  addSquare: function (width, height) {

    let squareEl = document.createElement('div');
    squareEl.classList.add('square');
    squareEl.style.width = width + 'px';
    squareEl.style.height = height + 'px';
    squareEl.style.backgroundColor = gridController.getDefaultColor();
    
    this.gridEl.appendChild(squareEl);
   
  }

}

gridController.init();

})();