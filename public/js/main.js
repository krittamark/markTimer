const socket = io('ws://krittamark.com:8081');

socket.on('setup', data => {
    data.lapList.forEach(item => {
        let lapList = document.querySelector('.lapList');
        lapList.prepend(createLapItem(item));
    });
    document.querySelector('.timer__display').innerHTML = data.time;
    data.isRunning ? setRed(document.getElementById('toggleTimer')) : '';
});
socket.on('lap', data => {
    let lapList = document.querySelector('.lapList');
    lapList.prepend(createLapItem(data));
});
socket.on('toggled', () => {
    let toggleBtn = document.getElementById('toggleTimer');
    toggleBtn.classList.contains('controllerBtn__green') ? setRed(toggleBtn) : setGreen(toggleBtn);
});
socket.on('timerReset', () => {
    document.querySelector('.lapList').innerHTML = '';
    setGreen(document.getElementById('toggleTimer'));
});
socket.on('getTime', data => {
    document.querySelector('.timer__display').innerHTML = data; 
});

socket.on('connect', () => {
    let alert = document.querySelector('.alert');
    alert ? alert.remove() : '';
    document.querySelectorAll('.controllerBtn').forEach(element => {
        element.disabled = false;
    });
});
socket.on('disconnect', () => {
    let element = document.createElement('div');
    element.classList.add('alert', 'alert-red');
    element.innerHTML = 'Could not connect to server. Please check your Internet connection and try again.';
    document.body.prepend(element);
    document.querySelectorAll('.controllerBtn').forEach(element => {
        element.disabled = true;
    });
});

document.querySelector('.header').addEventListener('click', () => {
    let elem = document.documentElement;
    if (document.fullscreenElement) {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else {
            document.msExitFullscreen();
        }
    } else {
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        } else {
            elem.msRequestFullscreen();
        }
    }
});
/**
 * This code will get all buttons,
 * Then add click Event Listener
 * to make button look clicked
 */
document.querySelectorAll('.controllerBtn').forEach(ele => {
    ele.addEventListener('click', () => {
        ele.style = 'filter: brightness(0.9);';
        setTimeout(() => ele.style = '', 100);
    })
});
document.getElementById('toggleTimer').addEventListener('click', () => {
    socket.emit('toggleTimer');
});
document.getElementById('resetTimer').addEventListener('click', () => {
    socket.emit('resetTimer');
});
document.getElementById('lapTimer').addEventListener('click', () => {
    socket.emit('lap');
});

/**
 * Function create lap element
 * @author   Krittamark
 * @param    {String} timerTime - String to appear in lap element.
 * @return   {Object} element - Lap element.
 */
function createLapItem(timerTime) {
    let element = document.createElement('div');
    element.classList.add('lapList__item');
    let count = document.querySelectorAll('div.lapList__item').length + 1;
    element.innerHTML = `<span>LAP ${count}</span>`;
    element.innerHTML += `<span class="lapListItem__right">${timerTime}</span>`;
    return element;
}

/**
 * Specific function to add btn-green class
 * @author   Krittamark
 * @param    {Object} element - Target Element.
 */
function setGreen(element) {
    element.classList.remove('controllerBtn__red');
    element.classList.add('controllerBtn__green');
    element.innerText = 'START';
}

/**
 * Specific function to add btn-red class
 * @author   Krittamark
 * @param    {Object} element - Target Element.
 */
function setRed(element) {
    element.classList.remove('controllerBtn__green');
    element.classList.add('controllerBtn__red');
    element.innerText = 'STOP';
}