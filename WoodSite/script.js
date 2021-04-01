var slides = document.querySelectorAll('#slides .slide'); // Получаем все слайды из контейнера
var currentSlide = 0; // Создаем переменную для получения текущего слайда
var slideInterval = setInterval(nextSlide,5000); // Устанавливаем интервал переключения слайдов 5000 ms, переключение слайдов с помощью функции nextSlide
 
function nextSlide() {
    slides[currentSlide].className = 'slide'; // Мы меняем класс для текущего слайда, чтобы спрятать его.
    currentSlide = (currentSlide+1)%slides.length; // Потом добавляем класс к текущему слайду. Мы используем оператор % на случай, если это был последний слайд, чтобы вернуться к первому.
    slides[currentSlide].className = 'slide showing'; // После получения индекса слайда мы меняем класс и показываем новый.
}

