(function () {
'use strict';


function Grid (size) {
  this.size = size;
}


const gridController = {

  grid: null,

  // this should be called from intro view (not same as grid view)
  init: function () {
    this.grid = new Grid(8);

    gridView.init();
  },

  getGrid: function () {
    return this.grid;
  }
}



const gridView = {

  init: function () {
    this.gridEl = document.getElementById('grid');
    console.log(this.gridEl);

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
    
    this.gridEl.appendChild(squareEl);
    
  }

}

gridController.init();

})();