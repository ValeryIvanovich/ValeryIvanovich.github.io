'use strict';

class Board {
  ctx;
  ctxNext;
  grid;
  piece;
  next;
  requestId;
  time;

  constructor(ctx, ctxNext) {
    this.ctx = ctx;
    this.ctxNext = ctxNext;
    this.init();
  }

  init() {
    // Расчитываем размер игрового поля canvas с помощью констант
    this.ctx.canvas.width = COLS * BLOCK_SIZE;
    this.ctx.canvas.height = ROWS * BLOCK_SIZE;

    // установим масштаб, чтобы постоянно не перерисовывать
    this.ctx.scale(BLOCK_SIZE, BLOCK_SIZE);
  }

  // сброс когда начинаем игру
  reset() {
    this.grid = this.getEmptyGrid();
    this.piece = new Piece(this.ctx);
    this.piece.setStartingPosition();
    this.getNewPiece();
  }

  // следующая фигурка тетриса
  getNewPiece() {
    this.next = new Piece(this.ctxNext);
    this.ctxNext.clearRect(
      0,
      0, 
      this.ctxNext.canvas.width, 
      this.ctxNext.canvas.height
    );
    this.next.draw();
  }

  draw() {
    this.piece.draw();
    this.drawBoard();
  }

  drop() {
    let p = moves[KEY.DOWN](this.piece);
    if (this.valid(p)) {
      this.piece.move(p);
    } else {
      this.freeze();
      this.clearLines();
      if (this.piece.y === 0) {
        // Game over
        return false;
      }
      this.piece = this.next;
      this.piece.ctx = this.ctx;
      this.piece.setStartingPosition();
      this.getNewPiece();
    }
    return true;
  }

  // удаление заполненных линий
  clearLines() {
    let lines = 0;
    let audioLine = document.getElementById('audioLine');
    audioLine.volume = 0.8;

    this.grid.forEach((row, y) => {

      // если значение каждого блока больше 0
      if (row.every(value => value > 0)) {
        lines++; // плюсуем к количеству линий 1

        // очищаем строку
        this.grid.splice(y, 1);

        // добавляем строку из нулей вверху
        this.grid.unshift(Array(COLS).fill(0));
      }
    });
    
    if (lines > 0) {
      // считаем очки за линии и сами линии
      audioLine.play();
      account.score += this.getLinesClearedPoints(lines);
      account.lines += lines;

      // если количество линий достигнуло до след уровня
      if (account.lines >= LINES_PER_LEVEL) {
        // прибавляем уровень
        account.level++;  
        
        // очищаем количесво строк в новом уровне
        account.lines -= LINES_PER_LEVEL;

        // увеличиваем скорость игры
        time.level = LEVEL[account.level];
      }
    }
  }

  valid(p) { // проверка на столкновение с другими фигурами и стенками
    return p.shape.every((row, dy) => {
      return row.every((value, dx) => {
        let x = p.x + dx;
        let y = p.y + dy;
        return (
          value === 0 ||
          (this.insideWalls(x) && this.aboveFloor(y) && this.notOccupied(x, y))
        );
      });
    });
  }

  // если мы больше не можем двигаться вниз, то останавливаем фигуру и создаем новую
  freeze() {
    this.piece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          this.grid[y + this.piece.y][x + this.piece.x] = value;
        }
      });
    });
  }

  drawBoard() {
    this.grid.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          this.ctx.fillStyle = COLORS[value];
          this.ctx.fillRect(x, y, 1, 1);
        }
      });
    });
  }

   
  getEmptyGrid() {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  }

  // ограничение стенами тетриса
  insideWalls(x) {
    return x >= 0 && x < COLS;
  }

  // ограничение полом тетриса
  aboveFloor(y) {
    return y <= ROWS;
  }

  notOccupied(x, y) {
    return this.grid[y] && this.grid[y][x] === 0;
  }

  rotate(piece) {
    // Клонируем с помощью JSON для неизменности
    let p = JSON.parse(JSON.stringify(piece));

    // транспонируем матрицу для поворота фигуры
    for (let y = 0; y < p.shape.length; ++y) {
      for (let x = 0; x < y; ++x) {
        [p.shape[x][y], p.shape[y][x]] = [p.shape[y][x], p.shape[x][y]];
      }
    }

    // обратный порядок столбцов
    p.shape.forEach(row => row.reverse());
    return p;
  }

  // если удалено несколько линий сразу
  getLinesClearedPoints(lines, level) {
    const lineClearPoints =
      lines === 1
        ? POINTS.SINGLE
        : lines === 2
        ? POINTS.DOUBLE
        : lines === 3
        ? POINTS.TRIPLE
        : lines === 4
        ? POINTS.TETRIS
        : 0;

    return (account.level + 1) * lineClearPoints;
  }
}
