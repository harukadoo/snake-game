class BlockFeature {
    constructor(color) {
        this.blockSize = 28;
        this.color = color;

    }
}

class Field extends BlockFeature {
    constructor() {
        super('white')
        this.cols = 34;
        this.rows = 19;
    }
}

const field = new Field()


class Coordinates extends BlockFeature {
    constructor(x, y, color) {
        super(color);
        this.x = x;
        this.y = y;
    }
}

class Snake extends Coordinates {
    constructor() {
        super(0, 0, '#2eb82e')
        this.speedX = 0;
        this.speedY = 0;
    }
}

const snake = new Snake();

const snakeBody = [];

class Food extends Coordinates {
    constructor() {
        super(0, 0, 'img/strawberry5.png');
        this.image = new Image();
        this.image.src = this.color;
    }
}

const food = new Food();



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


// function setIntervalTime() {
//     let intervalTime = 0;
//     if (currentScore < 5) {
//         intervalTime = 210;

//     } else if (currentScore >= 5 && currentScore < 10) {
//         intervalTime = 180

//     } else if (currentScore >= 10 && currentScore < 15) {
//         intervalTime = 150
//     } else if (currentScore >= 15) {
//         intervalTime = 120
//     }

//     return intervalTime
// }


window.onload = function () {
    canvas = document.getElementById('field')
    canvas.height = field.rows * field.blockSize;
    canvas.width = field.cols * field.blockSize;
    this.context = canvas.getContext("2d");

    setFoodPosition()

    document.addEventListener('keyup', snakeMovement);



    // setInterval(gameUpdate, setIntervalTime());
    setInterval(gameUpdate, 120);

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

    //умова, якщо змія з'їла їжу 
    if (snake.x == food.x && snake.y == food.y) {
        snakeBody.push([snake.x, snake.y])
        setFoodPosition()

        currentScore++ //як раз тут і оновлюється currentScore
        score.innerHTML = currentScore;
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

    //умова якщо змія вийшла за поле
    if (snake.x < 0 || snake.x > field.cols * field.blockSize || snake.y < 0 || snake.y > field.rows * field.blockSize) {
        gameOver = true;
        gameOverMessage.style.visibility = 'visible'

        gameOverScore.innerHTML = score.innerHTML;
        gameOverTime.innerHTML = minsOutput.innerHTML + ':' + secondsOutput.innerHTML;
    }

    //якщо змія зіштовхнулася з собою
    for (let i = 0; i < snakeBody.length; i++) {
        if (snake.x == snakeBody[i][0] && snake.y == snakeBody[i][1]) {
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
    if ((e.code == "ArrowUp" || e.code == "KeyW") && snake.speedY != 1) {
        snake.speedX = 0;
        snake.speedY = -1;
    } else if ((e.code == "ArrowDown" || e.code == "KeyS") && snake.speedY != -1) {
        snake.speedX = 0;
        snake.speedY = 1;
    }
    else if ((e.code == "ArrowLeft" || e.code == "KeyA") && snake.speedX != 1) {
        snake.speedX = -1;
        snake.speedY = 0;
    }
    else if ((e.code == "ArrowRight" || e.code == "KeyD") && snake.speedX != -1) {
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
