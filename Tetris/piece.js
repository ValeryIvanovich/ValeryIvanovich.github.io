'use strict';
// объект класса Piece должен знать свое начальное положение, цвет, фигуру
class Piece {
  x;
  y;
  color;
  shape;
  ctx;
  typeId;

  constructor(ctx) {
    this.ctx = ctx;
    this.spawn();
  }

  spawn() {
    this.typeId = this.randomizeTetrominoType(COLORS.length - 1); // идентифицируем фигуру
    this.shape = SHAPES[this.typeId]; // сама фигура
    this.color = COLORS[this.typeId]; // цвет
    this.x = 0; // начальное положение
    this.y = 0;
  }

  // Чтобы нарисовать фигуру тетриса на доске, проходим все ячейки фигуры. Если значение в ячейке больше нуля, то окрашиваем этот блок
  // this.x, this.y дает левую верхнюю позицию фигуры
  // x, y положение блока фигуры
  // this.x + x - это позиция фигуры на доске
  draw() {
    this.ctx.fillStyle = this.color;
    this.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          this.ctx.fillRect(this.x + x, this.y + y, 1, 1);
        }
      });
    });
  }

  move(p) {
    this.x = p.x;
    this.y = p.y;
    this.shape = p.shape;
  }

  setStartingPosition() {
    this.x = this.typeId === 4 ? 4 : 3;
  }

  randomizeTetrominoType(noOfTypes) {
    return Math.floor(Math.random() * noOfTypes + 1);
  }
}
