(function () {
'use strict';


// Models
// GRID
function Grid (size) {
  
  this.size = size;
  
  this.defaultColor = '#dbdbdb';
  
  this.currentColor = '';

  this.isChangingOpacity = false;

}

function MonocolorGrid (size) {

  Grid.call(this, size);

  this.color = '#b20000'

  this.currentColor = this.color;
}

MonocolorGrid.prototype = Object.create(Grid.prototype);

MonocolorGrid.prototype.update = function () {
  if (this.currentColor !== this.color) { this.currentColor = this.color }
}

// POLYCOLOR GRID --- grid with a predetermined set of colors
function PolycolorGrid (size) {

  Grid.call(this, size);

  this.colors = ['#6290C3', '#C2E7DA', '#F1FFE7', '#1A1B41', '#BAFF29'];

  this.currentColorIndex = 0;

}

PolycolorGrid.prototype = Object.create(Grid.prototype);

PolycolorGrid.prototype.update = function () {
  this.currentColorIndex = (this.currentColorIndex + 1) % this.colors.length;
  this.currentColor = this.colors[this.currentColorIndex];
}

// RANDOM COLOR GRID
function RandomColorGrid (size) {

  Grid.call(this, size);

  this.hexNums = '0123456789ABCDEF';
}

RandomColorGrid.prototype = Object.create(Grid.prototype);

RandomColorGrid.prototype.update = function () {
  let nextColor = '#';
  for (var i = 0; i < 6; i++) {
    nextColor += this.hexNums[Math.floor(Math.random() * 16)];
  }
  this.currentColor = nextColor;
}

// GRADIENT GRID
function GradientGrid (size) {

  Grid.call(this, size);

  this.defaultColor = '#3685B5';

  this.currentColor = this.defaultColor;

  this.isChangingOpacity = true;
}

GradientGrid.prototype = Object.create(Grid.prototype);


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
    } else if (type === 'monocolor') {
      grid = new MonocolorGrid(size);
    }

    return grid;
  } 
}

// SETTINGS
const gridSettings = {

  gridTypes: ['monocolor', 'polycolor', 'random color', 'gradient'],

  gridSizes: [8, 16, 32, 64],

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

  isChangingOpacity: function () {
    return this.grid.isChangingOpacity;
  },

  getDefaultColor: function () {
    return this.grid.defaultColor;
  },

  getCurrentColor: function () {
    if (this.grid.update !== undefined) {
      this.grid.update();
    }
    return this.grid.currentColor;
  },

  clearGrid: function () {
    this.grid.currentColor = this.grid.defaultColor;

    gridView.render();
  },

  updateGridSize: function () {
    this.grid.size = gridSettings.gridSize;
    
    gridView.render();
  },

  updateGridType: function () {
    this.grid.type = gridSettings.grid
  }
}


// GRID SETTINGS CONTROLLER
const gridSettingsController = {

  init: function () {

    gridSettings.gridType = gridSettings.gridTypes[0];
    gridSettings.gridSize = gridSettings.gridSizes[0];
    
    gridSettingsView.init();
  },

  changeGridSize: function (newSize) {
    gridSettings.gridSize = newSize;

    gridController.updateGridSize();
  },

  changeGridType: function (newType) {
    gridSettings.gridType = newType;

    gridController.init();
  },

  getGridTypes: function () {
    return gridSettings.gridTypes;
  },

  getGridSizes: function () {
    return gridSettings.gridSizes;
  }

}

// Grid views
// GRID VIEW
const gridView = {

  init: function () {

    this.gridEl = document.getElementById('grid');
    this.clearButtonEl = document.getElementById('clear-button');

    if (gridController.isChangingOpacity()) {
      this.gridEl.addEventListener('mouseover', (e) => {
        if (e.target.style.opacity < 1) { 
          e.target.style.opacity = parseFloat(e.target.style.opacity) + 0.1; 
        } 
      });
    } else {
      this.gridEl.addEventListener('mouseover', (e) => {
        e.target.style.backgroundColor = gridController.getCurrentColor();
      });
    }
      

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
    if (gridController.isChangingOpacity()) { squareEl.style.opacity = 0.1; }
    
    this.gridEl.appendChild(squareEl);
   
  },

  eraseGrid: function () {
    this.gridEl.innerHTML = '';
  }
}

// GRID SETTINGS VIEW
const gridSettingsView = {

  init: function () {
    this.gridSizesEl = document.querySelector('#grid-size');
    this.gridTypesEl = document.querySelector('#grid-type');
    this.saveSettingsButtonEl = document.querySelector('#save-settings-button');

    this.gridTypesEl.addEventListener('change', () => {
      let gridType = this.gridTypesEl
                      .options[this.gridTypesEl.selectedIndex].text
      gridSettingsController.changeGridType(gridType);
    })

    this.gridSizesEl.addEventListener('change', () => {
      let gridSize = this.gridSizesEl
                      .options[this.gridSizesEl.selectedIndex].text;
      gridSettingsController.changeGridSize(gridSize);
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

    let gridSizes = gridSettingsController.getGridSizes();
    gridSizes.forEach((size) => {
      let optionEl = document.createElement('OPTION');
      optionEl.textContent = size;
      this.gridSizesEl.append(optionEl);
    })
  }

}


// Init
gridSettingsController.init();
gridController.init();

})();