if (document.body.animate) {
    document.querySelector('.play-button').addEventListener('click', pop);
    document.querySelector('.pause-button').addEventListener('click', pop);
    document.querySelector('.rules-button').addEventListener('click', pop);
  }
  
  function pop (EO) {
    // нажал ли пользователь кнопку с помощью клавиатуры (без мышки)
    if (EO.clientX === 0 && EO.clientY === 0) {
      const bbox = document.querySelector('#button').getBoundingClientRect(); //возвращаем размер элемента и его позицию относительно viewport (части страницы, которая показанна на экране, и которую мы видим)
      const x = bbox.left + bbox.width / 2;
      const y = bbox.top + bbox.height / 2;
      for (let i = 0; i < 30; i++) {
        //вызываем функцию createParticle 30 раз
        // передаем функции координаты кнопки х у
        createParticle(x, y);
      }
    } else {
      for (let i = 0; i < 30; i++) {
        // вызываем функцию createParticle 30 раз
        // в качестве аргументов передаем кординаты клика мыши
        createParticle(EO.clientX, EO.clientY);
      }
    }
  }
  
  function createParticle (x, y) {
    const particle = document.createElement('particle');
    document.body.appendChild(particle);
    
    //рандомные значения от 5px до 15px
    const size = Math.floor(Math.random() * 10 + 5);
    particle.style.width = `${size}px`; // ${size} то значение, которое будет в size
    particle.style.height = `${size}px`;
    // рандомные цвета кружков (зелено-желто-оранжевая)
    particle.style.background = `hsl(${Math.random() * 90 + 40}, 100%, 60%)`;
    
    // рандомное положение кружков при клике на расстоянии 50px от места клика
    const destinationX = x + (Math.random() - 0.5) * 2 * 50;
    const destinationY = y + (Math.random() - 0.5) * 2 * 50;
  
    // сохраним анимацию, чтоы пользоваться ей позже
    const animation = particle.animate([
      {
        // устанавлиаем начальную позицию кружка и смещаем на половину размера, чтобы расположить вокруг мыши
        transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
        opacity: 1
      },
      {
        // рандомные координаты при перемещении кружков
        transform: `translate(${destinationX}px, ${destinationY}px)`,
        opacity: 0
      }
    ], {
      //случайная продолжительность анимации
      duration: Math.random() * 1000 + 500,
      // движение кружков
      easing: 'cubic-bezier(0, 0.82, 0.52, 0.9)',
      // рандомная задерка кружков до 200ms
      delay: Math.random() * 200
    });
    
    // когда анимация завершится, удаляем элемент с кружками из DOM
    animation.onfinish = () => {
      particle.remove();
    };
  }