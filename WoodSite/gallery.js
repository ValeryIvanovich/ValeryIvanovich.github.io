/* Индекс слайда по умолчанию */
var slideIndex = 1;
showSlides(slideIndex);

/* Функция увеличивает индекс на 1, показывает следующй слайд (кнопка вправо)*/
function plusSlide() {
    showSlides(slideIndex += 1);
}

/* Функция уменьшает индекс на 1, показывает предыдущий слайд (кнопка влево)*/
function minusSlide() {
    showSlides(slideIndex -= 1);  
}

/* Устанавливает текущий слайд 'n' (который виден) 'круги под фото'*/
function currentSlide(n) {
    showSlides(slideIndex = n);
}

/* Основная функция слайдера */
function showSlides(n) {
    var i;
    var slides = document.getElementsByClassName("item");/*получаем все элементы класса item*/
    var dots = document.getElementsByClassName("slider-dots_item");/*получаем все элементы класса slider-dots_item*/
    if (n > slides.length) { /* если n станет больше длины (количества фото) слайдера, то присваиваем индекс 1 (1-я фотография) */
      slideIndex = 1
    }
    if (n < 1) {
        slideIndex = slides.length /*если n станет меньше длины слайдера то присваеваем индекс с числом длины (количества фото), т.е. 10 (переключаем на последнюю фотографию)*/
    }
    for (i = 0; i < slides.length; i++) { /*предыдущий слайд в display: none*/
        slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex - 1].style.display = "block"; /*присваеваем стиль*/
    dots[slideIndex - 1].className += " active";
}