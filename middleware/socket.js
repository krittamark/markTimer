module.exports = (http) => {
    const io = require('socket.io')(http, {
        cors: {
          origin: "*",
          methods: '*'
        }
    });
    let isTimerRunning = false;
    let [milliseconds, seconds, minutes] = [0, 0, 0];
    let [ms, s, m] = ['00', '00', '00'];
    let interval;
    let lapTime = [];
    let lapList = [];

    function startTimer() {
        isTimerRunning = true;
        interval = setInterval(() => {
            milliseconds += 1;
            if (milliseconds == 100) {
                milliseconds = 0;
                seconds++;
                if (seconds == 60) {
                    seconds = 0;
                    minutes++;
                }
            }
            m = minutes < 10 ? `0${minutes}` : minutes;
            s = seconds < 10 ? `0${seconds}` : seconds;
            ms = milliseconds < 10 ? `0${milliseconds}` : milliseconds;
            io.emit('getTime', `${m}:${s}.${ms}`);
        }, 10);
    }

    function stopTimer() {
        isTimerRunning = false;
        clearInterval(interval);
    }
    function resetTimer() {
        stopTimer();
        [milliseconds, seconds, minutes] = [0, 0, 0];
        [ms, s, m] = ['00', '00', '00'];
        lapTime = [];
        lapList = [];
    }
    
    function lapTimer() {
        if (lapList.length === 0) {
            lapList.push(`${m}:${s}.${ms}`);
            lapTime.push((minutes*100*60) + (seconds*100) + milliseconds);
        } else {
            lapTime.push((minutes*100*60) + (seconds*100) + milliseconds);
            let dif = lapTime[lapTime.length-1] - lapTime[lapTime.length-2]
            let lap = `${Math.floor(dif/6000) < 10 ? `0${Math.floor(dif/6000)}` : Math.floor(dif/6000)}:${Math.floor((dif%6000)/100) < 10 ? `0${Math.floor((dif%6000)/100)}` : Math.floor((dif%6000)/100)}.${Math.floor(dif%100) < 10 ? `0${Math.floor(dif%100)}` : Math.floor(dif%100)}`;
            lapList.push(lap)
        }
        console.log(`lapList: ${lapList} ;    LapTime: ${lapTime}`)
    }
    
    io.on('connection', (socket) => {
        socket.emit('setup', { time: `${m}:${s}.${ms}`, lapList, isRunning: isTimerRunning });
        
        socket.on('toggleTimer', (data) => {
            if (isTimerRunning) {
                stopTimer();
            } else {
                startTimer();
            }
            io.emit('toggled');
        });
        
        socket.on('lap', () => {
            if (isTimerRunning) {
                lapTimer();
                io.emit('lap', lapList[lapTime.length-1]);
            }
        });
        socket.on('resetTimer', () => {
            resetTimer();
            io.emit('timerReset'); 
            io.emit('getTime', `${m}:${s}.${ms}`); 
        });
    
        socket.on('disconnect', () => {
            
        });
    });
};