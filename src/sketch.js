for( of ){
}

new Koma('飛', n + dir, , , );

koma_list.push();

for (var i = 0; i < MASU_COUNT; i++ ) {
  koma_list.push(new Koma('歩', n, i, isSente, fu));
}

function initKoma(){
}

koma_list = [];
let isSente = true;
let dir = 1;
fu = function( r, c){
  var dir;
  if (this.r + dir == r && this.c == c) {
    if (isExistMikata(r, c, this.isSente)) {
      return false;
    }
    return true;
  }
  return false;
};
kyo = function( r, c){
  if (this.c != c) {
    return false;
  }
  if (this.isSente && r < this.r || !this.isSente && r > this.r) {
    var dir;
    if (this.isSente) {
      for (var i = this.r + dir; i >= r; i-- ) {
        if (findKoma(i, c)) {
          return false;
        }
      }
    } else {
      for (var i = this.r + dir; i < r; i++ ) {
        if (findKoma(i, c)) {
          return false;
        }
      }
    }
    if (!isExistMikata(r, c, this.isSente)) {
      return true;
    }
  }
  return false;
};
keima = function( r, c){
  if (this.c + 1 == c || this.c - 1 == c) {
    var dir;
    if (this.r + dir == r) {
      if (!isExistMikata(r, c, this.isSente)) {
        return true;
      }
    }
  }
  return false;
};
gin = function( r, c){
  if (this.isSente) {
    if (this.r - 1 == r) {
      if (this.c + 1 == c || this.c == c || this.c - 1 == c) {
        if (!isExistMikata(r, c, this.isSente)) {
          return true;
        }
      }
    } else {
      if (this.r + 1 == r) {
        if (this.c + 1 == c || this.c - 1 == c) {
          if (!isExistMikata(r, c, this.isSente)) {
            return true;
          }
        }
      }
    }
  } else {
    if (this.r + 1 == r) {
      if (this.c + 1 == c || this.c == c || this.c - 1 == c) {
        if (!isExistMikata(r, c, this.isSente)) {
          return true;
        }
      }
    } else {
      if (this.r - 1 == r) {
        if (this.c + 1 == c || this.c - 1 == c) {
          if (!isExistMikata(r, c, this.isSente)) {
            return true;
          }
        }
      }
    }
  }
  return false;
};
kin = function( r, c){
  if (this.isSente) {
    if (this.r - 1 == r) {
      if (this.c + 1 == c || this.c == c || this.c - 1 == c) {
        if (!isExistMikata(r, c, this.isSente)) {
          return true;
        }
      }
    } else {
      if (this.r + 1 == r) {
        if (this.c == c) {
          if (!isExistMikata(r, c, this.isSente)) {
            return true;
          }
        }
      } else {
        if (this.r == r) {
          if (this.c + 1 == c || this.c - 1 == c) {
            if (!isExistMikata(r, c, this.isSente)) {
              return true;
            }
          }
        }
      }
    }
  } else {
    if (this.r + 1 == r) {
      if (this.c + 1 == c || this.c == c || this.c - 1 == c) {
        if (!isExistMikata(r, c, this.isSente)) {
          return true;
        }
      }
    } else {
      if (this.r - 1 == r) {
        if (this.c == c) {
          if (!isExistMikata(r, c, this.isSente)) {
            return true;
          }
        }
      } else {
        if (this.r == r) {
          if (this.c + 1 == c || this.c - 1 == c) {
            if (!isExistMikata(r, c, this.isSente)) {
              return true;
            }
          }
        }
      }
    }
  }
  return false;
};
gyoku = function( r, c){
  if (this.r == r && this.c == c) {
    return false;
  }
  if (this.r - 1 == r || this.r == r || this.r + 1 == r) {
    if (this.c - 1 == c || this.c == c || this.c + 1 == c) {
      return true;
    }
  }
  return false;
};
hisha = function( r, c){
  if (r == this.r && c == this.c) {
    return false;
  }
  if (r == this.r) {
    if (c > this.c) {
      for (var i = this.c + 1; i < c; i++ ) {
        if (findKoma(r, i)) {
          return false;
        }
      }
    } else {
      for (var i = this.c - 1; i > c; i-- ) {
        if (findKoma(r, i)) {
          return false;
        }
      }
    }
    if (!isExistMikata(r, c, this.isSente)) {
      return true;
    }
  }
  if (c == this.c) {
    if (r > this.r) {
      for (var i = this.r + 1; i < r; i++ ) {
        if (findKoma(i, c)) {
          return false;
        }
      }
    } else {
      for (var i = this.r - 1; i > r; i-- ) {
        if (findKoma(i, c)) {
          return false;
        }
      }
    }
    if (!isExistMikata(r, c, this.isSente)) {
      return true;
    }
  }
  return false;
};
kaku = function( r, c){
  if (r == this.r && c == this.c) {
    return false;
  }
  if (direction(r, this.r) != direction(c, this.c)) {
    return false;
  }
  let dirR;
  let dirC;
  let ir = this.r;
  let ic = this.c;
  for (var i = 0; i < direction(r, this.r) - 1; i++ ) {
    ir += dirR;
    ic += dirC;
    if (findKoma(ir, ic)) {
      return false;
    }
  }
  if (!isExistMikata(r, c, this.isSente)) {
    return true;
  }
  return false;
};

[6, 2];

n;

var selectedKoma;

setup = function(){
  var canvas = createCanvas(1200, 820);
  canvas.parent('sketch');
  print('setup');
}

var koma_list;
const margin_y = 100;
const margin_x = 100;
const MASU_SIZE = 60;
const MASU_COUNT = 9;
const BOARD_WIDTH = MASU_SIZE * MASU_COUNT;
var turn = true;

function isExistMikata(r, c, sente){
  var koma = findKoma(r, c);
  if (koma && koma.isSente == sente) {
    return true;
  }
  return false;
}
