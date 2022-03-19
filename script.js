let buttonSettings = document.querySelector(".settings");
let buttonStart    = document.querySelector(".start");
let seconds        = document.querySelector(".seconds input");
let minutes        = document.querySelector(".minutes input");
let ring           = document.querySelector(".ring");
let timer;

// Разрешаем редактирование полей по нажатию кнопки настроек
buttonSettings.addEventListener( "click", function () {
    // Если нажали настройки когда вокруг таймера красная обводка - ее нужно удалить
    ring.classList.remove("ending");

    // Если нажимаем настройки когда таймер запущен -
    // ставим его на паузу и меняем текст кнопки Стоп на Старт
    if (buttonStart.innerText === "STOP") {
        clearInterval(timer);
        changeButtonState();
    }

    // Активируем или деактивируем поля ввода
    seconds.disabled = !seconds.disabled;
    minutes.disabled = !minutes.disabled;

    // Нормализуем результат пользовательского ввода.
    // Ищем числа, проверяем на соответствие диапазонам.
    normalizeInput();
} );

function normalizeInput() {
    seconds.value = parseInt(seconds.value);
    if (isNaN(seconds.value)) seconds.value = 0;
    if (seconds.value > parseInt(seconds.max)) seconds.value = seconds.max;
    if (seconds.value <= parseInt(seconds.min)) seconds.value = seconds.min;
    seconds.value = ("0" + seconds.value).slice(-2);

    minutes.value = parseInt(minutes.value);
    if (isNaN(minutes.value)) minutes.value = 0;
    if (minutes.value > +minutes.max) minutes.value = minutes.max;
    if (minutes.value <= +minutes.min) minutes.value = minutes.min;
    minutes.value = ("0" + minutes.value).slice(-2);
}

buttonStart.addEventListener( "click", function () {
    // как только нажимаем старт - поля ввода времени должны быть деактивированы,
    // а все значения нормализованы
    seconds.disabled = true;
    minutes.disabled = true;
    normalizeInput();

    // Если кнопка с текстом Старт и в полях ввода не нули - меняем статус кнопки
    // и запускаем таймер
    // иначе ставим таймер на паузу
    if (buttonStart.innerText === "START" &&
        !(+minutes.value === 0 && +seconds.value === 0) ) {
        changeButtonState();
        let countdown = minutes.value * 60 + +seconds.value;
        timerFunction(countdown);
    } else if (buttonStart.innerText === "STOP") {
        clearInterval(timer);
        changeButtonState();
    }
} )

// функция смены текста кнопки Старт
function changeButtonState() {
    if (buttonStart.innerText === "START") {
        buttonStart.innerText = "stop";
    } else {
        buttonStart.innerText = "start";
    }
}

// Основная функция таймера
// Получает на вход заранее посчитанное время в секундах
function timerFunction(time) {
    timer = setInterval( function () {
        // сразу уменьшаем время на 1 секунду
        --time;

        // записываем значения оставшегося времени в поля ввода
        minutes.value = Math.floor(time / 60);
        seconds.value = Math.trunc(time % 60);

        // если значения меньше 10 - нужно добавить 0 в начало
        if (seconds.value < 10) seconds.value = "0" + seconds.value;
        if (minutes.value < 10) minutes.value = "0" + minutes.value;

        // когда время вышло - запускаем функцию остановки таймера
        if (time <= 0) {
            timerFinish();
        }
    }, 1000 );
}

function timerFinish() {
    // останавливаем обратный отсчет и меняем текст кнопки Стоп
    clearInterval(timer);
    changeButtonState();

    // добавляем красную обводку вокруг таймера
    ring.classList.add("ending");

    // включаем звук остановки таймера
    let sound = document.createElement("AUDIO");
    sound.autoplay = true;
    sound.controls = false;
    sound.setAttribute("src", "sounds/timer_sound.mp3");
    document.body.appendChild(sound);
}