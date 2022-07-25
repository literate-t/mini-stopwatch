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
const $ul = getElem('#laps');
let isRunning = false;

const setTimeFormat = (time) => {
    let centisecond = time % 100;
    let second = Math.floor(time / 100);
    let minute = 0;
    if (60 <= second) {
        minute = Math.floor(second / 60);
        second = second % 60;
    }
    if (centisecond < 10) {
        centisecond = `0${centisecond}`;
    }
    if (second < 10) {
        second = `0${second}`;
    }
    if (minute < 10) {
        minute = `0${minute}`;
    }
    return `${minute}:${second}.${centisecond}`;
};
const drawTimer = (time) => {
    const reulstTime = setTimeFormat(time);
    $timer.textContent = reulstTime;
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
};

const colorLapTime = (target, type) => {
    if (type !== 'shortest' && type !== 'longest') {
        throw new Error('invalid type');
    }
    let comparison = type === 'shortest' ? '99:99.99' : '00:00.00';
    const styleClass = type === 'shortest' ? 'text-green-600' : 'text-red-600';
    let index;
    for (let i = 0; i < target.children.length; i += 1) {
        const $li = target.children[i];
        const $lapSpan = $li.children[1];
        $li.classList.remove(styleClass);
        if (type === 'shortest' && $lapSpan.textContent < comparison) {
            comparison = $lapSpan.textContent;
            index = i;
        } else if (type === 'longest' && comparison < $lapSpan.textContent) {
            comparison = $lapSpan.textContent;
            index = i;
        }
    }
    target.children[index].classList.add(styleClass);
};

const lapBtnHandler = () => {
    const [lapCount, lapTime] = stopWatch.createLap();
    const formattedLapTime = setTimeFormat(lapTime);

    const $li = document.createElement('li');
    const $lapSpan = document.createElement('span');
    const $lapTimeSpan = document.createElement('span');

    $li.classList.add('flex', 'justify-between', 'py-2', 'px-3', 'border-b-2');
    $lapSpan.textContent = `랩 ${lapCount}`;
    $lapTimeSpan.textContent = formattedLapTime;

    $li.append($lapSpan);
    $li.append($lapTimeSpan);

    $ul.prepend($li);

    colorLapTime($ul, 'shortest');
    colorLapTime($ul, 'longest');
};

const lapRestBtnHandler = () => {
    if (isRunning) {
        lapBtnHandler();
    } else {
        resetBtnHandler();
    }
};

$startStopBtn.addEventListener('click', startStopBtnHandler);
$lapResetBtn.addEventListener('click', lapRestBtnHandler);
