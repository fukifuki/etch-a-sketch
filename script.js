(function () {
'use strict';


// Models
// GRID
function Grid (size) {
  
  this.size = size;
  
  this.defaultColor = '#dbdbdb';
  
  this.nextColor = '';

}

// POLYCOLOR GRID --- grid with a predetermined set of colors
function PolycolorGrid (size) {

  Grid.call(this, size);

  this.colors = ['#6290C3', '#C2E7DA', '#F1FFE7', '#1A1B41', '#BAFF29'];

  this.nextColorIndex = 0;

}

PolycolorGrid.prototype = Object.create(Grid.prototype);

PolycolorGrid.prototype.setNextColor = function () {
  this.nextColorIndex = (this.nextColorIndex + 1) % this.colors.length;
  this.nextColor = this.colors[this.nextColorIndex];
}

// RANDOM COLOR GRID
function RandomColorGrid (size) {

  Grid.call(this, size);

  this.hexNums = '0123456789ABCDEF';
}

RandomColorGrid.prototype = Object.create(Grid.prototype);

RandomColorGrid.prototype.setNextColor = function () {
  let nextColor = '#';
  for (var i = 0; i < 6; i++) {
    nextColor += this.hexNums[Math.floor(Math.random() * 16)];
  }
  this.nextColor = nextColor;
}

// grid factory
function GridFactory () {
  this.createGrid = function (type, size) {
    let grid;

    if (type === 'polycolor') {
      grid = new PolycolorGrid(size);
    } else if (type === 'random color') {
      grid = new RandomColorGrid(size);
    } else if (type === 'gradient') {
      grid = new GradientGrid(size);
    }

    return grid;
  } 
}

// SETTINGS
const gridSettings = {

  gridTypes: ['polycolor', 'random color', 'gradient'],

  gridType: '',

  gridSize: 0

}


// Controllers
// GRID CONTROLLER
const gridController = {

  grid: null,

  gridFactory: new GridFactory(),
  // this should be called from intro view (not same as grid view)
  init: function () {

    this.setGrid();

    gridView.init();
  },

  setGrid: function () {
    this.grid = this.gridFactory
      .createGrid(gridSettings.gridType, gridSettings.gridSize);
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


// GRID SETTINGS CONTROLLER
const gridSettingsController = {

  init: function () {

    gridSettings.gridType = gridSettings.gridTypes[0];
    gridSettings.gridSize = gridSettings.gridSize = 64;
    
    gridSettingsView.init();
  },

  update: function (gridSize, gridType) {
    gridSettings.gridSize = gridSize;
    gridSettings.gridType = gridType;
    
    gridController.init();
  },

  getGridTypes: function () {
    return gridSettings.gridTypes;
  }

}

// Grid views
// GRID VIEW
const gridView = {

  init: function () {

    this.gridEl = document.getElementById('grid');
    this.clearButtonEl = document.getElementById('clear-button');

    this.gridEl.addEventListener('mouseover', (e) => {
      e.target.style.backgroundColor = gridController.getNextColor();
    });

    this.clearButtonEl.addEventListener('click', () => {
      gridController.clearGrid();
    });

    this.render();
  },

  render: function () {

    this.eraseGrid();

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
   
  },

  eraseGrid: function () {
    // while (this.gridEl.firstChild) { 
    //   this.gridEl.removeChild(this.gridEl.firstChild);
    // };
    this.gridEl.innerHTML = '';
    // }
  }
}

// GRID SETTINGS VIEW
const gridSettingsView = {

  init: function () {
    this.gridSizeEl = document.querySelector('#grid-size');
    this.gridTypesEl = document.querySelector('#grid-type');
    this.saveSettingsButtonEl = document.querySelector('#save-settings-button');
    
    this.saveSettingsButtonEl.addEventListener('click', () => {
      let gridType = this.gridTypesEl
                      .options[this.gridTypesEl.selectedIndex].text
      gridSettingsController
        .update(this.gridSizeEl.value, gridType);
    });

    this.render();
  },

  render: function () {
    let gridTypes = gridSettingsController.getGridTypes();
    gridTypes.forEach((type) => {
      let optionEl = document.createElement('OPTION');
      optionEl.textContent = type;
      this.gridTypesEl.append(optionEl);
    });
  }

}


// Init
gridSettingsController.init();
gridController.init();

})();