backTop.onclick = function () { // При нажатии на кнопку наверх срабатывает функция
    window.scrollTo(pageXOffset, 0); // Пролистать в top
};

window.addEventListener('scroll', function () { // Кнопка прячется, если прокрутка меньше 300 (в пикселях)
    backTop.hidden = (pageYOffset < 300);
});