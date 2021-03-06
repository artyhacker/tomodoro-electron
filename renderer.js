const { ipcRenderer } = require('electron');
const Timer = require('timer.js');

const DEFAULT_TIME = 20;

let currentTime = null;

const startWork = () => {
  if (currentTime && currentTime.getStatus() === 'started') {
    currentTime.stop();
    currentTime.start(DEFAULT_TIME);
  } else {
    currentTime = new Timer({
      ontick: updateTime,
      onend: stopWork,
    }).start(DEFAULT_TIME);
    startWorkBtn.innerHTML = '重新开始';
    endWorkBtn.innerHTML = '暂停工作';
  }
};

const updateTime = (t) => {
  const c = document.getElementById('time');
  const ms = (t / 1000).toFixed(0);
  const m = (ms / 60).toFixed(0).padStart(2, 0);
  const s = (ms % 60).toString().padStart(2, 0);
  c.innerText = `${m}:${s}`;
};

const stopWork = () => {
  document.getElementById('time').innerText = '00:00';
  ipcRenderer.invoke('clock').then((res) => {
    if (res === 'rest') {
      setTimeout(() => {
        new Notification('休息一会儿吧', { body: '看看远处，喝杯咖啡～' });
      }, 0);
    } else if (res === 'work') {
      setTimeout(() => startWork(), 0);
    }
  })
};

const startWorkBtn = document.getElementById('start-work');
const endWorkBtn = document.getElementById('end-work');

startWorkBtn.onclick = startWork;
endWorkBtn.onclick = () => {
  if (currentTime && currentTime.getStatus() === 'started') {
    currentTime.pause();
    endWorkBtn.innerHTML = '继续工作';
    startWorkBtn.innerHTML = '重新开始';
  } else if (currentTime && currentTime.getStatus() === 'paused') {
    currentTime.start();
    endWorkBtn.innerHTML = '暂停工作';
  }
};
