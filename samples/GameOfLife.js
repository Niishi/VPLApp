var w;
var columns;
var rows;
var board;
var next;

setup = function(){
  var canvas = createCanvas(720, 400);
  canvas.parent('sketch');
  w = 20;
  columns = floor(width / w);
  rows = floor(height / w);
  board = new Array(columns);
  for (var i = 0; i < columns; i++ ) {
    board[i] = new Array(rows);
  }
  next = new Array(columns);
  for ( i = 0; i < columns; i++ ) {
    next[i] = new Array(rows);
  }
  init();
};

draw = function(){
  background(255);
  generate();
  for (var i = 0; i < columns; i++ ) {
    for (var j = 0; j < rows; j++ ) {
      if (board[i][j] == 1) {
        fill(0);
      } else {
        fill('#ff0000');
      }
      stroke(0);
      rect(i * w, j * w, w - 1, w - 1);
    }
  }
};

mousePressed = function(){
  init();
};

function init(){
  for (var i = 0; i < columns; i++ ) {
    for (var j = 0; j < rows; j++ ) {
      if (i == 0 || j == 0 || i == columns - 1 || j == rows - 1) {
        board[i][j] = 0;
      } else {
        board[i][j] = floor(random(2));
      }
      next[i][j] = 0;
    }
  }
}

function generate(){
  for (var x = 1; x < columns - 1; x++ ) {
    for (var y = 1; y < rows - 1; y++ ) {
      var neighbors = 0;
      for (var i = -1; i <= 1; i++ ) {
        for (var j = -1; j <= 1; j++ ) {
          neighbors += board[x + i][y + j];
        }
      }
      neighbors -= board[x][y];
      if (board[x][y] == 1 && neighbors < 2) {
        next[x][y] = 0;
      } else {
        if (board[x][y] == 1 && neighbors > 3) {
          next[x][y] = 0;
        } else {
          if (board[x][y] == 0 && neighbors == 3) {
            next[x][y] = 1;
          } else {
            next[x][y] = board[x][y];
          }
        }
      }
    }
  }
  var temp = board;
  board = next;
  next = temp;
}

a;

i;
