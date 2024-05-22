const socket = io();

let lastTouchX = null;
let lastTouchY = null;
let isTouching = false;
let isMoving = false;
let lastTapTime = 0;

const touchpad = document.getElementById('touchpad');
const DOUBLE_TAP_DELAY = 300; 


touchpad.addEventListener('touchstart', (event) => {
    event.preventDefault(); 
    isTouching = true;
    isMoving = false;
    const touch = event.touches[0];
    lastTouchX = touch.clientX;
    lastTouchY = touch.clientY;
});

touchpad.addEventListener('touchmove', (event) => {
    event.preventDefault(); 
    if (!isTouching) return;

    const touch = event.touches[0];
    const currentTouchX = touch.clientX;
    const currentTouchY = touch.clientY;

    if (lastTouchX !== null && lastTouchY !== null) {
        const deltaX = currentTouchX - lastTouchX;
        const deltaY = currentTouchY - lastTouchY;

        if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
            isMoving = true;
            socket.emit('mouse move', { deltaX, deltaY });

            lastTouchX = currentTouchX;
            lastTouchY = currentTouchY;
        }
    }
});

touchpad.addEventListener('touchend', (event) => {
    event.preventDefault(); 

    const currentTime = new Date().getTime();
    const tapInterval = currentTime - lastTapTime;

    if (tapInterval > 0 && tapInterval < DOUBLE_TAP_DELAY) {
        socket.emit('click', { button: 'left' });
        lastTapTime = 0; 
    } else {
        lastTapTime = currentTime;
    }

    isTouching = false;
    lastTouchX = null;
    lastTouchY = null;
});
