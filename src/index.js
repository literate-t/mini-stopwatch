import Stopwatch from './stopwatch.js';

const stopWatch = new Stopwatch();
const $section = document.querySelector('section');
const getElem = (target) => $section.querySelector(target);

// 1. 시작 중단
const $timer = getElem('#timer');
const $startStopBtn = getElem('#start-stop-btn');
const $lapResetBtn = getElem('#lap-reset-btn');
const $lapResetBtnLabel = getElem('#lap-reset-btn-label');
const $startStopBtnLabel = getElem('#start-stop-btn-label');
const $ulLaps = getElem('#laps');

let isRunning = false;

const formatNumber = (number) => {
    if (number < 10) {
        number = `0${number}`;
    }
    return number;
};
const formatTime = (time) => {
    let centisecond = time % 100;
    let second = Math.floor(time / 100) % 60;
    let minute = Math.floor(time / 6000);

    return `${formatNumber(minute)}:${formatNumber(second)}.${formatNumber(
        centisecond
    )}`;
};
const drawTimer = (time) => {
    const resultTime = formatTime(time);
    $timer.textContent = resultTime;
};

let intervalId;

const startBtnHandler = () => {
    //isRunning = true;
    stopWatch.start();
    intervalId = setInterval(() => {
        drawTimer(stopWatch.centisecond);
    }, 10);

    $lapResetBtnLabel.textContent = '랩';
    $startStopBtnLabel.textContent = '중단';
};

const stopBtnHandler = () => {
    //isRunning = false;
    stopWatch.pause();
    clearInterval(intervalId);

    $lapResetBtnLabel.textContent = '리셋';
    $startStopBtnLabel.textContent = '시작';
};

const toggleStyleBtn = () => {
    $startStopBtn.classList.toggle('bg-green-600');
    $startStopBtn.classList.toggle('bg-red-600');
};

const toggleRunning = () => {
    isRunning = !isRunning;
};

const startStopBtnHandler = () => {
    if (isRunning) {
        stopBtnHandler();
    } else {
        startBtnHandler();
    }
    toggleStyleBtn();
    toggleRunning();
};

const resetBtnHandler = () => {
    stopWatch.reset();
    $timer.textContent = '00:00.00';
    $ulLaps.innerHTML = '';
    $minLapTime = undefined;
    $maxLapTime = undefined;
};

let $minLapTime;
let $maxLapTime;

const colorMinMaxLapTime = () => {
    $maxLapTime.classList.add('text-red-600');
    $minLapTime.classList.add('text-green-600');
};

const lapBtnHandler = () => {
    const [lapCount, lapTime] = stopWatch.createLap();
    const formattedLapTime = formatTime(lapTime);

    const $liLap = document.createElement('li');
    $liLap.setAttribute('data-lap', formattedLapTime);

    const $lapSpan = document.createElement('span');
    const $lapTimeSpan = document.createElement('span');

    $liLap.classList.add(
        'flex',
        'justify-between',
        'py-2',
        'px-3',
        'border-b-2'
    );
    $lapSpan.textContent = `랩 ${lapCount}`;
    $lapTimeSpan.textContent = formattedLapTime;

    $liLap.append($lapSpan);
    $liLap.append($lapTimeSpan);

    $ulLaps.prepend($liLap);

    // 처음 추가
    if (undefined === $minLapTime) {
        $minLapTime = $liLap;
        return;
    }

    // 두 번째
    else if (undefined === $maxLapTime) {
        if ($liLap.dataset.lap < $minLapTime.dataset.lap) {
            $maxLapTime = $minLapTime;
            $minLapTime = $liLap;
        } else {
            $maxLapTime = $liLap;
        }
    }

    // 세 번째부터
    else {
        if ($maxLapTime.dataset.lap < $liLap.dataset.lap) {
            $maxLapTime.classList.remove('text-red-600');
            $maxLapTime = $liLap;
        } else if ($liLap.dataset.lap < $minLapTime.dataset.lap) {
            $minLapTime.classList.remove('text-green-600');
            $minLapTime = $liLap;
        }
    }
    colorMinMaxLapTime();
};

const lapRestBtnHandler = () => {
    if (isRunning) {
        lapBtnHandler();
    } else {
        resetBtnHandler();
    }
};

const onKeyDown = (e) => {
    switch (e.code) {
        case 'KeyS':
            startStopBtnHandler();
            break;
        case 'KeyL':
            lapRestBtnHandler();
            break;
    }
};

$startStopBtn.addEventListener('click', startStopBtnHandler);
$lapResetBtn.addEventListener('click', lapRestBtnHandler);
document.addEventListener('keydown', onKeyDown);
