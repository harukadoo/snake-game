class Color {
    constructor(type) {
        this.type = type;
    }

    get color(){
        return this.type;
    }
}

class Field extends Color {
    constructor() {
        super('white')
        this.cols = 34;
        this.rows = 19;
        this.blockSize = 28;
    }
}

class Coordinates {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Snake extends Color{
    constructor(coordinates) {
        super('#2eb82e');
        this.x = coordinates.x;
        this.y = coordinates.y;
        this.speedX = 0;
        this.speedY = 0;
    }
}

class Food {
    constructor(coordinates){
        this.x = coordinates.x;
        this.y = coordinates.y;
        this.image = new Image();
        this.image.src = './img/strawberry5.png';
    }
}

const field = new Field();

const food = new Food(new Coordinates(0, 0));

const snake = new Snake(new Coordinates(0, 0));

const snakeBody = [];

const minsOutput = document.getElementById("mins");
const secondsOutput = document.getElementById("sec");

let totalTime = 0;

let isTimerRunning = false;

function setTime() {
    if (isTimerRunning !== true) {
        return;
    }

    totalTime++;

    const mins = Math.floor(totalTime / 60);
    const seconds = totalTime - mins * 60;


    minsOutput.innerHTML = setAdditionalZero(mins);
    secondsOutput.innerHTML = setAdditionalZero(seconds);
}


function startTimer() {
    setInterval(setTime, 1000);
}

function setAdditionalZero(val) {
    const valString = val + '';
    if (valString.length < 2) {
        return '0' + valString;
    } else {
        return valString;
    }
}



const score = document.querySelector('.score-number');
let currentScore = 0;


function setIntervalTime() {
    let intervalTime = 0;
    if (currentScore < 5) {
        intervalTime = 210;

    } else if (currentScore >= 5 && currentScore < 10) {
        intervalTime = 180

    } else if (currentScore >= 10 && currentScore < 20) {
        intervalTime = 140
    } else if (currentScore >= 20) {
        intervalTime = 100
    }

    return intervalTime
}

let intervalStartGameTime;
const canvas = document.getElementById('field')
window.onload = function () {
    
    canvas.height = field.rows * field.blockSize;
    canvas.width = field.cols * field.blockSize;
    this.context = canvas.getContext("2d");

    setFoodPosition()

    document.addEventListener('keyup', snakeMovement);



    intervalStartGameTime = setInterval(gameUpdate, setIntervalTime());

}

const gameOverMessage = document.querySelector('.game-over__container');
let gameOver = false;

function gameUpdate() {
    if (gameOver) {
        isTimerRunning = false;
        return
    }

    context.fillStyle = field.color;
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.drawImage(food.image, food.x, food.y, field.blockSize, field.blockSize);

    if (snake.x === food.x && snake.y === food.y) {
        snakeBody.push([snake.x, snake.y])
        setFoodPosition()

        currentScore++ 
        score.innerHTML = currentScore;

        if(intervalStartGameTime) {
            clearInterval(intervalStartGameTime);
            intervalStartGameTime = setInterval(gameUpdate, setIntervalTime())
        }
    }


    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }

    if (snakeBody.length) {
        snakeBody[0] = [snake.x, snake.y];
    }


    context.fillStyle = snake.color;
    snake.x += snake.speedX * field.blockSize;
    snake.y += snake.speedY * field.blockSize;
    context.fillRect(snake.x, snake.y, field.blockSize, field.blockSize);

    for (let i = 0; i < snakeBody.length; i++) {
        context.fillRect(snakeBody[i][0], snakeBody[i][1], field.blockSize, field.blockSize);
    }

    const gameOverScore = document.getElementById('final-score');
    const gameOverTime = document.getElementById('time');

    if (snake.x < 0 || snake.x > field.cols * field.blockSize || snake.y < 0 || snake.y > field.rows * field.blockSize) {
        gameOver = true;
        gameOverMessage.style.visibility = 'visible'

        gameOverScore.innerHTML = score.innerHTML;
        gameOverTime.innerHTML = minsOutput.innerHTML + ':' + secondsOutput.innerHTML;
    }

    for (let i = 0; i < snakeBody.length; i++) {
        if (snake.x === snakeBody[i][0] && snake.y === snakeBody[i][1]) {
            gameOver = true;
            gameOverMessage.style.visibility = 'visible'

            gameOverScore.innerHTML = score.innerHTML;
            gameOverTime.innerHTML = minsOutput.innerHTML + ':' + secondsOutput.innerHTML;
        }
    }


}

function setFoodPosition() {
    let foodX = Math.floor(Math.random() * field.cols) * field.blockSize;
    let foodY = Math.floor(Math.random() * field.rows) * field.blockSize;

    let isFoodOnSnake = snakeBody.some((body) => {
        return body[0] === foodX && body[1] === foodY
    });

    if (!isFoodOnSnake) {
        food.x = foodX;
        food.y = foodY;
    } else {
        setFoodPosition();
    }
}





function snakeMovement(e) {
    if ((e.code === "ArrowUp" || e.code === "KeyW") && snake.speedY != 1) {
        snake.speedX = 0;
        snake.speedY = -1;
    } else if ((e.code === "ArrowDown" || e.code === "KeyS") && snake.speedY != -1) {
        snake.speedX = 0;
        snake.speedY = 1;
    }
    else if ((e.code === "ArrowLeft" || e.code === "KeyA") && snake.speedX != 1) {
        snake.speedX = -1;
        snake.speedY = 0;
    }
    else if ((e.code === "ArrowRight" || e.code === "KeyD") && snake.speedX != -1) {
        snake.speedX = 1;
        snake.speedY = 0;
    }

    if (isTimerRunning !== true) {
        startTimer();
        isTimerRunning = true;
    }
}




const restartBtn = document.getElementById('restart');
restartBtn.addEventListener('click', () => {
    gameOverMessage.style.visibility = 'hidden';
    location.reload()

});
