let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');
let scoreElement = document.getElementById('scoreValue');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [
    {x: 10, y: 10}
];
let food = {
    x: Math.floor(Math.random() * tileCount),
    y: Math.floor(Math.random() * tileCount)
};
let dx = 0;
let dy = 0;
let score = 0;
let gameOver = false;

document.addEventListener('keydown', changeDirection);

function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    const keyPressed = event.keyCode;
    const goingUp = dy === -1;
    const goingDown = dy === 1;
    const goingRight = dx === 1;
    const goingLeft = dx === -1;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -1;
        dy = 0;
    }
    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -1;
    }
    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 1;
        dy = 0;
    }
    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 1;
    }
}

function resizeCanvas() {
    const container = document.querySelector('.game-container');
    const canvas = document.getElementById('gameCanvas');
    const containerWidth = container.clientWidth;
    canvas.style.width = Math.min(800, containerWidth) + 'px';
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('load', resizeCanvas);

function drawGame() {
    if (gameOver) {
        ctx.fillStyle = '#DB4437';
        ctx.font = '80px Qomolangma-UchenSarchung';
        ctx.textAlign = 'center';
        ctx.fillText('རྩེད་མོ་རྫོགས་སོ།', canvas.width/2, canvas.height/2);
        return;
    }

    setTimeout(function() {
        clearCanvas();
        moveSnake();
        drawFood();
        drawSnake();
        
        if (checkCollision()) {
            gameOver = true;
        }
        
        drawGame();
    }, 500);
}

function clearCanvas() {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.strokeStyle = '#E8E8E8';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= tileCount; i++) {
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, canvas.height);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(canvas.width, i * gridSize);
        ctx.stroke();
    }
}

function drawSnake() {
    const snakeColor = '#0F9D58';
    document.querySelector('.score').style.backgroundColor = snakeColor;
    document.querySelector('.score').style.color = '#FFFFFF';

    snake.forEach((segment, index) => {
        const alpha = 1 - (index / snake.length) * 0.6;
        ctx.fillStyle = `rgba(15, 157, 88, ${alpha})`;
        ctx.shadowColor = 'rgba(15, 157, 88, 0.2)';
        ctx.shadowBlur = 5;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        
        const x = segment.x * gridSize;
        const y = segment.y * gridSize;
        const size = gridSize - 2;
        const radius = 5;
        
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + size - radius, y);
        ctx.quadraticCurveTo(x + size, y, x + size, y + radius);
        ctx.lineTo(x + size, y + size - radius);
        ctx.quadraticCurveTo(x + size, y + size, x + size - radius, y + size);
        ctx.lineTo(x + radius, y + size);
        ctx.quadraticCurveTo(x, y + size, x, y + size - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.fill();
    });
    
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
}

function drawFood() {
    const x = food.x * gridSize;
    const y = food.y * gridSize;
    const size = gridSize - 2;
    
    const gradient = ctx.createRadialGradient(
        x + size/2, y + size/2, 2,
        x + size/2, y + size/2, size/2
    );
    gradient.addColorStop(0, '#DB4437');
    gradient.addColorStop(1, 'rgba(219, 68, 55, 0.3)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x + size/2, y + size/2, size/2, 0, Math.PI * 2);
    ctx.fill();
}

function moveSnake() {
    const head = {
        x: snake[0].x + dx,
        y: snake[0].y + dy
    };

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        
        generateFood();
    } else {
        snake.pop();
    }
}

function generateFood() {
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
    
    if (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
        generateFood();
    }
}

function checkCollision() {
    const head = snake[0];
    
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        return true;
    }
    
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    
    return false;
}

function restartGame() {
    snake = [{x: 10, y: 10}];
    dx = 0;
    dy = 0;
    score = 0;
    scoreElement.textContent = score;
    gameOver = false;
    generateFood();
    drawGame();
}

// 添加触摸控制
function initTouchControls() {
    const touchButtons = {
        up: document.querySelector('.touch-up'),
        down: document.querySelector('.touch-down'),
        left: document.querySelector('.touch-left'),
        right: document.querySelector('.touch-right')
    };

    // 处理触摸事件
    function handleTouch(direction) {
        switch(direction) {
            case 'up':
                if (dy !== 1) {  // 不能向下时才能向上
                    dx = 0;
                    dy = -1;
                }
                break;
            case 'down':
                if (dy !== -1) {  // 不能向上时才能向下
                    dx = 0;
                    dy = 1;
                }
                break;
            case 'left':
                if (dx !== 1) {  // 不能向右时才能向左
                    dx = -1;
                    dy = 0;
                }
                break;
            case 'right':
                if (dx !== -1) {  // 不能向左时才能向右
                    dx = 1;
                    dy = 0;
                }
                break;
        }
    }

    // 为每个方向按钮添加事件监听
    Object.entries(touchButtons).forEach(([direction, button]) => {
        button.addEventListener('touchstart', (e) => {
            e.preventDefault();  // 防止滚动
            handleTouch(direction);
        });

        // 添加点击支持（用于桌面端测试）
        button.addEventListener('click', (e) => {
            handleTouch(direction);
        });
    });

    // 添加滑动手势支持
    let touchStartX = 0;
    let touchStartY = 0;

    document.getElementById('gameCanvas').addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });

    document.getElementById('gameCanvas').addEventListener('touchmove', (e) => {
        e.preventDefault();  // 防止页面滚动
    }, { passive: false });

    document.getElementById('gameCanvas').addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;

        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;

        // 确定滑动方向
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // 水平滑动
            if (deltaX > 50) {
                handleTouch('right');
            } else if (deltaX < -50) {
                handleTouch('left');
            }
        } else {
            // 垂直滑动
            if (deltaY > 50) {
                handleTouch('down');
            } else if (deltaY < -50) {
                handleTouch('up');
            }
        }
    });
}

// 在游戏初始化时调用
window.addEventListener('load', () => {
    initTouchControls();
});

// 初始化游戏
drawGame(); 