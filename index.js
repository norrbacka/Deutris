const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const rows = 9; 
const cols = 6; 
const blockSize = 42;

const grid = [];
let current;

for (let row = 0; row < rows; row++) {
  grid[row] = new Array(cols).fill(0);
}

const shapes = 
[
  [
    [1, 1, 1],
  ],
  [
    [0, 1], // [1, 1] -> [1, 1] -> [1, 0]
    [1, 1]  // [0, 1] -> [1, 0] -> [1, 1]
  ],
  [
    [1, 0],
    [1, 1],
  ]
];

function rotateUp(shape) { 
    if(JSON.stringify(shape) === JSON.stringify([[1, 1, 1]])) return [[1], [1], [1]];
    if(JSON.stringify(shape) === JSON.stringify([[1], [1], [1]])) return [[1, 1, 1]];
    if(JSON.stringify(shape) === JSON.stringify([[0, 1], [1, 1]])) return [[1, 1], [0, 1]];
    if(JSON.stringify(shape) === JSON.stringify([[1, 1], [0, 1]])) return [[1, 1], [1, 0]];
    if(JSON.stringify(shape) === JSON.stringify([[1, 1], [1, 0]])) return [[1, 0], [1, 1]];
    if(JSON.stringify(shape) === JSON.stringify([[1, 0], [1, 1]])) return [[0, 1], [1, 1]];
    if(JSON.stringify(shape) === JSON.stringify([[1, 0], [1, 1]])) return [[0, 1], [1, 1]];
    if(JSON.stringify(shape) === JSON.stringify([[0, 1], [1, 1]])) return [[1, 1], [0, 1]];
    if(JSON.stringify(shape) === JSON.stringify([[1, 1], [0, 1]])) return [[1, 1], [1, 0]];
    if(JSON.stringify(shape) === JSON.stringify([[1, 1], [1, 0]])) return [[1, 0], [1, 1]];
}

function rotateDown(shape) { 
    if(JSON.stringify(shape) === JSON.stringify([[1, 1, 1]])) return [[1], [1], [1]];
    if(JSON.stringify(shape) === JSON.stringify([[1], [1], [1]])) return [[1, 1, 1]];
    
    if(JSON.stringify(shape) === JSON.stringify([[0, 1], [1, 1]])) return [[1, 0], [1, 1]];
    if(JSON.stringify(shape) === JSON.stringify([[1, 0], [1, 1]])) return [[1, 1], [0, 1]];
    if(JSON.stringify(shape) === JSON.stringify([[1, 1], [0, 1]])) return [[1, 1], [1, 0]];
    if(JSON.stringify(shape) === JSON.stringify([[1, 1], [1, 0]])) return [[0, 1], [1, 1]];

    if(JSON.stringify(shape) === JSON.stringify([[1, 0], [1, 1]])) return [[1, 1], [0, 1]];
    if(JSON.stringify(shape) === JSON.stringify([[1, 1], [0, 1]])) return [[1, 1], [1, 0]];
    if(JSON.stringify(shape) === JSON.stringify([[1, 1], [1, 0]])) return [[0, 1], [1, 1]];
    if(JSON.stringify(shape) === JSON.stringify([[0, 1], [1, 1]])) return [[1, 0], [1, 1]];
}

function getRed() {
    return "rgb(255, 0, 0)";
}

function getGreen() {
    return "rgb(0, 255, 0)";
}

function getBlue() {
    return "rgb(0,0, 255)";
}

function randomShape() {
  const shapeIndex = Math.floor(Math.random() * shapes.length);
  return {
    shape: shapes[shapeIndex],
    row: 0,
    col: Math.floor(cols / 2) - 1,
    color: shapeIndex == 0 ? getRed() : shapeIndex == 1 ?  getGreen() : getBlue()
  };
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (grid[row][col] === 1) {
        ctx.fillStyle = 'white';
        ctx.fillRect(col * blockSize, row * blockSize, blockSize, blockSize);
        ctx.strokeRect(col * blockSize, row * blockSize, blockSize, blockSize);
      }
    }
  }
  const { shape, row, col, color } = current;
  for (let i = 0; i < shape.length; i++) {
    for (let j = 0; j < shape[i].length; j++) {
      if (shape[i][j] === 1) {
        ctx.fillStyle = color;
        ctx.fillRect((col + j) * blockSize, (row + i) * blockSize, blockSize, blockSize);
        ctx.strokeRect((col + j) * blockSize, (row + i) * blockSize, blockSize, blockSize);
      }
    }
  }
}

// Check if the current triomino can move down
function canMoveDown() {
  const { shape, row, col } = current;
  for (let i = 0; i < shape.length; i++) {
    for (let j = 0; j < shape[i].length; j++) {
      if (shape[i][j] === 1) {
        const newRow = row + i + 1;
        const newCol = col + j;

        if (newRow >= 9 || grid[newRow][newCol] === 1) {
          return false;
        }
      }
    }
  }
  return true;
}

// Place the current triomino on the grid
function placeTriomino() {
  const { shape, row, col } = current;
  for (let i = 0; i < shape.length; i++) {
    for (let j = 0; j < shape[i].length; j++) {
      if (shape[i][j] === 1) {
        grid[row + i][col + j] = 1;
      }
    }
  }
}


// Move the triomino down or place it on the grid if it can't move
function update() {
  if (canMoveDown()) {
    current.row++;
  } else {
    placeTriomino();
    current = randomShape(); // Create a new triomino
  }
}

// Game loop
let i = 0;
function gameLoop() {
  i++;
  if(i%100 === 0 && canMoveDown()) {
    current.row++;
  } 
  if(!canMoveDown()) {
    placeTriomino();
    current = randomShape(); // Create a new triomino
  }  
  draw();
  setTimeout(gameLoop, 1); // Game speed
}

let debounceTimeout;
const debounceDelay = 100; // delay in milliseconds

document.addEventListener('keydown', (e) => {
    if (debounceTimeout) return; // if debounceTimeout exists, exit the function
    
    debounceTimeout = setTimeout(() => {
        debounceTimeout = null; // reset the debounceTimeout after the delay

        const isMoveLeftPossible = 
            e.code === 'ArrowLeft' && 
            current.col > 0;

        const isMoveRightPossible = 
            e.code === 'ArrowRight' && 
            current.col < cols - current.shape[0].length;

        if (e.code === 'ArrowUp') 
        {
            let newShape = rotateUp(current.shape);
            current = Object.assign({...current, shape: newShape});
        } 
        if (e.code === 'ArrowDown') 
        {
            let newShape  = rotateDown(current.shape);
            current = Object.assign({...current, shape: newShape});
        } 
        if (isMoveLeftPossible) 
        {
            current.col--;
        } 
        if (isMoveRightPossible) 
        {
            current.col++;
        }
    }, debounceDelay);
});


// Start the game
current = randomShape();

gameLoop();

