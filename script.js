let buttonSettings = document.querySelector(".settings");
let buttonStart    = document.querySelector(".start");
let seconds        = document.querySelector(".seconds input");
let minutes        = document.querySelector(".minutes input");
let ring           = document.querySelector(".ring");
let timer;

// Разрешаем редактирование полей по нажатию кнопки настроек
buttonSettings.addEventListener( "click", function () {
    ring.classList.remove("ending");

    if (buttonStart.innerText === "STOP") {
        clearInterval(timer);
        changeButtonState();
    }
    seconds.disabled = !seconds.disabled;
    minutes.disabled = !minutes.disabled;

    // Нормализуем результат пользовательского ввода.
    // Ищем числа, проверяем на соответствие диапазонам.
    normalizeInput();
} );

function normalizeInput() {
    seconds.value = parseInt(seconds.value);
    if (isNaN(seconds.value)) seconds.value = 0;
    if (seconds.value > +seconds.max) seconds.value = seconds.max;
    if (seconds.value <= +seconds.min) seconds.value = seconds.min;
    if (seconds.value < 10) seconds.value = "0" + seconds.value;

    minutes.value = parseInt(minutes.value);
    if (isNaN(minutes.value)) minutes.value = 0;
    if (minutes.value > +minutes.max) minutes.value = minutes.max;
    if (minutes.value <= +minutes.min) minutes.value = minutes.min;
    if (minutes.value < 10) minutes.value = "0" + minutes.value;

    if (+minutes.value === 0 && +seconds.value === 0) seconds.value = "01";
}

buttonStart.addEventListener( "click", function () {
    seconds.disabled = true;
    minutes.disabled = true;

    if ( buttonStart.innerText === "START" && !(+minutes.value === 0 && +seconds.value === 0) ) {
        changeButtonState();
        normalizeInput();

        let countdown = minutes.value * 60 + +seconds.value;

        timerFunction(countdown);
    } else if (buttonStart.innerText === "STOP") {
        clearInterval(timer);
        changeButtonState();
    }

} )

function changeButtonState() {
    if (buttonStart.innerText === "START") {
        buttonStart.innerText = "stop";
    } else {
        buttonStart.innerText = "start";
    }
}

function timerFunction(time) {
    timer = setInterval( function () {
        --time;

        minutes.value = Math.trunc(time / 60 % 60);
        seconds.value = Math.trunc(time % 60);

        if (seconds.value < 10) seconds.value = "0" + seconds.value;
        if (minutes.value < 10) minutes.value = "0" + minutes.value;

        if (time <= 0) {
            timerFinish();

            return true;
        }
    }, 1000 );
}

function timerFinish() {
    clearInterval(timer);
    changeButtonState();

    ring.classList.add("ending");

    let sound = document.createElement("AUDIO");
    sound.autoplay = true;
    sound.controls = false;
    sound.setAttribute("src", "sounds/timer_sound.mp3");
    document.body.appendChild(sound);
}