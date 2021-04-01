const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const canvasNext = document.getElementById('next');
const ctxNext = canvasNext.getContext('2d');

var audioGame = document.getElementById('audioGame'); // мелодия при старте игры
audioGame.volume = 0.1; // громкость мелодии
var audioGameOver = document.getElementById('audioGameOver'); // мелодия при проигрыше

// через Proxy добавяем значения в accountValues
let accountValues = {
  score: 0,
  level: 0,
  lines: 0
}

function updateAccount(key, value) {
  let element = document.getElementById(key);
  if (element) {
    element.textContent = value;
  }
}
// accountValues - объект-цель, {
/*set: (target, key, value) => {
    target[key] = value;
    updateAccount(key, value);
    return true;
  } объект-обработчик*/
  // через Proxy добавяем значения в accountValues

let account = new Proxy(accountValues, {
  set: (target, key, value) => {
    target[key] = value;
    updateAccount(key, value);
    return true;
  }
});

let requestId;

moves = {
  [KEY.LEFT]: p => ({ ...p, x: p.x - 1 }),
  [KEY.RIGHT]: p => ({ ...p, x: p.x + 1 }),
  [KEY.DOWN]: p => ({ ...p, y: p.y + 1 }),
  [KEY.SPACE]: p => ({ ...p, y: p.y + 1 }),
  [KEY.UP]: p => board.rotate(p)
};

let board = new Board(ctx, ctxNext);
eventControl(); // функция с событиями управления фигурами тетриса
initNext();

function initNext() {
  // расчет размера "следующей" фигурки тетриса
  ctxNext.canvas.width = 4 * BLOCK_SIZE;
  ctxNext.canvas.height = 4 * BLOCK_SIZE;
  ctxNext.scale(BLOCK_SIZE, BLOCK_SIZE);
}

function eventControl() {
  document.addEventListener('keydown', eventKeyboard, false);
  document.getElementById('left_button').addEventListener('click', funcLeft, false);
  document.getElementById('right_button').addEventListener('click', funcRight, false);
  document.getElementById('rotate_button').addEventListener('click', funcRotate, false);
  document.getElementById('down_button').addEventListener('click', funcDown, false);
  document.getElementById('drop_button').addEventListener('click', funcDrop, false);

  // функция обработки соытий на клавиатуре
  function eventKeyboard(event) {
    // если нажата кликнута клавиша 'p'
    if (event.keyCode === KEY.P) {
      pause(); // взываем функцию pause()
    }
    // если ESC
    if (event.keyCode === KEY.ESC) {
      gameOver();
      // если клик клавиши, у которой код равен ключу из хэша moves
    } else if (moves[event.keyCode]) {
      event.preventDefault();
      // новое состояние фигуры тетриса
      let p = moves[event.keyCode](board.piece);
      // если пробел
      if (event.keyCode === KEY.SPACE) {
        // бросок вниз
        while (board.valid(p)) { // пока значение true (перед тем как двигать фигуру, проверка на столкновение с другой фигурой или стенками)
          account.score += POINTS.HARD_DROP; // прибавляем очки за самостоятельное опускание фигуры
          board.piece.move(p); // двигаем фигуру
          p = moves[KEY.DOWN](board.piece);
        }       
      } else if (board.valid(p)) { // если значение true (перед тем как двигать фигуру, проверка на столкновение с фигурой или стенками)
        board.piece.move(p); // двигаем фигуру
        if (event.keyCode === KEY.DOWN) {
          account.score += POINTS.SOFT_DROP; // прибавляем очки за самостоятельное опускание фигуры       
        }
      }
    }
  };

  // функции обработки событий клика по кнопкам управления
  function funcLeft(event) {
    vibro(false); // вироотклик
    event.preventDefault();
    let p = moves[KEY.LEFT](board.piece);
    if (board.valid(p)) {
      board.piece.move(p);
    }
  }

  function funcRight(event) {
    vibro(false);
    event.preventDefault();
    let p = moves[KEY.RIGHT](board.piece);
    if (board.valid(p)) {
      board.piece.move(p);
    }
  }

  function funcRotate(event) {
    vibro(false);
    event.preventDefault();
    let p = moves[KEY.UP](board.piece);
    if (board.valid(p)) {
      board.piece.move(p);
    }
  }

  function funcDown(event) {
    vibro(false);
    event.preventDefault();
    let p = moves[KEY.DOWN](board.piece);
    if (board.valid(p)) {
      board.piece.move(p);
    }
    account.score += POINTS.SOFT_DROP;         
  }

  function funcDrop(event) {
    vibro(false);
    event.preventDefault();
    let p = moves[KEY.SPACE](board.piece);
    while (board.valid(p)) {
      account.score += POINTS.HARD_DROP;
      board.piece.move(p);
      p = moves[KEY.DOWN](board.piece);
    }       
  }
}

// Сброс игры
function resetGame() {
  account.score = 0;
  account.lines = 0;
  account.level = 0;
  board.reset();
  // устанавлиаем начальное время
  time = { start: 0, elapsed: 0, level: LEVEL[account.level] };
}

function vibro(longFlag) {
  if ( navigator.vibrate ) { // есть поддержка Vibration API?
      if ( !longFlag ) {
          window.navigator.vibrate(100); // вибрация 100мс
          console.log('бжик');
      }
      else {
          console.log('бжжжжжжжжжжжжжжжж');
          window.navigator.vibrate([100,50,100,50,100]); // вибрация 3 раза по 100мс с паузами 50мс
      }
  }
}


function play() {
  resetGame();
  audioGame.play();
  time.start = performance.now();
  // если запущена игра, отменяем её
  if (requestId) {
    cancelAnimationFrame(requestId);
  }

  document.querySelector('.play-button').textContent='Restart';
  document.querySelector('.pause-button').style.display='block';

  animate();
  
}

// В игровом цикле мы обновляем наше игровое состояние на основе временного интервала, а затем выводим результат.
function animate(now = 0) {
  // обновление времени
  time.elapsed = now - time.start;
  if (time.elapsed > time.level) {
    time.start = now;
    if (!board.drop()) { // при заполнении игрового поля
      gameOver();
      return;
    }
  }
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  board.draw();
  requestId = requestAnimationFrame(animate);
}

// функция при проигрыше
function gameOver() {
  cancelAnimationFrame(requestId);
  audioGame.pause(); // пауза звука игры
  audioGameOver.play(); // звук game over
  TODO:vibro(true); // многократная вибрация
  // рисуем табличку GAME OVER c количеством очков
  ctx.fillStyle = 'black'; 
  ctx.fillRect(1, 3, 8, 3);
  ctx.font = '1px Arial';
  ctx.fillStyle = 'red';
  ctx.fillText('GAME OVER', 1.8, 4);
  ctx.fillText('Score: ' + account.score, 3, 5.5);
}
TODO:

// при нажатии игровой кнопки PAUSE
function pause() {
  if (!requestId) {
    audioGame.play();
    animate();
    return;
  }

  audioGame.pause();
  cancelAnimationFrame(requestId);
  requestId = null;
  // рисуем табличку с надписью PAUSE
  ctx.fillStyle = 'black';
  ctx.fillRect(1, 3, 8, 1.2);
  ctx.font = '1px Arial';
  ctx.fillStyle = 'yellow';
  ctx.fillText('PAUSED', 3, 4);
}

// при нажатии на кнопку Game Rules пявляются сверху правила игры с анимацией
function rules() {
  var gameRules = document.querySelector('.game-rules');
  gameRules.style.top = '25vmin';
  
  document.querySelector('.continue-button').addEventListener('click', event => {
    gameRules.style.top = '-100vmax';
  })
}
